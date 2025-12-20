import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

import { getRateLimitConfig } from "@/utils/env";
import { logger } from "@/utils/logger";

interface RateLimitResult {
  allowed: boolean;
  limit?: number;
  remaining?: number;
  reset?: number;
  response?: Response;
}

const intlFormatter =
  typeof Intl !== "undefined" && Intl.RelativeTimeFormat
    ? new Intl.RelativeTimeFormat("en", { numeric: "auto" })
    : null;

const getClientIdentifier = (request: Request): string => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const [first] = forwardedFor.split(",").map((value) => value.trim());
    if (first) {
      return first;
    }
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  const cfConnecting = request.headers.get("cf-connecting-ip");
  if (cfConnecting) {
    return cfConnecting;
  }

  return request.headers.get("x-client-ip") ?? "anonymous";
};

const rateLimitConfig = getRateLimitConfig();

const limiter =
  rateLimitConfig.enabled &&
  rateLimitConfig.redisUrl &&
  rateLimitConfig.redisToken
    ? new Ratelimit({
        redis: new Redis({
          url: rateLimitConfig.redisUrl,
          token: rateLimitConfig.redisToken,
        }),
        limiter: Ratelimit.slidingWindow(
          rateLimitConfig.limit,
          rateLimitConfig.windowMs,
        ),
        analytics: true,
        prefix: rateLimitConfig.prefix,
      })
    : null;

const formatRetryAfter = (msUntilReset: number): string => {
  if (!intlFormatter) {
    return `${Math.round(msUntilReset / 1000)} seconds`;
  }
  const seconds = Math.ceil(msUntilReset / 1000);
  return intlFormatter.format(seconds, "second");
};

export const enforceApiRateLimit = async (
  request: Request,
  identifier?: string,
): Promise<RateLimitResult> => {
  if (!limiter) {
    return { allowed: true };
  }

  try {
    const key = identifier ?? getClientIdentifier(request);
    const result = await limiter.limit(key);

    if (result.success) {
      return {
        allowed: true,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    }

    const msUntilReset = Math.max(result.reset - Date.now(), 0);
    const headers = new Headers({
      "Retry-After": Math.ceil(msUntilReset / 1000).toString(),
      "X-RateLimit-Limit": result.limit.toString(),
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": Math.ceil(result.reset / 1000).toString(),
    });

    const response = new Response(
      JSON.stringify({
        error: "Too many requests. Please slow down.",
        retryAfter: formatRetryAfter(msUntilReset),
      }),
      {
        status: 429,
        headers,
      },
    );

    return {
      allowed: false,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      response,
    };
  } catch (error) {
    logger.warn("Rate limiter failed; allowing request to continue.", error);
    return { allowed: true };
  }
};

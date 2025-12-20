/**
 * AI Image Analysis API Route
 *
 * Handles Gemini Vision AI requests for project import:
 * - Business Model Canvas image analysis
 * - Pitch deck slide extraction
 * - Wireframe/mockup analysis
 * - Server-side API key protection
 * - Rate limiting
 *
 * @route POST /api/ai/analyze-image
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Lazy initialization of rate limiter
let ratelimitInstance: Ratelimit | null = null;

function getRateLimiter(): Ratelimit | null {
  if (ratelimitInstance) {
    return ratelimitInstance;
  }

  if (
    !process.env["UPSTASH_REDIS_REST_URL"] ||
    !process.env["UPSTASH_REDIS_REST_TOKEN"]
  ) {
    return null;
  }

  try {
    const redis = new Redis({
      url: process.env["UPSTASH_REDIS_REST_URL"],
      token: process.env["UPSTASH_REDIS_REST_TOKEN"],
    });

    // Lower limit for image analysis (more expensive)
    ratelimitInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, 60 * 1000), // 5 requests per minute
      analytics: true,
      prefix: "ratelimit:ai:image",
    });

    return ratelimitInstance;
  } catch (error) {
    console.error("Failed to initialize rate limiter:", error);
    return null;
  }
}

// Initialize Gemini AI with vision model
const apiKey = process.env["GEMINI_API_KEY"];
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const visionModel = genAI?.getGenerativeModel({ model: "gemini-1.5-flash" });

interface RequestBody {
  imageData: string; // base64
  mimeType: string;
  prompt: string;
}

function isRequestBody(value: unknown): value is RequestBody {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const body = value as Record<string, unknown>;
  return (
    typeof body["imageData"] === "string" &&
    typeof body["mimeType"] === "string" &&
    typeof body["prompt"] === "string"
  );
}

/**
 * GET - Health check
 */
export function GET() {
  return NextResponse.json({
    status: "ok",
    configured: !!genAI && !!visionModel,
    model: "gemini-1.5-flash",
  });
}

/**
 * POST - Analyze image
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Gemini is configured
    if (!visionModel) {
      return NextResponse.json(
        {
          error: "AI service not configured",
          fallback: true,
        },
        { status: 503 },
      );
    }

    // Parse request body
    const rawBody = (await request.json()) as unknown;
    if (!isRequestBody(rawBody)) {
      return NextResponse.json(
        {
          error:
            "Invalid request body. Provide imageData, mimeType, and prompt.",
        },
        { status: 400 },
      );
    }

    const { imageData, mimeType, prompt } = rawBody;

    // Validate input
    if (!imageData || !mimeType || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields: imageData, mimeType, prompt" },
        { status: 400 },
      );
    }

    // Validate image size (max 4MB for base64)
    const imageSizeBytes = (imageData.length * 3) / 4;
    const maxSizeBytes = 4 * 1024 * 1024; // 4MB
    if (imageSizeBytes > maxSizeBytes) {
      return NextResponse.json(
        { error: "Image too large. Maximum size is 4MB." },
        { status: 413 },
      );
    }

    // Validate MIME type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ];
    if (!allowedTypes.includes(mimeType)) {
      return NextResponse.json(
        {
          error: `Unsupported image type: ${mimeType}. Allowed: ${allowedTypes.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Rate limiting (per IP)
    const ratelimit = getRateLimiter();
    if (ratelimit) {
      const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
      const { success, limit, remaining, reset } = await ratelimit.limit(ip);

      if (!success) {
        const retryAfter = Math.ceil((reset - Date.now()) / 1000);
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            limit,
            remaining,
            retryAfter,
          },
          { status: 429, headers: { "Retry-After": String(retryAfter) } },
        );
      }
    }

    // Call Gemini Vision API
    const imagePart = {
      inlineData: {
        data: imageData,
        mimeType,
      },
    };

    const result = await visionModel.generateContent([prompt, imagePart]);
    const response = result.response;
    const text = response.text();

    // Return structured response
    return NextResponse.json({
      text,
      model: "gemini-1.5-flash",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Image analysis error:", error);

    // Handle Gemini-specific errors
    if (error instanceof Error) {
      if (error.message.includes("quota")) {
        return NextResponse.json(
          {
            error: "AI service quota exceeded. Please try again later.",
            fallback: true,
          },
          { status: 429 },
        );
      }

      if (error.message.includes("safety")) {
        return NextResponse.json(
          {
            error:
              "Image content was flagged by safety filters. Please try a different image.",
          },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        error: "Failed to analyze image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

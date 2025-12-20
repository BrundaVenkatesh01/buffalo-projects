declare module "@upstash/ratelimit" {
  export interface LimitResult {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  }

  export class Ratelimit {
    constructor(config: {
      redis: unknown;
      limiter: unknown;
      analytics?: boolean;
      prefix?: string;
    });

    static slidingWindow(limit: number, interval: number): unknown;

    limit(identifier: string): Promise<LimitResult>;
  }
}

declare module "@upstash/redis" {
  export class Redis {
    constructor(config: { url: string; token: string });
  }
}

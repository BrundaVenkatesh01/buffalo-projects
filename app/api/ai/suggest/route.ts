/**
 * AI Suggestions API Route
 *
 * Handles Gemini AI requests with:
 * - Server-side API key protection
 * - Per-user rate limiting (Upstash Redis)
 * - Request validation
 * - Error handling
 *
 * @route POST /api/ai/suggest
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Lazy initialization of rate limiter to avoid build-time errors
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

    ratelimitInstance = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, 60 * 1000), // 10 requests per minute
      analytics: true,
      prefix: "ratelimit:ai",
    });

    return ratelimitInstance;
  } catch (error) {
    console.error("Failed to initialize rate limiter:", error);
    return null;
  }
}

// Initialize Gemini AI (server-side only)
const apiKey = process.env["GEMINI_API_KEY"];
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
const model = genAI?.getGenerativeModel({ model: "gemini-2.5-flash" });

interface RequestBody {
  prompt: string;
  type?: "bmc" | "interview" | "mvp" | "advice" | "general";
  context?: {
    projectName?: string;
    description?: string;
    bmcData?: Record<string, string>;
    stage?: string;
    section?: string;
    customerSegment?: string;
    projectType?: string;
    question?: string;
  };
}

interface AIResponse {
  text: string;
  suggestions?: string[];
  insights?: string;
  confidence?: number;
}

/**
 * Extract suggestions from AI response text
 */
function extractSuggestions(text: string): string[] {
  const suggestions: string[] = [];

  // Look for numbered lists (1. 2. 3.)
  const numberedMatches = text.match(/\d+\.\s*([^.\n]+(?:\.[^.\n]+)?)/g);
  if (numberedMatches) {
    numberedMatches.forEach((match) => {
      suggestions.push(match.replace(/^\d+\.\s*/, "").trim());
    });
  }

  // Look for bullet points (• - *)
  const bulletMatches = text.match(/[•\-*]\s*([^•\-*\n]+)/g);
  if (bulletMatches && suggestions.length === 0) {
    bulletMatches.forEach((match) => {
      suggestions.push(match.replace(/^[•\-*]\s*/, "").trim());
    });
  }

  // If no structured suggestions, split by sentences
  if (suggestions.length === 0) {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20);
    return sentences.slice(0, 3).map((s) => s.trim());
  }

  return suggestions.slice(0, 5);
}

/**
 * Extract key insights from AI response
 */
function extractInsights(text: string): string {
  const insightPatterns = [
    /key insight[s]?:?\s*([^.]+)/i,
    /important[ly]?:?\s*([^.]+)/i,
    /note:?\s*([^.]+)/i,
    /remember:?\s*([^.]+)/i,
  ];

  for (const pattern of insightPatterns) {
    const match = text.match(pattern);
    if (match && typeof match[1] === "string") {
      return match[1].trim();
    }
  }

  // Return first meaningful sentence
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 30);
  return (
    sentences[0]?.trim() ||
    "Consider iterating based on feedback and market validation."
  );
}

/**
 * Build prompt based on request type
 */
function buildPrompt(body: RequestBody): string {
  const { prompt, type, context } = body;

  // If prompt is provided directly, use it
  if (prompt && (!type || type === "general")) {
    return prompt;
  }

  // Build structured prompts based on type
  switch (type) {
    case "bmc":
      return `As a business advisor helping with a Business Model Canvas, provide suggestions for the ${context?.section || "section"}.

Current content: "${prompt}"

${
  context?.bmcData
    ? `Other sections for context:
${Object.entries(context.bmcData)
  .map(([key, value]) => `${key}: ${value || "Not filled"}`)
  .join("\n")}`
    : ""
}

Project context: ${context?.projectName || "Startup project"}
${context?.description ? `Description: ${context.description}` : ""}

Provide 3 specific, actionable suggestions to improve the ${context?.section || "section"}. Focus on:
- Practical implementation
- Clear value creation
- Market validation
- Competitive advantage

Format your response as:
1. [First suggestion]
2. [Second suggestion]
3. [Third suggestion]

Key insight: [One sentence summary of most important consideration]`;

    case "interview":
      return `Generate customer interview questions for validating a business idea.

Target customer segment: "${context?.customerSegment || prompt}"
Project: ${context?.projectName || "New venture"}
${context?.description ? `Description: ${context.description}` : ""}

Create 5 open-ended questions that will help validate:
- Problem existence and severity
- Current solutions and pain points
- Willingness to pay
- Decision-making process
- Feature priorities

Format as:
1. [Question]
2. [Question]
3. [Question]
4. [Question]
5. [Question]

Key insight: What's the most critical assumption to validate?`;

    case "mvp":
      return `Suggest MVP features for a ${context?.projectType || "startup"} project.

Project: ${context?.projectName || "Startup"}
${context?.description ? `Description: ${context.description}` : ""}
${context?.bmcData?.["valuePropositions"] ? `Value Proposition: ${context.bmcData["valuePropositions"]}` : ""}

Recommend 3-5 must-have features for an MVP that:
- Solve the core problem
- Can be built quickly (2-4 weeks)
- Provide immediate value
- Enable learning from users

Format as:
1. [Feature name]: [Brief description and why it's essential]
2. [Feature name]: [Brief description and why it's essential]
3. [Feature name]: [Brief description and why it's essential]

Key insight: What's the riskiest assumption this MVP should test?`;

    case "advice":
      return `As an experienced business advisor, answer this question:

"${context?.question || prompt}"

Context:
- Project: ${context?.projectName || "Startup venture"}
- Description: ${context?.description || "Not specified"}
- Stage: ${context?.stage || "Early stage"}
- Value Proposition: ${context?.bmcData?.["valuePropositions"] || "In development"}
- Customer Segments: ${context?.bmcData?.["customerSegments"] || "Being identified"}

Provide:
1. Direct answer to the question
2. 2-3 actionable next steps
3. Common pitfalls to avoid
4. Success metrics to track

Be specific, practical, and encouraging. Focus on execution.`;

    default:
      return prompt;
  }
}

/**
 * POST /api/ai/suggest
 * Generate AI suggestions for business model development
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const raw: unknown = await request.json();
    if (typeof raw !== "object" || raw === null) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }
    const body = raw as Partial<RequestBody>;

    // Validate prompt
    if (
      !body.prompt ||
      typeof body.prompt !== "string" ||
      body.prompt.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid prompt: must be a non-empty string" },
        { status: 400 },
      );
    }

    // Validate prompt length (max 5000 characters)
    if (body.prompt.length > 5000) {
      return NextResponse.json(
        { error: "Prompt too long: maximum 5000 characters" },
        { status: 400 },
      );
    }

    // Get user ID from auth header or IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : request.headers.get("x-real-ip");
    const userId = request.headers.get("x-user-id") || ip || "anonymous";

    // Check rate limit
    const ratelimit = getRateLimiter();
    if (ratelimit) {
      const { success, limit, remaining, reset } =
        await ratelimit.limit(userId);

      // Add rate limit headers
      const headers = new Headers();
      headers.set("X-RateLimit-Limit", limit.toString());
      headers.set("X-RateLimit-Remaining", remaining.toString());
      headers.set("X-RateLimit-Reset", reset.toString());

      if (!success) {
        return NextResponse.json(
          {
            error: "Rate limit exceeded",
            retryAfter: Math.ceil((reset - Date.now()) / 1000),
          },
          { status: 429, headers },
        );
      }
    }

    // Check if Gemini AI is available
    if (!genAI || !model) {
      return NextResponse.json(
        {
          error: "AI service unavailable",
          fallback: true,
          text: "AI suggestions are temporarily unavailable. Please try again later.",
          suggestions: [
            "Focus on validated learning from customer interviews",
            "Test your riskiest assumptions first",
            "Build the simplest version that delivers value",
          ],
          insights:
            "Success comes from solving real problems for real customers.",
          confidence: 0.5,
        },
        { status: 503 },
      );
    }

    // Build full prompt - at this point we know prompt is valid from validation above
    const fullPrompt = buildPrompt(body as RequestBody);

    // Generate content with Gemini
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response?.text() || "";

    // Parse response
    const aiResponse: AIResponse = {
      text,
      suggestions: extractSuggestions(text),
      insights: extractInsights(text),
      confidence: 0.85,
    };

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error("AI suggestion error:", error);

    // Check if it's a Gemini API error
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "AI configuration error" },
          { status: 500 },
        );
      }
      if (error.message.includes("quota")) {
        return NextResponse.json(
          {
            error: "AI quota exceeded",
            fallback: true,
            text: "Our AI quota has been reached. Suggestions will be available shortly.",
            suggestions: [
              "Talk to real customers instead - they're the best source of insights",
              "Review successful examples in your industry",
              "Consult with mentors in the Buffalo ecosystem",
            ],
            insights: "Sometimes the best advice comes from human experience.",
            confidence: 0.7,
          },
          { status: 503 },
        );
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        fallback: true,
        text: "Unable to generate suggestions at this time.",
        suggestions: [
          "Focus on customer validation",
          "Test assumptions with real users",
          "Iterate based on feedback",
        ],
        insights:
          "Build, measure, learn - the core of lean startup methodology.",
        confidence: 0.6,
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/ai/suggest
 * Health check endpoint
 */
export function GET() {
  const isConfigured = !!apiKey;
  const redisConfigured = !!(
    process.env["UPSTASH_REDIS_REST_URL"] &&
    process.env["UPSTASH_REDIS_REST_TOKEN"]
  );

  return NextResponse.json({
    status: "ok",
    configured: isConfigured,
    rateLimitEnabled: redisConfigured,
    model: "gemini-2.5-flash",
    rateLimit: redisConfigured
      ? "10 requests per minute per user"
      : "unlimited (dev mode)",
  });
}

/**
 * Gemini AI Service (Client-side)
 *
 * Calls server-side API route for AI suggestions.
 * Server route handles:
 * - API key protection
 * - Rate limiting (10 req/min per user)
 * - Request validation
 *
 * @deprecated Direct API key usage - now proxied through /api/ai/suggest
 */

import { logger } from "../utils/logger";

interface GeminiResponse {
  text: string;
  suggestions?: string[];
  insights?: string;
  confidence?: number;
  fallback?: boolean;
  error?: string;
}

interface ProjectContext {
  projectName?: string;
  description?: string;
  bmcData?: Record<string, unknown>;
  stage?: string;
  [key: string]: unknown;
}

function extractErrorMessage(body: unknown, fallback: string): string {
  if (typeof body === "object" && body !== null) {
    const record = body as Record<string, unknown>;
    if (typeof record["error"] === "string" && record["error"].trim()) {
      return record["error"];
    }
  }

  return fallback;
}

function extractTextResponse(body: unknown): string {
  if (typeof body !== "object" || body === null) {
    return "";
  }

  const record = body as Record<string, unknown>;
  if (typeof record["text"] === "string") {
    return record["text"];
  }
  if (typeof record["response"] === "string") {
    return record["response"];
  }

  return "";
}

export class GeminiService {
  private static cache = new Map<string, GeminiResponse>();
  private static apiEndpoint = "/api/ai/suggest";

  private static resolveEndpoint(path: string): string {
    const trimmedPath = path.trim();

    try {
      return new URL(trimmedPath).toString();
    } catch {
      const baseUrl = this.getApiBaseUrl();
      return new URL(trimmedPath, baseUrl).toString();
    }
  }

  private static getApiBaseUrl(): string {
    if (
      typeof window !== "undefined" &&
      typeof window.location?.origin === "string" &&
      window.location.origin
    ) {
      return window.location.origin;
    }

    if (typeof process !== "undefined") {
      const envUrl =
        process.env["NEXT_PUBLIC_APP_URL"] ||
        process.env["NEXT_PUBLIC_BASE_URL"] ||
        process.env["NEXT_PUBLIC_VERCEL_URL"] ||
        process.env["VITE_APP_URL"] ||
        process.env["VITE_BASE_URL"];

      if (envUrl && envUrl.trim()) {
        return envUrl.startsWith("http")
          ? envUrl
          : `https://${envUrl.replace(/^https?:\/\//, "")}`;
      }
    }

    return "http://localhost:3000";
  }

  /**
   * Call server-side AI API
   */
  private static async callAI(
    prompt: string,
    type: "bmc" | "interview" | "mvp" | "advice" | "general" = "general",
    context?: Record<string, unknown>,
  ): Promise<GeminiResponse> {
    try {
      const endpoint = this.resolveEndpoint(this.apiEndpoint);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          type,
          context,
        }),
      });

      // Handle rate limiting
      if (response.status === 429) {
        const data: unknown = await response.json();
        const retryAfter =
          typeof data === "object" &&
          data &&
          "retryAfter" in data &&
          typeof (data as { retryAfter?: unknown }).retryAfter === "number"
            ? (data as { retryAfter: number }).retryAfter
            : 60;
        logger.warn(`Rate limit exceeded. Retry after ${retryAfter}s`);

        return {
          text: `You've reached the AI suggestion limit (10 per minute). Please wait ${retryAfter} seconds before trying again.`,
          suggestions: [
            "Take a moment to review your current content",
            "Consider what real customers have told you",
            "Consult with Buffalo mentors for personalized advice",
          ],
          insights:
            "Sometimes stepping back and reflecting is more valuable than generating new ideas.",
          confidence: 0.7,
          error: "rate_limit",
        };
      }

      // Handle service unavailable
      if (response.status === 503) {
        const data: unknown = await response.json();
        const obj =
          typeof data === "object" && data
            ? (data as Record<string, unknown>)
            : {};
        return {
          text:
            typeof obj["text"] === "string"
              ? obj["text"]
              : "AI service temporarily unavailable",
          suggestions: Array.isArray(obj["suggestions"])
            ? (obj["suggestions"] as string[])
            : [],
          insights: typeof obj["insights"] === "string" ? obj["insights"] : "",
          confidence:
            typeof obj["confidence"] === "number" ? obj["confidence"] : 0.5,
          fallback: true,
        };
      }

      // Handle other errors
      if (!response.ok) {
        const data: unknown = await response.json();
        const message =
          typeof data === "object" &&
          data &&
          "error" in data &&
          typeof (data as { error?: unknown }).error === "string"
            ? (data as { error: string }).error
            : `AI API error: ${response.status}`;
        throw new Error(message);
      }

      const data: unknown = await response.json();
      // naively trust shape; in practice the API returns our expected shape
      return data as GeminiResponse;
    } catch (error) {
      logger.error("AI API call failed:", error);

      // Return intelligent fallback
      return this.getIntelligentFallback(prompt);
    }
  }

  /**
   * Generate content with AI (cached)
   */
  static async generateContent(
    prompt: string,
    useCache = true,
    type: "general" | "bmc" | "interview" | "mvp" | "advice" = "general",
    context?: Record<string, unknown>,
  ): Promise<GeminiResponse> {
    // Check cache first
    if (useCache && this.cache.has(prompt)) {
      return this.cache.get(prompt)!;
    }

    try {
      const response = await this.callAI(prompt, type, context);

      // Cache successful responses
      if (useCache && !response.error) {
        this.cache.set(prompt, response);
      }

      return response;
    } catch (error) {
      logger.error("Gemini API error:", error);
      const fallback = this.getIntelligentFallback(prompt);
      if (useCache) {
        this.cache.set(prompt, fallback);
      }
      return fallback;
    }
  }

  /**
   * Business Model Canvas specific prompts
   */
  private static buildBmcPrompt(
    section: string,
    currentContent: string,
    otherSections: Record<string, string>,
    projectContext?: ProjectContext,
  ): string {
    const otherSectionLines =
      Object.entries(otherSections)
        .map(([key, value]) => `${key}: ${value || "—"}`)
        .join("\n") || "No additional sections provided";

    const projectNameLine = projectContext?.projectName
      ? `Project: ${projectContext.projectName}`
      : "Project: (unspecified)";
    const descriptionLine = projectContext?.description
      ? `Description: ${projectContext.description}`
      : "Description: (none provided)";

    return [
      `Business Model Canvas insight for ${section}`,
      `Current content: ${currentContent || "None"}`,
      "Key insight:",
      `Additional sections:\n${otherSectionLines}`,
      projectNameLine,
      descriptionLine,
    ].join("\n");
  }

  private static buildInterviewPrompt(
    customerSegment: string,
    projectContext?: ProjectContext,
  ): string {
    return [
      `Customer interviews for ${customerSegment}`,
      `Project: ${projectContext?.projectName ?? "Unspecified project"}`,
      `Description: ${projectContext?.description ?? "No description provided"}`,
      "Focus on past behavior, motivations, and current challenges.",
    ].join("\n");
  }

  private static buildMvpPrompt(
    projectType: string,
    projectContext?: ProjectContext,
  ): string {
    const rawValueProp = projectContext?.bmcData?.["valuePropositions"];
    const valueProp =
      typeof rawValueProp === "string"
        ? rawValueProp
        : "Unique value proposition not provided";

    return [
      `MVP roadmap for a ${projectType}`,
      `Project: ${projectContext?.projectName ?? "Unspecified project"}`,
      `Description: ${projectContext?.description ?? "No description provided"}`,
      `Value proposition: ${valueProp}`,
    ].join("\n");
  }

  static async getBMCSuggestions(
    section: string,
    currentContent: string,
    otherSections: Record<string, string>,
    projectContext?: ProjectContext,
  ): Promise<GeminiResponse> {
    const cacheKey = `bmc:${section}:${currentContent}:${projectContext?.projectName || ""}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const prompt = this.buildBmcPrompt(
      section,
      currentContent,
      otherSections,
      projectContext,
    );

    try {
      const response = await this.generateContent(prompt, false, "bmc", {
        section,
        projectName: projectContext?.projectName,
        description: projectContext?.description,
        bmcData: otherSections,
        stage: projectContext?.stage,
      });

      if (!response.error) {
        this.cache.set(cacheKey, response);
      }

      return response;
    } catch (error) {
      logger.error("BMC suggestions error:", error);
      const fallback = this.getIntelligentFallback(
        `${section}: ${currentContent}`,
      );
      this.cache.set(cacheKey, fallback);
      return fallback;
    }
  }

  /**
   * Customer interview questions
   */
  static async getInterviewQuestions(
    customerSegment: string,
    projectContext?: ProjectContext,
  ): Promise<GeminiResponse> {
    const cacheKey = `interview:${customerSegment}:${projectContext?.projectName || ""}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const prompt = this.buildInterviewPrompt(customerSegment, projectContext);

    try {
      const response = await this.generateContent(prompt, false, "interview", {
        customerSegment,
        projectName: projectContext?.projectName,
        description: projectContext?.description,
      });

      if (!response.error) {
        this.cache.set(cacheKey, response);
      }

      return response;
    } catch (error) {
      logger.error("Interview questions error:", error);
      const fallback = this.getInterviewFallback(customerSegment);
      this.cache.set(cacheKey, fallback);
      return fallback;
    }
  }

  /**
   * MVP feature suggestions
   */
  static async getMVPSuggestions(
    projectType: string,
    projectContext?: ProjectContext,
  ): Promise<GeminiResponse> {
    const cacheKey = `mvp:${projectType}:${projectContext?.projectName || ""}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const prompt = this.buildMvpPrompt(projectType, projectContext);

    try {
      const response = await this.generateContent(prompt, false, "mvp", {
        projectType,
        projectName: projectContext?.projectName,
        description: projectContext?.description,
        bmcData: projectContext?.bmcData,
      });

      if (!response.error) {
        this.cache.set(cacheKey, response);
      }

      return response;
    } catch (error) {
      logger.error("MVP suggestions error:", error);
      const fallback = this.getMVPFallback();
      this.cache.set(cacheKey, fallback);
      return fallback;
    }
  }

  /**
   * Business coaching and advice
   */
  static async getBusinessAdvice(
    question: string,
    projectContext?: ProjectContext,
  ): Promise<GeminiResponse> {
    const cacheKey = `advice:${question}:${projectContext?.projectName || ""}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await this.callAI(question, "advice", {
        question,
        projectName: projectContext?.projectName,
        description: projectContext?.description,
        stage: projectContext?.stage,
        bmcData: projectContext?.bmcData,
      });

      if (!response.error) {
        this.cache.set(cacheKey, response);
      }

      return response;
    } catch (error) {
      logger.error("Business advice error:", error);
      const fallback = this.getIntelligentFallback(question);
      this.cache.set(cacheKey, fallback);
      return fallback;
    }
  }

  /**
   * Intelligent fallback when API is not available
   */
  private static getIntelligentFallback(prompt: string): GeminiResponse {
    const promptLower = prompt.toLowerCase();

    // Determine context from prompt
    if (promptLower.includes("value proposition")) {
      return {
        text: "Focus on clearly articulating the unique value you provide. Consider: What specific problem do you solve? How is your solution 10x better than alternatives? What measurable benefits do customers gain?",
        suggestions: [
          "Quantify the value - use specific numbers, time saved, or costs reduced",
          "Interview 5 customers to validate that this problem is worth solving",
          "Create a one-sentence value prop using: We help [customer] achieve [outcome] by [unique approach]",
        ],
        insights:
          "The best value propositions focus on outcomes, not features.",
        confidence: 0.7,
        fallback: true,
      };
    }

    if (promptLower.includes("customer") && promptLower.includes("segment")) {
      return {
        text: "Define your customer segments with precision. Start narrow and expand. Consider demographics, behaviors, and specific pain points.",
        suggestions: [
          "Create 2-3 detailed customer personas with names, goals, and frustrations",
          "Identify the segment with the most urgent problem and highest willingness to pay",
          "Map where these customers currently look for solutions",
        ],
        insights:
          "Better to delight 100 customers than to mildly please 10,000.",
        confidence: 0.7,
        fallback: true,
      };
    }

    if (promptLower.includes("revenue") || promptLower.includes("pricing")) {
      return {
        text: "Design revenue streams that align with customer value perception and buying behavior. Test pricing early and often.",
        suggestions: [
          "Research what customers currently pay for alternative solutions",
          "Start with value-based pricing: charge 10-20% of the value you create",
          "Consider subscription models for recurring value, one-time for single problems",
        ],
        insights: "Price based on value delivered, not cost to produce.",
        confidence: 0.7,
        fallback: true,
      };
    }

    // Generic business advice fallback
    return {
      text: "Focus on validated learning and rapid iteration. Every assumption is a risk until proven with real customer behavior.",
      suggestions: [
        "Identify your riskiest assumption and test it this week",
        "Talk to 5 potential customers before building anything",
        "Measure progress by learning velocity, not feature count",
      ],
      insights:
        "Success comes from solving real problems for real people who will really pay.",
      confidence: 0.6,
      fallback: true,
    };
  }

  /**
   * Interview questions fallback
   */
  private static getInterviewFallback(segment: string): GeminiResponse {
    return {
      text: `Customer interview questions for: ${segment}`,
      suggestions: [
        `Tell me about the last time you faced [the problem your product solves]`,
        "What solutions have you tried? What worked and what didn't?",
        "If this problem went away tomorrow, how would your life/work change?",
        "How much time/money do you currently spend dealing with this?",
        "Who else is involved in deciding whether to use a solution like this?",
      ],
      insights:
        "Ask about past behavior, not future intentions. Customers often don't know what they want until they see it.",
      confidence: 0.75,
      fallback: true,
    };
  }

  /**
   * MVP suggestions fallback
   */
  private static getMVPFallback(): GeminiResponse {
    return {
      text: "Build the simplest version that solves the core problem.",
      suggestions: [
        "Core feature that delivers the main value proposition",
        "Simple onboarding to get users started quickly",
        "Basic analytics to measure if it's solving the problem",
        "Feedback mechanism to learn from early users",
      ],
      insights:
        "If you're not embarrassed by your MVP, you launched too late. - Reid Hoffman",
      confidence: 0.7,
      fallback: true,
    };
  }

  /**
   * Clear cache periodically
   */
  static clearCache(): void {
    this.cache.clear();
  }

  /**
   * Analyze an image with AI (for project import)
   * Returns structured JSON response
   */
  static async analyzeImage(params: {
    imageData: string; // base64
    mimeType: string;
    prompt: string;
  }): Promise<string> {
    try {
      const endpoint = this.resolveEndpoint("/api/ai/analyze-image");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorBody: unknown = await response.json();
        throw new Error(
          extractErrorMessage(errorBody, "Image analysis failed"),
        );
      }

      const data: unknown = await response.json();
      return extractTextResponse(data);
    } catch (error) {
      logger.error("Image analysis error:", error);
      throw error;
    }
  }

  /**
   * Generate structured content (JSON) from AI
   * Used for project import and data extraction
   */
  static async generateStructuredContent(params: {
    prompt: string;
  }): Promise<string> {
    try {
      const endpoint = this.resolveEndpoint("/api/ai/suggest");
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: params.prompt,
          type: "general",
          structured: true, // Request JSON response
        }),
      });

      if (!response.ok) {
        const errorBody: unknown = await response.json();
        throw new Error(
          extractErrorMessage(
            errorBody,
            "Structured content generation failed",
          ),
        );
      }

      const data: unknown = await response.json();
      return extractTextResponse(data);
    } catch (error) {
      logger.error("Structured content generation error:", error);
      throw error;
    }
  }

  /**
   * Check if service is available (makes GET request to health endpoint)
   */
  static async isAvailable(): Promise<boolean> {
    try {
      const endpoint = this.resolveEndpoint(this.apiEndpoint);
      const response = await fetch(endpoint, { method: "GET" });
      if (!response.ok) {
        return false;
      }

      const data: unknown = await response.json();
      if (typeof data !== "object" || data === null) {
        return false;
      }
      const obj = data as Record<string, unknown>;
      const status = obj["status"];
      const configured = obj["configured"];
      return status === "ok" && configured === true;
    } catch {
      return false;
    }
  }
}

export const geminiService = GeminiService;

/**
 * Shared validation utilities for API routes
 *
 * This module provides common Zod schemas and helpers for validating
 * API requests with consistent error handling.
 */

import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Common validation schemas
 */
export const schemas = {
  // URL validation
  url: z.string().url("Invalid URL format"),

  // File upload validation
  file: z.object({
    name: z.string().min(1, "File name is required"),
    type: z.string().min(1, "File type is required"),
    size: z.number().positive("File size must be positive"),
  }),

  // Image analysis validation
  imageAnalysis: z.object({
    imageUrl: z.string().url("Invalid image URL"),
    context: z.string().optional(),
  }),

  // URL import validation
  urlImport: z.object({
    url: z.string().url("Invalid URL format"),
    extractType: z
      .enum(["full", "summary", "keywords"])
      .default("full")
      .optional(),
  }),

  // PDF import validation
  pdfImport: z.object({
    file: z.any(), // File object validated separately
    extractImages: z.boolean().default(false).optional(),
  }),

  // AI suggestion validation
  aiSuggestion: z.object({
    prompt: z
      .string()
      .min(1, "Prompt is required")
      .max(5000, "Prompt too long"),
    context: z.string().optional(),
    temperature: z.number().min(0).max(2).default(0.7).optional(),
  }),

  // Feature request validation
  featureRequest: z.object({
    title: z.string().min(1, "Title is required").max(200, "Title too long"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(2000, "Description too long"),
    category: z
      .enum(["feature", "bug", "improvement", "other"])
      .default("feature"),
    email: z.string().email("Invalid email").optional(),
  }),

  // TwentySix resource validation
  twentySixResource: z.object({
    email: z.string().email("Invalid email format"),
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name too long"),
    role: z.enum(["volunteer", "participant"]),
    message: z.string().max(500, "Message too long").optional(),
  }),
};

/**
 * Validation error response type
 */
export interface ValidationError {
  error: string;
  details?: z.ZodIssue[];
}

/**
 * Validate request body against a Zod schema
 *
 * @param request - The Next.js request object
 * @param schema - Zod schema to validate against
 * @returns Validated data or null if validation fails
 */
export async function validateRequest<T extends z.ZodType>(
  request: Request,
  schema: T,
): Promise<
  { success: true; data: z.infer<T> } | { success: false; error: NextResponse }
> {
  try {
    const body: unknown = await request.json();
    const validated = schema.parse(body);

    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: NextResponse.json<ValidationError>(
          {
            error: "Validation failed",
            details: error.issues,
          },
          { status: 400 },
        ),
      };
    }

    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: NextResponse.json<ValidationError>(
          {
            error: "Invalid JSON in request body",
          },
          { status: 400 },
        ),
      };
    }

    return {
      success: false,
      error: NextResponse.json<ValidationError>(
        {
          error: "Request validation failed",
        },
        { status: 400 },
      ),
    };
  }
}

/**
 * Validate request with safe parsing (doesn't throw)
 *
 * @param request - The Next.js request object
 * @param schema - Zod schema to validate against
 * @returns Safe parse result
 */
export async function safeValidateRequest<T extends z.ZodType>(
  request: Request,
  schema: T,
): Promise<z.ZodSafeParseSuccess<z.infer<T>> | z.ZodSafeParseError<unknown>> {
  try {
    const body: unknown = await request.json();
    return schema.safeParse(body);
  } catch (error) {
    return {
      success: false,
      error: new z.ZodError([
        {
          code: "custom",
          message:
            error instanceof Error ? error.message : "Failed to parse request",
          path: [],
        },
      ]),
    };
  }
}

/**
 * Create a standardized error response
 *
 * @param message - Error message
 * @param status - HTTP status code
 * @param details - Optional error details
 */
export function errorResponse(
  message: string,
  status: number = 400,
  details?: unknown,
): NextResponse<ValidationError> {
  const response: ValidationError = { error: message };
  if (details) {
    response.details = details as z.ZodIssue[];
  }
  return NextResponse.json<ValidationError>(response, { status });
}

/**
 * Create a standardized success response
 *
 * @param data - Response data
 * @param status - HTTP status code
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
): NextResponse<T> {
  return NextResponse.json(data, { status });
}

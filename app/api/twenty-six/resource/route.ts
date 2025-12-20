import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { firebaseDatabase } from "@/services/firebaseDatabase";

/**
 * POST /api/twenty-six/resource
 * Create a new TwentySix resource volunteer sign-up
 *
 * Body:
 * {
 *   name: string;
 *   email: string;
 *   expertise: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as unknown;

    const { name, email, expertise } = body as {
      name?: string;
      email?: string;
      expertise?: string;
    };

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    if (!expertise?.trim()) {
      return NextResponse.json(
        { error: "Expertise/help description is required" },
        { status: 400 },
      );
    }

    // Validate field lengths
    if (name.length > 100) {
      return NextResponse.json(
        { error: "Name must be 100 characters or less" },
        { status: 400 },
      );
    }

    if (email.length > 255) {
      return NextResponse.json(
        { error: "Email must be 255 characters or less" },
        { status: 400 },
      );
    }

    if (expertise.length > 500) {
      return NextResponse.json(
        { error: "Expertise description must be 500 characters or less" },
        { status: 400 },
      );
    }

    // Create the resource in Firestore
    try {
      const resourceId = await firebaseDatabase.createTwentySixResource({
        name: name.trim(),
        email: email.trim(),
        expertise: expertise.trim(),
      });

      return NextResponse.json({
        success: true,
        message: "Successfully registered as a TwentySix resource",
        resourceId,
      });
    } catch (firestoreError) {
      // Handle duplicate email error
      if (
        firestoreError instanceof Error &&
        firestoreError.message.includes("already been registered")
      ) {
        return NextResponse.json(
          { error: "This email has already been registered" },
          { status: 409 }, // Conflict
        );
      }

      throw firestoreError;
    }
  } catch (error) {
    console.error("TwentySix resource API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to register as resource",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/twenty-six/resource
 * Get all TwentySix resources (admin only)
 *
 * Future implementation - requires admin authentication
 */
export function GET() {
  return NextResponse.json(
    { error: "Admin endpoint not yet implemented" },
    { status: 501 }, // Not Implemented
  );
}

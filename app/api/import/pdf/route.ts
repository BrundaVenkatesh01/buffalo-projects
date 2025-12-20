/**
 * PDF Import API Route
 *
 * Server-side PDF parsing to avoid loading 80MB pdf-parse library on client.
 * Extracts text from PDF files and returns it for AI analysis.
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Type definition for pdf-parse result
interface PDFParseResult {
  text: string;
  numpages: number;
  info: Record<string, unknown>;
  version: string;
}

const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

// Prevent static generation of this route
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Get PDF file from form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 },
      );
    }

    // Validate file size
    if (file.size > MAX_PDF_SIZE) {
      return NextResponse.json(
        {
          error: `PDF file too large. Maximum size is ${MAX_PDF_SIZE / 1024 / 1024}MB`,
        },
        { status: 400 },
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Dynamic import to prevent loading during build phase
    // pdf-parse has canvas dependencies that aren't available at build time
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse") as (
      buffer: Buffer,
    ) => Promise<PDFParseResult>;

    // Parse PDF
    const data = await pdfParse(buffer);

    // Extract text
    const text = data.text;

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        {
          error:
            "Could not extract meaningful text from PDF. The PDF may be image-based or encrypted.",
        },
        { status: 422 },
      );
    }

    // Return extracted text and metadata
    return NextResponse.json({
      success: true,
      text,
      metadata: {
        pages: data.numpages,
        info: data.info,
        version: data.version,
      },
    });
  } catch (error) {
    console.error("PDF parsing error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to parse PDF. The file may be corrupted or password-protected.",
      },
      { status: 500 },
    );
  }
}

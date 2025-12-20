/**
 * Project Import Service
 *
 * Handles importing projects from various sources:
 * - PDF files (Business Model Canvas images/diagrams)
 * - Images (JPG, PNG of canvases or wireframes)
 * - Text files (pitch decks, business plans)
 * - JSON exports from other tools
 * - URLs (shared documents, Miro boards, etc.)
 *
 * Uses Google Gemini API for intelligent extraction and structuring.
 */

import { geminiService } from "./geminiService";

import type { CanvasState, Workspace } from "@/types";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type ImportSource = "file" | "url" | "text";
export type FileType = "pdf" | "image" | "json" | "text" | "docx";
export type ExtractionMode = "auto" | "guided" | "manual";

export interface ImportOptions {
  source: ImportSource;
  fileType?: FileType;
  extractionMode?: ExtractionMode;
  enhanceWithAI?: boolean;
}

export interface ImportResult {
  // Project metadata
  projectName: string;
  description?: string;
  oneLiner?: string;
  stage?: "idea" | "building" | "testing" | "launched";
  tags: string[];

  // Business Model Canvas data
  bmcData: Partial<CanvasState>;

  // Import metadata
  confidence: number; // 0-1, overall extraction confidence
  extractedFields: string[]; // Which BMC fields were successfully extracted
  fieldConfidences?: Record<string, number>; // Per-field confidence scores (0-1)
  warnings: string[]; // Any issues during extraction
  suggestions: string[]; // AI suggestions for improvement

  // Original source
  originalFile?: File;
  originalText?: string;
}

interface FieldWithConfidence {
  value: string;
  confidence: number; // 0-1, AI's confidence in this specific field
}

interface GeminiExtractionResponse {
  projectName?: string;
  description?: string;
  oneLiner?: string;
  stage?: string;
  tags?: string[];
  // BMC fields can be either string (legacy) or {value, confidence} (new format)
  valuePropositions?: string | FieldWithConfidence;
  customerSegments?: string | FieldWithConfidence;
  channels?: string | FieldWithConfidence;
  customerRelationships?: string | FieldWithConfidence;
  revenueStreams?: string | FieldWithConfidence;
  keyResources?: string | FieldWithConfidence;
  keyActivities?: string | FieldWithConfidence;
  keyPartners?: string | FieldWithConfidence;
  costStructure?: string | FieldWithConfidence;
  confidence?: number; // Overall confidence
  fieldConfidences?: Record<string, number>; // Per-field confidence map (alternative format)
  warnings?: string[];
  suggestions?: string[];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONSTANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const BMC_EXTRACTION_PROMPT = `Extract business information into Business Model Canvas JSON format.

Fields: projectName, description (2-3 sentences: WHAT product does, WHO it serves - NOT website content/news), oneLiner, stage (idea|building|testing|launched), tags (max 5), valuePropositions, customerSegments, channels, customerRelationships, revenueStreams, keyResources, keyActivities, keyPartners, costStructure, confidence (0-1), fieldConfidences (per-field scores), warnings, suggestions.

RULES:
1. Only extract EXPLICITLY stated info - no assumptions
2. Leave undefined if not mentioned
3. description = business model description, NOT news/content/scores
4. Include fieldConfidences object with 0-1 scores per BMC field
5. Be conservative with confidence (0.8+ only if very clear)

EXAMPLE:
Input: "TaskFlow - AI task manager for professionals 25-45. $9.99/month subscription."
Output: {"projectName":"TaskFlow","description":"AI-powered task management app for working professionals aged 25-45. Uses machine learning to prioritize tasks based on deadlines and user behavior.","oneLiner":"TaskFlow helps busy professionals manage tasks by using AI to automatically prioritize work","stage":"building","tags":["productivity","SaaS","AI","mobile-app"],"valuePropositions":"AI task prioritization reducing decision fatigue","customerSegments":"Working professionals 25-45 struggling with task overload","revenueStreams":"$9.99/month subscription","confidence":0.75,"fieldConfidences":{"valuePropositions":0.9,"customerSegments":0.85,"revenueStreams":0.95},"warnings":["Channels unclear","Partners not mentioned"]}`;

const IMAGE_EXTRACTION_PROMPT = `${BMC_EXTRACTION_PROMPT}

This image may contain:
- A Business Model Canvas diagram
- A pitch deck slide
- A wireframe or mockup
- Handwritten notes
- A business plan excerpt

Extract all visible business information and structure it according to the Business Model Canvas format.`;

const TEXT_EXTRACTION_PROMPT = `${BMC_EXTRACTION_PROMPT}

The text may be:
- A pitch or elevator pitch
- Business plan sections
- Interview notes
- Customer research
- Product description

Extract the business model information and structure it accordingly.`;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];
const SUPPORTED_TEXT_TYPES = ["text/plain", "text/markdown"];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FILE VALIDATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds maximum allowed size (10MB)`,
    };
  }

  const isImage = SUPPORTED_IMAGE_TYPES.includes(file.type);
  const isText = SUPPORTED_TEXT_TYPES.includes(file.type);
  const isPDF = file.type === "application/pdf";
  const isJSON = file.type === "application/json";

  if (!isImage && !isText && !isPDF && !isJSON) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type}. Supported types: Images (JPG, PNG), PDF, Text, JSON`,
    };
  }

  return { valid: true };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STAGE MAPPING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Maps ProjectStage values to ImportResult stage values
 * ProjectStage has 7 values: idea, research, planning, building, testing, launching, scaling
 * ImportResult stage has 4 values: idea, building, testing, launched
 */
function mapStageToImportStage(
  stage: string | undefined,
): ImportResult["stage"] {
  if (!stage) {
    return undefined;
  }

  const stageMap: Record<string, ImportResult["stage"]> = {
    idea: "idea",
    research: "idea", // Research phase maps to idea
    planning: "building", // Planning phase maps to building
    building: "building",
    testing: "testing",
    launching: "launched", // Launching phase maps to launched
    launched: "launched",
    scaling: "launched", // Scaling phase maps to launched
  };

  return stageMap[stage.toLowerCase()];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FILE READING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove data URL prefix
      const base64Data = base64.split(",")[1];
      resolve(base64Data || "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EXTRACTION FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function extractFromImage(file: File): Promise<ImportResult> {
  const base64Data = await fileToBase64(file);

  try {
    // Add timeout to prevent hanging (30 seconds)
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(
        () => reject(new Error("Image analysis timed out after 30 seconds")),
        30000,
      );
    });

    const analysisPromise = geminiService.analyzeImage({
      imageData: base64Data,
      mimeType: file.type,
      prompt: IMAGE_EXTRACTION_PROMPT,
    });

    const response = await Promise.race([analysisPromise, timeoutPromise]);

    return parseGeminiResponse(response, file);
  } catch (error) {
    console.error("Image extraction failed:", error);

    if (error instanceof Error && error.message.includes("timed out")) {
      throw new Error(
        "Image analysis is taking too long. Please try a smaller image or try again later.",
      );
    }

    throw new Error(
      `Failed to extract information from image: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

async function extractFromText(
  content: string,
  file?: File,
): Promise<ImportResult> {
  try {
    const response = await geminiService.generateStructuredContent({
      prompt: `${TEXT_EXTRACTION_PROMPT}\n\n--- CONTENT TO ANALYZE ---\n${content}`,
    });

    return parseGeminiResponse(response, file, content);
  } catch (error) {
    console.error("Text extraction failed:", error);
    throw new Error(
      `Failed to extract information from text: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

async function extractFromJSON(file: File): Promise<ImportResult> {
  const jsonText = await fileToText(file);

  try {
    const data = JSON.parse(jsonText) as Partial<Workspace>;

    // If it's a Buffalo Projects export, use it directly
    if (data.code && data.bmcData) {
      return {
        projectName: data.projectName || "Imported Project",
        description: data.description,
        oneLiner: data.oneLiner,
        stage: mapStageToImportStage(data.stage as string | undefined),
        tags: data.tags || [],
        bmcData: data.bmcData,
        confidence: 1.0,
        extractedFields: Object.keys(data.bmcData || {}),
        warnings: [],
        suggestions: [
          "This is a Buffalo Projects export. All data imported successfully.",
        ],
        originalFile: file,
      };
    }

    // Otherwise, try to intelligently map fields
    return {
      projectName: data.projectName || "Imported Project",
      description: data.description,
      stage: mapStageToImportStage(data.stage as string | undefined),
      tags: data.tags || [],
      bmcData: {
        valuePropositions: data.bmcData?.valuePropositions || "",
        customerSegments: data.bmcData?.customerSegments || "",
        channels: data.bmcData?.channels || "",
        customerRelationships: data.bmcData?.customerRelationships || "",
        revenueStreams: data.bmcData?.revenueStreams ?? "",
        keyResources: data.bmcData?.keyResources ?? "",
        keyActivities: data.bmcData?.keyActivities ?? "",
        keyPartners: data.bmcData?.keyPartners ?? "",
        costStructure: data.bmcData?.costStructure ?? "",
      },
      confidence: 0.8,
      extractedFields: Object.keys(data.bmcData || {}),
      warnings: [
        "JSON structure may not match expected format. Please review imported data.",
      ],
      suggestions: [],
      originalFile: file,
    };
  } catch (error) {
    throw new Error(
      `Invalid JSON file: ${error instanceof Error ? error.message : "Parse error"}`,
    );
  }
}

async function extractFromPDF(file: File): Promise<ImportResult> {
  try {
    // Call server-side PDF parsing API to avoid loading 80MB pdf-parse on client
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/import/pdf", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = (await response.json()) as { error?: string };
      throw new Error(error.error ?? "Failed to parse PDF");
    }

    const { text: pdfText } = (await response.json()) as { text: string };

    if (!pdfText || pdfText.trim().length < 50) {
      throw new Error(
        "Could not extract meaningful text from PDF. The PDF may be image-based or encrypted.",
      );
    }

    // Use Gemini to extract structured data from PDF text
    const prompt = `Analyze this pitch deck or business document and extract Business Model Canvas information.

PDF Content:
${pdfText.slice(0, 8000)} ${pdfText.length > 8000 ? "...(truncated)" : ""}

Extract and structure the following information in JSON format:
{
  "projectName": "Name of the project/company",
  "oneLiner": "One sentence description (max 100 chars)",
  "description": "Detailed description (2-3 sentences)",
  "stage": "idea|research|planning|building|testing|launching|scaling",
  "tags": ["tag1", "tag2", "tag3"],
  "bmcData": {
    "keyPartners": "Who are the key partners?",
    "keyActivities": "What key activities does the value proposition require?",
    "keyResources": "What key resources does the value proposition require?",
    "valuePropositions": "What value do we deliver to the customer?",
    "customerRelationships": "What type of relationship does each customer segment expect?",
    "channels": "Through which channels do customer segments want to be reached?",
    "customerSegments": "For whom are we creating value? Who are our most important customers?",
    "costStructure": "What are the most important costs? Which key resources/activities are most expensive?",
    "revenueStreams": "For what value are customers willing to pay? How are they currently paying?"
  }
}

Focus on extracting concrete information from the document. If a field is not mentioned, leave it empty.`;

    const geminiResponse = await geminiService.generateContent(prompt);
    return parseGeminiResponse(geminiResponse.text, file);
  } catch (error) {
    console.error("PDF extraction failed:", error);

    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message.includes("pdf-parse")) {
        throw new Error(
          "Failed to parse PDF. The file may be corrupted or password-protected.",
        );
      } else if (error.message.includes("text")) {
        throw new Error(
          "Could not extract text from PDF. Try converting it to a text file first.",
        );
      }
    }

    throw new Error(
      `Failed to extract information from PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RESPONSE PARSING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function parseGeminiResponse(
  response: string,
  file?: File,
  originalText?: string,
): ImportResult {
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    const jsonStr = jsonMatch ? jsonMatch[1]! : response;

    const data = JSON.parse(jsonStr) as GeminiExtractionResponse;

    const bmcData: Partial<CanvasState> = {};
    const extractedFields: string[] = [];
    const fieldConfidences: Record<string, number> = {};

    // Helper to extract value and confidence from field (supports both string and {value, confidence} formats)
    const extractField = (
      fieldValue: string | FieldWithConfidence | undefined,
      fieldName: string,
    ): string | undefined => {
      if (!fieldValue) {
        return undefined;
      }

      if (typeof fieldValue === "string") {
        // Legacy string format - use fieldConfidences map if available
        if (data.fieldConfidences?.[fieldName]) {
          fieldConfidences[fieldName] = data.fieldConfidences[fieldName]!;
        }
        return fieldValue;
      } else {
        // New {value, confidence} format
        fieldConfidences[fieldName] = fieldValue.confidence;
        return fieldValue.value;
      }
    };

    // Map extracted fields to BMC structure
    const valuePropositions = extractField(
      data.valuePropositions,
      "valuePropositions",
    );
    if (valuePropositions) {
      bmcData.valuePropositions = valuePropositions;
      extractedFields.push("valuePropositions");
    }

    const customerSegments = extractField(
      data.customerSegments,
      "customerSegments",
    );
    if (customerSegments) {
      bmcData.customerSegments = customerSegments;
      extractedFields.push("customerSegments");
    }

    const channels = extractField(data.channels, "channels");
    if (channels) {
      bmcData.channels = channels;
      extractedFields.push("channels");
    }

    const customerRelationships = extractField(
      data.customerRelationships,
      "customerRelationships",
    );
    if (customerRelationships) {
      bmcData.customerRelationships = customerRelationships;
      extractedFields.push("customerRelationships");
    }

    const revenueStreams = extractField(data.revenueStreams, "revenueStreams");
    if (revenueStreams) {
      bmcData.revenueStreams = revenueStreams;
      extractedFields.push("revenueStreams");
    }

    const keyResources = extractField(data.keyResources, "keyResources");
    if (keyResources) {
      bmcData.keyResources = keyResources;
      extractedFields.push("keyResources");
    }

    const keyActivities = extractField(data.keyActivities, "keyActivities");
    if (keyActivities) {
      bmcData.keyActivities = keyActivities;
      extractedFields.push("keyActivities");
    }

    const keyPartners = extractField(data.keyPartners, "keyPartners");
    if (keyPartners) {
      bmcData.keyPartners = keyPartners;
      extractedFields.push("keyPartners");
    }

    const costStructure = extractField(data.costStructure, "costStructure");
    if (costStructure) {
      bmcData.costStructure = costStructure;
      extractedFields.push("costStructure");
    }

    return {
      projectName: data.projectName || "Imported Project",
      description: data.description,
      oneLiner: data.oneLiner,
      stage: mapStageToImportStage(data.stage),
      tags: data.tags || [],
      bmcData,
      confidence: data.confidence || 0.7,
      extractedFields,
      fieldConfidences:
        Object.keys(fieldConfidences).length > 0 ? fieldConfidences : undefined,
      warnings: data.warnings || [],
      suggestions: data.suggestions || [],
      originalFile: file,
      originalText,
    };
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    console.error("Response was:", response);

    throw new Error(
      `Failed to parse AI response. The AI may have returned unexpected format. Please try again or use manual entry.`,
    );
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PUBLIC API
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Import a project from a file
 */
export async function importFromFile(
  file: File,
  _options: Partial<ImportOptions> = {},
): Promise<ImportResult> {
  // Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Determine file type and extract accordingly
  if (SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return extractFromImage(file);
  }

  if (SUPPORTED_TEXT_TYPES.includes(file.type)) {
    const text = await fileToText(file);
    return extractFromText(text, file);
  }

  if (file.type === "application/pdf") {
    return extractFromPDF(file);
  }

  if (file.type === "application/json") {
    return extractFromJSON(file);
  }

  throw new Error(`Unsupported file type: ${file.type}`);
}

/**
 * Import a project from text content
 */
export async function importFromText(
  text: string,
  _options: Partial<ImportOptions> = {},
): Promise<ImportResult> {
  if (!text || text.trim().length === 0) {
    throw new Error("Text content is empty");
  }

  return extractFromText(text);
}

/**
 * Import a project from a URL
 */
export function importFromURL(
  _url: string,
  _options: Partial<ImportOptions> = {},
): Promise<ImportResult> {
  // This would fetch the URL content and extract
  // For now, throw not implemented
  return Promise.reject(
    new Error(
      "URL import is not yet implemented. Please copy and paste the content instead.",
    ),
  );
}

/**
 * Get supported file types for import
 */
export function getSupportedFileTypes(): {
  types: string[];
  accept: string;
  description: string;
} {
  return {
    types: [
      ...SUPPORTED_IMAGE_TYPES,
      ...SUPPORTED_TEXT_TYPES,
      "application/pdf",
      "application/json",
    ],
    accept: "image/*,.pdf,.txt,.md,.json",
    description: "Images (JPG, PNG), PDF, Text, Markdown, or JSON",
  };
}

export const importService = {
  importFromFile,
  importFromText,
  importFromURL,
  getSupportedFileTypes,
};

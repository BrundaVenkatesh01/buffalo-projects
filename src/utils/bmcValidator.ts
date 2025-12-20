/**
 * Business Model Canvas Data Validator
 *
 * Validates BMC data structure integrity on load to prevent:
 * - Rendering errors from malformed data
 * - Type mismatches from legacy data
 * - Missing required fields
 * - Invalid field values
 *
 * Features:
 * - Schema validation
 * - Automatic repair of fixable issues
 * - Detailed validation reports
 * - Migration from legacy formats
 */

import { logger } from "./logger";

import type { CanvasState, CanvasBlockId } from "@/types";

export interface ValidationResult {
  /** Is the data valid? */
  isValid: boolean;
  /** Validation errors found */
  errors: ValidationError[];
  /** Warnings (non-fatal issues) */
  warnings: ValidationWarning[];
  /** Repaired data (if fixable issues found) */
  repairedData?: CanvasState;
  /** Was auto-repair applied? */
  wasRepaired: boolean;
}

export interface ValidationError {
  field: string;
  issue: string;
  severity: "critical" | "high" | "medium";
  suggestedFix?: string;
}

export interface ValidationWarning {
  field: string;
  issue: string;
  suggestion?: string;
}

/**
 * Required BMC fields (9 blocks)
 */
const REQUIRED_BMC_FIELDS: CanvasBlockId[] = [
  "keyPartners",
  "keyActivities",
  "keyResources",
  "valuePropositions",
  "customerRelationships",
  "channels",
  "customerSegments",
  "costStructure",
  "revenueStreams",
];

/**
 * Maximum content length per field (prevent DoS attacks)
 */
const MAX_FIELD_LENGTH = 10000; // 10k characters

/**
 * Validate BMC data structure
 *
 * @param data - BMC data to validate
 * @param options - Validation options
 * @returns Validation result with errors, warnings, and repaired data
 */
export function validateBMCData(
  data: unknown,
  options: {
    /** Auto-repair fixable issues? */
    autoRepair?: boolean;
    /** Strict mode: fail on warnings? */
    strict?: boolean;
  } = {},
): ValidationResult {
  const { autoRepair = true, strict = false } = options;

  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  let repairedData: CanvasState | undefined;
  let wasRepaired = false;

  // Type check: must be object
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    errors.push({
      field: "root",
      issue: `BMC data must be an object, got ${Array.isArray(data) ? "array" : typeof data}`,
      severity: "critical",
      suggestedFix: "Initialize with empty BMC data structure",
    });

    if (autoRepair) {
      repairedData = createEmptyBMCData();
      wasRepaired = true;
    }

    return {
      isValid: false,
      errors,
      warnings,
      repairedData,
      wasRepaired,
    };
  }

  const bmcData = data as Record<string, unknown>;

  // Check for required fields
  const missingFields = REQUIRED_BMC_FIELDS.filter(
    (field) => !(field in bmcData),
  );

  if (missingFields.length > 0) {
    errors.push({
      field: missingFields.join(", "),
      issue: `Missing required BMC fields: ${missingFields.join(", ")}`,
      severity: "high",
      suggestedFix: "Add missing fields with empty strings",
    });

    if (autoRepair) {
      repairedData = { ...bmcData } as CanvasState;
      missingFields.forEach((field) => {
        repairedData![field] = "";
      });
      wasRepaired = true;
    }
  }

  // Check for extra fields (legacy or malformed data)
  const extraFields = Object.keys(bmcData).filter(
    (field) => !REQUIRED_BMC_FIELDS.includes(field as CanvasBlockId),
  );

  if (extraFields.length > 0) {
    warnings.push({
      field: extraFields.join(", "),
      issue: `Unknown BMC fields detected: ${extraFields.join(", ")}`,
      suggestion: "These fields will be ignored when rendering the canvas",
    });

    if (autoRepair) {
      repairedData = repairedData || ({ ...bmcData } as CanvasState);
      extraFields.forEach((field) => {
        delete repairedData![field as keyof CanvasState];
      });
      wasRepaired = true;
    }
  }

  // Validate field types and content
  REQUIRED_BMC_FIELDS.forEach((field) => {
    const value = bmcData[field];

    // Type validation: must be string
    if (typeof value !== "string") {
      errors.push({
        field,
        issue: `Field "${field}" must be a string, got ${typeof value}`,
        severity: "high",
        suggestedFix: "Convert to empty string",
      });

      if (autoRepair) {
        repairedData = repairedData || ({ ...bmcData } as CanvasState);
        repairedData[field] =
          value === null || value === undefined
            ? ""
            : typeof value === "string"
              ? value
              : typeof value === "number" || typeof value === "boolean"
                ? String(value)
                : "";
        wasRepaired = true;
      }
      return;
    }

    // Length validation
    if (value.length > MAX_FIELD_LENGTH) {
      errors.push({
        field,
        issue: `Field "${field}" exceeds maximum length (${value.length} > ${MAX_FIELD_LENGTH})`,
        severity: "medium",
        suggestedFix: `Truncate to ${MAX_FIELD_LENGTH} characters`,
      });

      if (autoRepair) {
        repairedData = repairedData || ({ ...bmcData } as CanvasState);
        repairedData[field] = value.slice(0, MAX_FIELD_LENGTH);
        wasRepaired = true;
      }
    }

    // Content validation: check for suspicious patterns
    if (value.includes("\x00")) {
      warnings.push({
        field,
        issue: `Field "${field}" contains null bytes (\\x00)`,
        suggestion: "Remove null bytes to prevent rendering issues",
      });

      if (autoRepair) {
        repairedData = repairedData || ({ ...bmcData } as CanvasState);
        // Use dynamic regex to avoid control-char literal in source
        const nullByte = new RegExp(String.fromCharCode(0), "g");
        repairedData[field] = value.replace(nullByte, "");
        wasRepaired = true;
      }
    }
  });

  // Determine validity
  const isValid =
    errors.length === 0 && (strict ? warnings.length === 0 : true);

  return {
    isValid,
    errors,
    warnings,
    repairedData: wasRepaired ? repairedData : undefined,
    wasRepaired,
  };
}

/**
 * Create empty BMC data structure
 */
export function createEmptyBMCData(): CanvasState {
  return {
    keyPartners: "",
    keyActivities: "",
    keyResources: "",
    valuePropositions: "",
    customerRelationships: "",
    channels: "",
    customerSegments: "",
    costStructure: "",
    revenueStreams: "",
  };
}

/**
 * Migrate legacy BMC data formats
 *
 * Handles:
 * - Old field names
 * - Different structure versions
 * - Partial data
 */
export function migrateLegacyBMCData(data: unknown): CanvasState {
  if (typeof data !== "object" || data === null) {
    logger.warn("Invalid legacy BMC data, returning empty structure");
    return createEmptyBMCData();
  }

  const legacy = data as Record<string, unknown>;
  const migrated = createEmptyBMCData();

  // Map old field names to new ones
  const fieldMappings: Record<string, CanvasBlockId> = {
    // Legacy names (if any were used)
    key_partners: "keyPartners",
    key_activities: "keyActivities",
    key_resources: "keyResources",
    value_propositions: "valuePropositions",
    customer_relationships: "customerRelationships",
    customer_segments: "customerSegments",
    cost_structure: "costStructure",
    revenue_streams: "revenueStreams",
  };

  // Copy existing fields
  REQUIRED_BMC_FIELDS.forEach((field) => {
    if (typeof legacy[field] === "string") {
      migrated[field] = legacy[field];
    }
  });

  // Apply legacy mappings
  Object.entries(fieldMappings).forEach(([oldField, newField]) => {
    if (typeof legacy[oldField] === "string" && !migrated[newField]) {
      migrated[newField] = legacy[oldField];
    }
  });

  return migrated;
}

/**
 * Sanitize BMC data for safe rendering
 *
 * - Remove potentially harmful content
 * - Normalize whitespace
 * - Trim excessive content
 */
export function sanitizeBMCData(data: CanvasState): CanvasState {
  const sanitized = { ...data };

  REQUIRED_BMC_FIELDS.forEach((field) => {
    let value = sanitized[field];

    // Remove null bytes using dynamic regex to satisfy lint
    value = value.replace(new RegExp(String.fromCharCode(0), "g"), "");

    // Normalize line endings
    value = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    // Trim excessive whitespace (but preserve intentional formatting)
    value = value.replace(/\n{4,}/g, "\n\n\n"); // Max 3 consecutive newlines

    // Enforce max length
    if (value.length > MAX_FIELD_LENGTH) {
      value = value.slice(0, MAX_FIELD_LENGTH);
    }

    sanitized[field] = value;
  });

  return sanitized;
}

/**
 * Validate and repair BMC data (convenience function)
 *
 * @param data - Raw BMC data
 * @returns Valid, sanitized BMC data or empty structure
 */
export function validateAndRepairBMCData(data: unknown): CanvasState {
  // First, try to migrate if it's legacy format
  const migratedData = migrateLegacyBMCData(data);

  // Validate and auto-repair
  const validation = validateBMCData(migratedData, { autoRepair: true });

  if (!validation.isValid) {
    logger.warn("BMC data validation failed, using repaired data", {
      errors: validation.errors,
      warnings: validation.warnings,
    });
  }

  // Use repaired data if available, otherwise use migrated data
  const validData = validation.repairedData || migratedData;

  // Final sanitization pass
  return sanitizeBMCData(validData);
}

/**
 * Log validation results for debugging
 */
export function logValidationResults(
  result: ValidationResult,
  context: { workspaceId?: string; source?: string } = {},
): void {
  if (!result.isValid) {
    logger.error("BMC data validation failed", {
      ...context,
      errors: result.errors,
      warnings: result.warnings,
      wasRepaired: result.wasRepaired,
    });
  } else if (result.warnings.length > 0) {
    logger.warn("BMC data validation warnings", {
      ...context,
      warnings: result.warnings,
      wasRepaired: result.wasRepaired,
    });
  } else if (result.wasRepaired) {
    logger.info("BMC data auto-repaired", {
      ...context,
      wasRepaired: result.wasRepaired,
    });
  }
}

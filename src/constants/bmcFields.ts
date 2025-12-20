/**
 * Business Model Canvas Field Definitions
 *
 * Centralized configuration for all BMC fields including titles, hints,
 * placeholders, help text, examples, and grid positioning.
 *
 * Single source of truth for BMC field metadata across the application.
 */

import type { CanvasBlockId } from "@/types";

export interface BMCFieldConfig {
  id: CanvasBlockId;
  title: string;
  hint: string;
  placeholder: string;
  helpText: string;
  examples: string[];
  gridArea: string;
  isCore?: boolean;
}

/**
 * Business Model Canvas field configurations
 * Organized by column (left, center, right) following the standard BMC layout
 */
export const BMC_FIELDS: BMCFieldConfig[] = [
  // ─── LEFT COLUMN ───────────────────────────────────────────────────
  {
    id: "keyPartners",
    title: "Key Partners",
    hint: "Who helps you deliver?",
    placeholder: "Strategic partners, key suppliers, critical collaborators...",
    helpText:
      "Who are your most important partners? Which key resources do they provide?",
    examples: [
      "City of Buffalo permit office, Chamber of Commerce",
      "Local HVAC contractors, senior centers, EMS partners",
    ],
    gridArea: "partners",
  },
  {
    id: "keyActivities",
    title: "Key Activities",
    hint: "What must you excel at?",
    placeholder: "Core activities to deliver value and operate...",
    helpText: "What key activities does your value proposition require?",
    examples: [
      "Software development, customer support, partnership management",
      "Hardware installation, 24/7 monitoring, emergency dispatch",
    ],
    gridArea: "activities",
  },
  {
    id: "keyResources",
    title: "Key Resources",
    hint: "What assets do you need?",
    placeholder: "Physical, intellectual, human, financial resources...",
    helpText:
      "What key resources does your value proposition require? What resources do your channels require?",
    examples: [
      "Software platform, development team, brand reputation",
      "Fleet of service vehicles, licensed technicians, 24/7 call center",
    ],
    gridArea: "resources",
  },

  // ─── CENTER COLUMN ─────────────────────────────────────────────────
  {
    id: "valuePropositions",
    title: "Value Propositions",
    hint: "Why do customers choose you?",
    placeholder: "Unique value you deliver to customers...",
    helpText:
      "What value do you deliver to the customer? What problems are you solving?",
    examples: [
      "Peace of mind for aging in place - 24/7 fall detection and emergency response",
      "Instant home safety for seniors living alone - wearable panic button with 90-second response",
    ],
    gridArea: "value",
    isCore: true,
  },
  {
    id: "customerRelationships",
    title: "Customer Relationships",
    hint: "How do you engage customers?",
    placeholder: "Personal, automated, self-service, community...",
    helpText:
      "What type of relationship does each customer segment expect? Which have we established?",
    examples: [
      "High-touch personal assistance during onboarding, automated follow-ups",
      "Family-mediated relationships - adult children purchase for parents",
    ],
    gridArea: "relationships",
  },
  {
    id: "channels",
    title: "Channels",
    hint: "How do you reach customers?",
    placeholder: "Sales, marketing, distribution, support channels...",
    helpText:
      "Through which channels do customer segments want to be reached? How are our channels integrated?",
    examples: [
      "Direct sales to adult children via referrals, partnerships with senior centers",
      "Installer network (HVAC/electrician partners), senior center workshops",
    ],
    gridArea: "channels",
  },

  // ─── RIGHT COLUMN ──────────────────────────────────────────────────
  {
    id: "customerSegments",
    title: "Customer Segments",
    hint: "Who are you serving?",
    placeholder: "Target customer groups and their characteristics...",
    helpText:
      "For whom are we creating value? Who are our most important customers?",
    examples: [
      "Western NY seniors (70+) living alone who've had a fall or fear falling",
      "Adult children (45-65) in WNY worried about aging parents living independently",
    ],
    gridArea: "segments",
    isCore: true,
  },

  // ─── BOTTOM ROW ────────────────────────────────────────────────────
  {
    id: "costStructure",
    title: "Cost Structure",
    hint: "What are your main costs?",
    placeholder: "Fixed costs, variable costs, key expenses...",
    helpText:
      "What are the most important costs? Which key resources are most expensive?",
    examples: [
      "Hardware (devices, sensors), 24/7 monitoring staff, installer commissions",
      "Software development/maintenance, call center operations, marketing to adult children",
    ],
    gridArea: "costs",
  },
  {
    id: "revenueStreams",
    title: "Revenue Streams",
    hint: "How do you make money?",
    placeholder: "Pricing models, payment methods, revenue sources...",
    helpText:
      "For what value are customers willing to pay? How would they prefer to pay?",
    examples: [
      "$49/month subscription after $299 installation (adult children pay)",
      "Tiered pricing: Basic ($39/mo), Premium ($59/mo with health monitoring)",
    ],
    gridArea: "revenue",
  },
];

/**
 * Get field configuration by ID
 */
export function getBMCField(id: CanvasBlockId): BMCFieldConfig | undefined {
  return BMC_FIELDS.find((field) => field.id === id);
}

/**
 * Get all core fields (primary value-driving fields)
 */
export function getCoreBMCFields(): BMCFieldConfig[] {
  return BMC_FIELDS.filter((field) => field.isCore);
}

/**
 * Field weights for pivot detection and completion calculation
 * Core fields (valuePropositions, customerSegments) have higher weight
 */
export const BMC_FIELD_WEIGHTS: Record<CanvasBlockId, number> = {
  valuePropositions: 1.5, // Most important
  customerSegments: 1.5, // Most important
  revenueStreams: 1.2,
  costStructure: 1.2,
  keyResources: 1.0,
  keyActivities: 1.0,
  keyPartners: 1.0,
  channels: 1.0,
  customerRelationships: 1.0,
};

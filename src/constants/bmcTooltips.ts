/**
 * BMC Block Tooltip Content
 *
 * Educational content for each Project Canvas block.
 * Each block includes:
 * - label: Original BMC terminology
 * - friendlyLabel: Accessible alternative for non-startup users
 * - explanation: Plain-language description
 * - question: The key question to answer
 * - examples: Concrete examples to inspire users (includes non-startup projects)
 * - tip: Practical guidance for filling out the block
 */

import type { CanvasBlockId } from "@/types";

export interface BMCTooltipContent {
  /** Block display label (original BMC terminology) */
  label: string;
  /** Friendly alternative label for non-startup users */
  friendlyLabel: string;
  /** Plain-language explanation of what this block is about */
  explanation: string;
  /** The key question to ask yourself when filling this block */
  question: string;
  /** Concrete examples to inspire users */
  examples: string[];
  /** Practical tip for filling out this block */
  tip: string;
}

export const BMC_TOOLTIPS: Record<CanvasBlockId, BMCTooltipContent> = {
  valuePropositions: {
    label: "Value Propositions",
    friendlyLabel: "What Makes It Special",
    explanation:
      "The unique value your project delivers. This is WHY people would choose your project over alternatives—what problem does it solve or what need does it meet?",
    question: "What unique value does your project deliver?",
    examples: [
      "Save 10 hours/week on manual data entry (app)",
      "Make design systems accessible to small teams (design project)",
      "Answer previously unexplored research questions (research)",
      "Provide a new artistic perspective on urban life (creative work)",
    ],
    tip: "Focus on the outcome or benefit, not the features. Ask: 'So what?' until you reach real value.",
  },

  customerSegments: {
    label: "Customer Segments",
    friendlyLabel: "Who It's For",
    explanation:
      "The specific people or groups who will benefit from your project. Understanding your audience helps you make better design decisions.",
    question: "Who will benefit from what you're building? Who is this for?",
    examples: [
      "Busy professionals aged 25-40 (app users)",
      "Frontend developers building component libraries (design system)",
      "Academic researchers in cognitive science (research)",
      "Art enthusiasts interested in contemporary photography (creative)",
    ],
    tip: "Be specific! 'Everyone' isn't helpful. The more focused you are, the better you can serve them.",
  },

  channels: {
    label: "Channels",
    friendlyLabel: "How You Reach People",
    explanation:
      "How you share your project with the world. This includes awareness, discovery, and how people access or use your work.",
    question: "How will people discover and access your project?",
    examples: [
      "Product Hunt launch, social media (startup)",
      "GitHub, dev.to articles, conferences (open source)",
      "Academic journals, ResearchGate (research)",
      "Gallery exhibitions, Instagram, portfolio site (creative)",
    ],
    tip: "Think about where your audience already spends time. Meet them there.",
  },

  customerRelationships: {
    label: "Customer Relationships",
    friendlyLabel: "How You Connect",
    explanation:
      "How you interact with your audience. Are you building a community? Providing support? Creating for a patron or client?",
    question: "What kind of relationship do you want with your audience?",
    examples: [
      "Self-service with documentation (product)",
      "Active Discord community (open source)",
      "Direct collaboration with stakeholders (research)",
      "Gallery representation, social media engagement (creative)",
    ],
    tip: "Consider what level of interaction makes sense. Not every project needs high-touch support.",
  },

  keyActivities: {
    label: "Key Activities",
    friendlyLabel: "Core Activities",
    explanation:
      "The most important things you do to make your project succeed. What work is essential to deliver your value?",
    question: "What activities are essential to make your project work?",
    examples: [
      "Software development, user testing (app)",
      "Component design, documentation (design system)",
      "Data collection, analysis, peer review (research)",
      "Creating, curating, exhibiting (creative)",
    ],
    tip: "Focus on activities that directly create or deliver value. What can't be skipped?",
  },

  keyResources: {
    label: "Key Resources",
    friendlyLabel: "What You Need",
    explanation:
      "The essential assets required to make your project work. Can be skills, tools, equipment, or access.",
    question: "What resources are essential to your project?",
    examples: [
      "Engineering skills, cloud infrastructure (app)",
      "Design expertise, Figma, Storybook (design system)",
      "Domain expertise, lab access, funding (research)",
      "Studio space, materials, creative vision (creative)",
    ],
    tip: "Think about what would stop your project if it disappeared. That's a key resource.",
  },

  keyPartners: {
    label: "Key Partners",
    friendlyLabel: "Your Partners",
    explanation:
      "People or organizations that help your project succeed. Partners can provide expertise, resources, or reach you don't have alone.",
    question: "Who helps make your project possible?",
    examples: [
      "Payment processor, cloud provider (startup)",
      "Design community, contributors (open source)",
      "Research institution, funding body (research)",
      "Galleries, curators, collectors (creative)",
    ],
    tip: "Partners should complement your strengths or provide access you can't achieve alone.",
  },

  costStructure: {
    label: "Cost Structure",
    friendlyLabel: "Your Costs",
    explanation:
      "What it costs to make your project happen. Understanding costs helps you plan and make sustainable decisions.",
    question: "What are the main costs involved in your project?",
    examples: [
      "Development team, hosting, marketing (startup)",
      "Time investment, tooling subscriptions (open source)",
      "Equipment, travel, publication fees (research)",
      "Materials, studio rent, equipment (creative)",
    ],
    tip: "Separate ongoing costs from one-time investments. Both matter for sustainability.",
  },

  revenueStreams: {
    label: "Revenue Streams",
    friendlyLabel: "How You Earn",
    explanation:
      "How your project sustains itself financially. Not all projects need direct revenue—grants, patronage, and employment also count.",
    question: "How does your project sustain itself? What keeps it going?",
    examples: [
      "Monthly subscription, transaction fees (startup)",
      "Donations, sponsorships, related consulting (open source)",
      "Grants, institutional funding, teaching (research)",
      "Sales, commissions, licensing (creative)",
    ],
    tip: "Consider if your project needs direct revenue, or if it creates value in other ways (career, learning, impact).",
  },
};

/**
 * Get tooltip content for a specific block
 */
export function getBMCTooltip(blockId: CanvasBlockId): BMCTooltipContent {
  return BMC_TOOLTIPS[blockId];
}

/**
 * Get all block IDs in a logical order (core blocks first)
 */
export const BMC_BLOCK_ORDER: CanvasBlockId[] = [
  "valuePropositions",
  "customerSegments",
  "keyActivities",
  "keyResources",
  "keyPartners",
  "channels",
  "customerRelationships",
  "costStructure",
  "revenueStreams",
];

/**
 * Core blocks that users should fill out first
 */
export const BMC_CORE_BLOCKS: CanvasBlockId[] = [
  "valuePropositions",
  "customerSegments",
];

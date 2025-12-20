import type { CanvasBlockData, CanvasState, CanvasBlockId } from "./types";

export const CANVAS_BLOCKS: CanvasBlockData[] = [
  {
    id: "keyPartners",
    title: "Key Partners",
    description: "Who are our key partners and suppliers?",
  },
  {
    id: "keyActivities",
    title: "Key Activities",
    description: "What key activities do our value propositions require?",
  },
  {
    id: "keyResources",
    title: "Key Resources",
    description: "What key resources do our value propositions require?",
  },
  {
    id: "valuePropositions",
    title: "Value Propositions",
    description: "What value do we deliver to the customer?",
  },
  {
    id: "customerRelationships",
    title: "Customer Relationships",
    description: "What type of relationship does each customer segment expect?",
  },
  {
    id: "channels",
    title: "Channels",
    description:
      "Through which channels do our customer segments want to be reached?",
  },
  {
    id: "customerSegments",
    title: "Customer Segments",
    description:
      "For whom are we creating value? Who are our most important customers?",
  },
  {
    id: "costStructure",
    title: "Cost Structure",
    description:
      "What are the most important costs inherent in our business model?",
  },
  {
    id: "revenueStreams",
    title: "Revenue Streams",
    description: "For what value are our customers willing to pay?",
  },
];

export const INITIAL_CANVAS_STATE: CanvasState = {
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

// This configuration drives the layout of the BusinessModelCanvas component.
// The classNames correspond to Tailwind CSS grid-column and grid-row span utilities.
export const CANVAS_LAYOUT_CONFIG: { id: CanvasBlockId; className: string }[] =
  [
    { id: "keyPartners", className: "col-span-2 row-span-2" },
    { id: "keyActivities", className: "col-span-2" },
    { id: "valuePropositions", className: "col-span-2 row-span-4" },
    { id: "customerRelationships", className: "col-span-2" },
    { id: "customerSegments", className: "col-span-2 row-span-2" },
    { id: "keyResources", className: "col-span-2" },
    { id: "channels", className: "col-span-2" },
    { id: "costStructure", className: "col-span-5" },
    { id: "revenueStreams", className: "col-span-5" },
  ];

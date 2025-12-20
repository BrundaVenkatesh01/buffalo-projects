import { ImageResponse } from "next/og";

import { firebaseDatabase } from "@/services/firebaseDatabase";
import { getSiteUrl } from "@/utils/env";

export const runtime = "edge";
export const revalidate = 3600;

const cardWidth = 1200;
const cardHeight = 630;
const baseUrl = getSiteUrl();

const sanitizeText = (value: unknown, fallback: string): string => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return fallback;
};

const sanitizeOptionalText = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return undefined;
};

const sanitizeTags = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((tag) => sanitizeOptionalText(tag))
    .filter((tag): tag is string => Boolean(tag));
};

const buildOgImage = (
  rawDetails: {
    title: unknown;
    description: unknown;
    stage?: unknown;
    tags?: unknown;
  },
  init: {
    status?: number;
    headers?: Record<string, string>;
  } = {},
): ImageResponse => {
  const title = sanitizeText(rawDetails.title, "Buffalo Projects");
  const description = sanitizeText(
    rawDetails.description,
    "Discover Buffalo’s builders in public.",
  );
  const stage = sanitizeOptionalText(rawDetails.stage);
  const tags = sanitizeTags(rawDetails.tags);

  const safeTitle = title.slice(0, 80);
  const safeDescription =
    description.length > 160 ? `${description.slice(0, 157)}…` : description;
  const displayTags = tags.slice(0, 3);

  const markup = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px",
        background:
          "linear-gradient(135deg, #10121A 0%, #11192D 55%, #10121A 100%)",
        color: "#F8FAFC",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span
          style={{
            display: "inline-flex",
            padding: "10px 20px",
            borderRadius: "999px",
            backgroundColor: "rgba(255,255,255,0.08)",
            fontSize: 24,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          Buffalo Projects
        </span>
        {stage ? (
          <span
            style={{
              display: "inline-flex",
              padding: "10px 20px",
              borderRadius: "999px",
              backgroundColor: "rgba(168, 85, 247, 0.18)",
              fontSize: 20,
              textTransform: "uppercase",
            }}
          >
            {stage}
          </span>
        ) : null}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <h1
          style={{
            fontSize: 68,
            fontWeight: 700,
            margin: 0,
            lineHeight: 1.05,
          }}
        >
          {safeTitle}
        </h1>
        <p
          style={{
            fontSize: 28,
            color: "rgba(241,245,249,0.85)",
            maxWidth: "820px",
            margin: 0,
          }}
        >
          {safeDescription}
        </p>

        {displayTags.length > 0 ? (
          <div style={{ display: "flex", gap: "12px" }}>
            {displayTags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "8px 18px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255,255,255,0.08)",
                  fontSize: 22,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "rgba(241,245,249,0.78)",
          fontSize: 24,
        }}
      >
        <span>🦬 Building in public from Buffalo</span>
        <span>{baseUrl.replace(/^https?:\/\//, "")}</span>
      </div>
    </div>
  );

  return new ImageResponse(markup, {
    width: cardWidth,
    height: cardHeight,
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      ...(init.headers ?? {}),
    },
    status: init.status ?? 200,
  });
};

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
): Promise<ImageResponse> {
  const { slug } = params;

  // Note: Rate limiting is disabled for OG image routes to avoid build-time issues
  // These routes are read-only and cached by Next.js, so abuse is naturally limited
  // Rate limiting is applied to data mutation endpoints instead

  if (!slug) {
    return buildOgImage({
      title: "Buffalo Projects",
      description: "Discover Buffalo’s builders in public.",
    });
  }

  try {
    const workspace = await firebaseDatabase.getPublicWorkspaceBySlug(slug);

    if (!workspace) {
      return buildOgImage({
        title: "Buffalo Projects",
        description: "This public workspace could not be found.",
      });
    }

    return buildOgImage({
      title: workspace.projectName || "Buffalo Project",
      description:
        workspace.description ||
        workspace.projectDescription ||
        "Follow every pivot, experiment, and milestone from Buffalo’s builders.",
      ...(workspace.stage ? { stage: workspace.stage } : {}),
      ...(workspace.tags ? { tags: workspace.tags } : {}),
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.error("Failed to generate OG image", reason);
    return buildOgImage({
      title: "Buffalo Projects",
      description: "Follow Buffalo’s builders in public.",
    });
  }
}

import type { EmbedType, EmbedConfig } from "../types";

/**
 * Detects the type of embed from a URL
 */
export function detectEmbedType(url: string): EmbedType {
  const urlLower = url.toLowerCase();

  if (urlLower.includes("framer.com") || urlLower.includes("framer.website")) {
    return "framer";
  }
  if (urlLower.includes("figma.com")) {
    return "figma";
  }
  if (urlLower.includes("codepen.io")) {
    return "codepen";
  }
  if (urlLower.includes("youtube.com") || urlLower.includes("youtu.be")) {
    return "youtube";
  }
  if (urlLower.includes("github.com")) {
    return "github";
  }

  return "custom";
}

/**
 * Generates embed configuration from a URL
 */
export function getEmbedConfig(url: string): EmbedConfig {
  const type = detectEmbedType(url);

  const configs: Record<EmbedType, Partial<EmbedConfig>> = {
    framer: {
      sandbox: "allow-scripts allow-same-origin allow-popups allow-forms",
      allowFullscreen: true,
      aspectRatio: "auto",
      height: 600,
      copyable: true,
    },
    figma: {
      sandbox: "allow-scripts allow-same-origin",
      allowFullscreen: true,
      aspectRatio: "auto",
      height: 450,
      copyable: true,
    },
    codepen: {
      sandbox: "allow-scripts allow-same-origin",
      allowFullscreen: false,
      aspectRatio: "16:9",
      height: 400,
      copyable: true,
    },
    youtube: {
      sandbox: "allow-scripts allow-same-origin",
      allowFullscreen: true,
      aspectRatio: "16:9",
      height: 315,
      copyable: false,
    },
    github: {
      sandbox: "allow-scripts allow-same-origin",
      allowFullscreen: false,
      aspectRatio: "auto",
      height: 500,
      copyable: false,
    },
    custom: {
      sandbox: "allow-scripts allow-same-origin",
      allowFullscreen: false,
      aspectRatio: "auto",
      height: 400,
      copyable: false,
    },
  };

  return {
    type,
    url,
    ...configs[type],
  };
}

/**
 * Transforms URLs to embed-friendly versions
 */
export function transformToEmbedUrl(url: string, type: EmbedType): string {
  switch (type) {
    case "youtube":
      // Convert watch URLs to embed URLs
      if (url.includes("watch?v=")) {
        const parts = url.split("watch?v=");
        const tail = parts[1];
        if (tail) {
          const videoId = tail.split("&")[0];
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
      if (url.includes("youtu.be/")) {
        const parts = url.split("youtu.be/");
        const tail = parts[1];
        if (tail) {
          const videoId = tail.split("?")[0];
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
      return url;

    case "figma":
      // Ensure Figma URLs have embed param
      if (!url.includes("embed")) {
        return url.includes("?")
          ? `${url}&embed-host=buffaloprojects`
          : `${url}?embed-host=buffaloprojects`;
      }
      return url;

    case "codepen":
      // Transform CodePen URLs to embed format
      if (url.includes("/pen/")) {
        return url.replace("/pen/", "/embed/");
      }
      return url;

    default:
      return url;
  }
}

/**
 * Generates copy-pastable embed code for different platforms
 */
export function generateEmbedCode(
  url: string,
  type: EmbedType,
  title?: string,
): string {
  const embedUrl = transformToEmbedUrl(url, type);

  switch (type) {
    case "framer":
      return `<iframe
  src="${embedUrl}"
  width="100%"
  height="600"
  frameborder="0"
  title="${title || "Framer Component"}"
  style="border: 1px solid rgba(0, 0, 0, 0.1);">
</iframe>`;

    case "figma":
      return `<iframe
  style="border: 1px solid rgba(0, 0, 0, 0.1);"
  width="800"
  height="450"
  src="${embedUrl}"
  allowfullscreen>
</iframe>`;

    case "codepen":
      return `<iframe
  height="400"
  style="width: 100%;"
  scrolling="no"
  title="${title || "CodePen Embed"}"
  src="${embedUrl}"
  frameborder="no"
  loading="lazy"
  allowtransparency="true"
  allowfullscreen="true">
</iframe>`;

    case "youtube":
      return `<iframe
  width="560"
  height="315"
  src="${embedUrl}"
  title="${title || "YouTube video"}"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>`;

    default:
      return `<iframe
  src="${embedUrl}"
  width="100%"
  height="400"
  frameborder="0"
  title="${title || "External Content"}">
</iframe>`;
  }
}

/**
 * Validates if a URL is safe to embed
 */
export function isEmbedUrlSafe(url: string): boolean {
  // Basic URL validation
  try {
    const urlObj = new URL(url);

    // Only allow HTTPS
    if (urlObj.protocol !== "https:") {
      return false;
    }

    // Whitelist trusted domains
    const trustedDomains = [
      "framer.com",
      "framer.website",
      "figma.com",
      "codepen.io",
      "youtube.com",
      "youtu.be",
      "github.com",
      "vimeo.com",
      "docs.google.com",
      "typeform.com",
      "calendly.com",
      "airtable.com",
      "notion.so",
    ];

    return trustedDomains.some((domain) => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
}

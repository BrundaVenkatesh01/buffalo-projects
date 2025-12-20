import type { Preview } from "@storybook/nextjs";
import type { Decorator } from "@storybook/react";
import React from "react";

import "../src/styles/globals.css";

const ensureFontVars = () => {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  if (!root.style.getPropertyValue("--font-geist-sans")) {
    root.style.setProperty(
      "--font-geist-sans",
      "Geist, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    );
  }
  if (!root.style.getPropertyValue("--font-geist-mono")) {
    root.style.setProperty(
      "--font-geist-mono",
      "Geist Mono, SFMono-Regular, Menlo, Consolas, monospace",
    );
  }
};

if (typeof window !== "undefined") {
  ensureFontVars();
}

const withAppShell: Decorator = (Story) => (
  <div className="min-h-screen bg-background px-10 py-12 font-sans text-foreground antialiased">
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <Story />
    </div>
  </div>
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "buffalo-night",
      values: [
        { name: "buffalo-night", value: "#000000" },
        { name: "surface", value: "#0f0f0f" },
        { name: "panel", value: "#111111" },
        { name: "paper", value: "#ffffff" },
      ],
    },
    options: {
      storySort: {
        order: ["Foundations", "UI"],
      },
    },
    layout: "fullscreen",
  },
  decorators: [withAppShell],
};

export default preview;

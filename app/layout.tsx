import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Providers } from "./providers";

import "@/styles/globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { UpdatesWidget } from "@/components/updates/UpdatesWidget";

export const metadata: Metadata = {
  metadataBase: new URL("https://buffaloprojects.com"),
  title: {
    default: "Buffalo Projects - Community-Owned Peer Validation Platform",
    template: "%s | Buffalo Projects",
  },
  description:
    "Build projects privately, publish to our curated community gallery, and get authentic feedback from fellow builders. Community-owned peer validation platform.",
  keywords: [
    "project validation",
    "peer feedback",
    "business model canvas",
    "startup validation",
    "community feedback",
    "project showcase",
    "Buffalo NY",
  ],
  authors: [{ name: "Buffalo Projects" }],
  creator: "Buffalo Projects",
  publisher: "Buffalo Projects",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://buffaloprojects.com",
    siteName: "Buffalo Projects",
    title: "Buffalo Projects - Community-Owned Peer Validation Platform",
    description:
      "Build projects privately, publish to our curated community gallery, and get authentic feedback from fellow builders.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Buffalo Projects - Community-Owned Peer Validation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buffalo Projects - Community-Owned Peer Validation Platform",
    description:
      "Build projects privately, publish to our curated community gallery, and get authentic feedback from fellow builders.",
    images: ["/og-image.png"],
    creator: "@buffaloprojects",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add when available
    // google: 'your-google-site-verification',
    // yandex: 'your-yandex-verification',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}
      >
        <ErrorBoundary>
          <Providers>
            {children}
            <UpdatesWidget />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}

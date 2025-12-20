import type { Metadata } from "next";

import { HomeScreen } from "./home/HomeScreen";

const SITE_URL = "https://buffaloprojects.com";
const SITE_NAME = "Buffalo Projects";

// JSON-LD structured data for rich search results
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description:
        "Get your project public in 2 minutes. GitHub to gallery, instantly. Build in public with Buffalo Projects.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/projects?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
      sameAs: [
        // Add social media URLs when available
        // "https://twitter.com/BuffaloProjects",
        // "https://github.com/buffaloProjects",
      ],
      description:
        "The fastest way to publish your project online. Import from GitHub, URL, or form and go public in minutes.",
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "Buffalo Projects — Your Project. Public in 2 Minutes.",
      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },
      about: {
        "@id": `${SITE_URL}/#organization`,
      },
      description:
        "Import from GitHub, URL, or form and publish your project page instantly. No website required.",
    },
  ],
};

export const metadata: Metadata = {
  title: "Buffalo Projects — Your Project. Public in 2 Minutes.",
  description:
    "Import from GitHub, URL, or form and publish your project page instantly. The fastest way to build in public.",
  openGraph: {
    title: "Buffalo Projects — Your Project. Public in 2 Minutes.",
    description:
      "GitHub, URL, or manual entry. Get discovered in Buffalo's ecosystem.",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: "Buffalo Projects - Get your project public in 2 minutes",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buffalo Projects — Your Project. Public in 2 Minutes.",
    description:
      "Import from GitHub, URL, or form and publish instantly. Build in public.",
    images: [`${SITE_URL}/og.png`],
  },
  alternates: {
    canonical: SITE_URL,
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
};

export default function LandingPage() {
  return (
    <>
      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeScreen />
    </>
  );
}

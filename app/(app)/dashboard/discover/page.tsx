import { GalleryScreen } from "./components/GalleryScreen";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Discover Projects | Buffalo Projects",
  description: "Browse and discover projects from the Buffalo community",
};

/**
 * Discover Page - Community project gallery
 *
 * Portfolio-first showcase with personalized matches,
 * advanced filtering, and infinite scroll.
 */
export default function DiscoverPage() {
  return <GalleryScreen />;
}

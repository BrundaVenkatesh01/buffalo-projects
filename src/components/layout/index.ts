/**
 * Layout Components - Universal spacing and alignment primitives
 * Ensures consistent layout across all platforms and screen sizes
 */

export {
  Container,
  Section,
  Stack,
  Inline,
  Grid,
  Center,
  Cluster,
} from "./Container";

export { PageLayout, PageLayoutContent } from "./PageLayout";
export type {
  PageLayoutVariant,
  BackgroundIntensity,
  SpacingDensity,
  NavigationMode,
} from "./PageLayout";

export { BackgroundComposer } from "./backgrounds/BackgroundComposer";

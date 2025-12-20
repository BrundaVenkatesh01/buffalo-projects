/**
 * Unified Design System - Single Import Point
 * Buffalo Projects Design System
 *
 * Import everything from here for consistency
 * Example: import { Button, Card, StatCard } from "@/components/unified"
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CORE UI COMPONENTS - Enhanced shadcn primitives
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export { Button } from "../ui-next";
export { Input, Textarea } from "../ui-next";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui-next";
export { Badge, Dot } from "../ui-next";
export { Label } from "../ui/label";
export { FeatureCard } from "../ui/card";
export { Progress } from "../ui/progress";
export { Switch } from "../ui/switch";

// Dialog exports
export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

// Alert exports
export { Alert, AlertDescription, AlertTitle } from "../ui/alert";

// Select exports
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// DropdownMenu exports
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// Avatar exports
export { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// Tabs exports
export { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

// Sheet exports
export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

// ScrollArea exports
export { ScrollArea, ScrollBar } from "../ui/scroll-area";

// Separator export
export { Separator } from "../ui/separator";

// Toaster export (Sonner)
export { Toaster } from "../ui/sonner";

// TextHoverEffect export
export { TextHoverEffect } from "../ui/text-hover-effect";

// Skeleton and other utilities
export { Skeleton } from "../ui/Skeleton";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BUFFALO COMPONENTS - Custom pattern components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export { StatCard } from "../buffalo/stat-card";
export { EmptyState } from "../buffalo/empty-state";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PROJECT COMPONENTS - Project/workspace display components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export { ProjectCard } from "../projects/ProjectCard";
export {
  ProjectCardSkeleton,
  ProjectCardSkeletonGrid,
} from "../projects/ProjectCardSkeleton";

// Project Detail Page Components - Visual-first showcase
export { ProjectDetailPage } from "../projects/ProjectDetailPage";
export { ProjectHero } from "../projects/ProjectHero";
export { ProjectLinks } from "../projects/ProjectLinks";
export { ProjectGallery } from "../projects/ProjectGallery";
export { ProjectStats } from "../projects/ProjectStats";
export { ProjectAbout } from "../projects/ProjectAbout";
export { ProjectBMC } from "../projects/ProjectBMC";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOTION - Animation components
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export {
  HeroGradients,
  RevealText,
  ScrollReveal,
  ScrollRevealList,
  ScrollRevealItem,
  FloatingCard,
  SlideIn,
} from "../motion";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TOKENS - Design system tokens
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export { ANIMATIONS } from "../../lib/animations";
export {
  SPACING,
  PADDING,
  PADDING_X,
  PADDING_Y,
  TYPOGRAPHY,
  RADIUS,
  SHADOW,
  BORDER,
  BACKGROUND,
  TRANSITION,
  LAYOUT,
  PATTERNS,
} from "../../lib/tokens";

// Workspace-specific tokens
export {
  CANVAS_BLOCK,
  PIVOT,
  WORKSPACE_SURFACE,
  STAGE_COLORS,
} from "../../tokens/semantic/components";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LEGACY SUPPORT - Keep for gradual migration
// These will be removed in future versions
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Export old Button for components that still need asChild support
export { Button as LegacyButton } from "../ui/button";

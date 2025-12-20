// Experimental Flow Management - A/B test new UX patterns
export class ExperimentalFlows {
  private static variant: "control" | "experimental" = "control";

  // Initialize user into experimental group (50/50 split)
  static initialize() {
    const existing = localStorage.getItem("flow_variant");
    if (existing) {
      this.variant = existing as "control" | "experimental";
    } else {
      this.variant = Math.random() < 0.5 ? "control" : "experimental";
      localStorage.setItem("flow_variant", this.variant);
    }
  }

  // Check if user is in experimental group
  static isExperimental(): boolean {
    return this.variant === "experimental";
  }

  // Get current variant
  static getVariant(): "control" | "experimental" {
    return this.variant;
  }

  // Landing page variants
  static getLandingPageVariant() {
    return this.isExperimental()
      ? {
          showInteractiveDemo: true,
          primaryCTA: "Try Building Now",
          secondaryCTA: "Learn More",
          hideProjectTypeSelection: true,
        }
      : {
          showInteractiveDemo: false,
          primaryCTA: "Start Building Your Idea",
          secondaryCTA: "Browse Gallery",
          hideProjectTypeSelection: false,
        };
  }

  // Navigation variants
  static getNavigationVariant() {
    return this.isExperimental()
      ? {
          useUnifiedNav: true,
          showProgressIndicators: true,
          enableBreadcrumbs: true,
        }
      : {
          useUnifiedNav: false,
          showProgressIndicators: false,
          enableBreadcrumbs: false,
        };
  }

  // Onboarding variants
  static getOnboardingVariant() {
    return this.isExperimental()
      ? {
          useProgressiveOnboarding: true,
          skipProjectTypeSelection: true,
          enableContextualHelp: true,
        }
      : {
          useProgressiveOnboarding: false,
          skipProjectTypeSelection: false,
          enableContextualHelp: false,
        };
  }
}

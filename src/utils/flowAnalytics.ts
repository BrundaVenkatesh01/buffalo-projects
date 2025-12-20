// Flow Analytics - Track user behavior to validate UX changes
export class FlowAnalytics {
  private static events: Array<{
    event: string;
    timestamp: number;
    path: string;
    metadata?: Record<string, unknown>;
  }> = [];

  // Track critical user flow events
  static trackEvent(event: string, metadata?: Record<string, unknown>) {
    const base = {
      event,
      timestamp: Date.now(),
      path: window.location.pathname,
    } as const;
    this.events.push({
      ...base,
      ...(metadata ? { metadata } : {}),
    });

    // Console log for development
    console.error(`[Flow Analytics] ${event}`, metadata);
  }

  // Critical flow events to track
  static landingPageView() {
    this.trackEvent("landing_view");
  }

  static ctaClick(cta: string) {
    this.trackEvent("cta_click", { cta });
  }

  static projectCreationStart() {
    this.trackEvent("project_creation_start");
  }

  static projectCreationComplete(projectCode: string) {
    this.trackEvent("project_creation_complete", { projectCode });
  }

  static workspaceFirstInteraction(tool: string) {
    this.trackEvent("workspace_first_interaction", { tool });
  }

  static navigationConfusion(from: string, to: string) {
    this.trackEvent("navigation_confusion", { from, to });
  }

  static toolDiscovery(tool: string, timeToDiscovery: number) {
    this.trackEvent("tool_discovery", { tool, timeToDiscovery });
  }

  // Export data for analysis
  static exportData() {
    return this.events;
  }

  // Clear data (for privacy)
  static clearData() {
    this.events = [];
  }
}

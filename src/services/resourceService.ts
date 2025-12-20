/**
 * Resource Service - DDD Service Layer
 * Manages Buffalo entrepreneurial resources with repository pattern
 */

import type {
  BuffaloResource,
  ResourceCategory,
  ResourceStage,
  ResourceFilter,
  IResourceRepository,
} from "@/types/resource";

/**
 * Buffalo Resources Seed Data
 * Curated list of Buffalo's entrepreneurial ecosystem
 */
const BUFFALO_RESOURCES: BuffaloResource[] = [
  // Funding
  {
    id: "43north",
    name: "43North",
    description:
      "Annual $5M startup competition. Grand prize of $1M plus support services for winners.",
    category: "funding",
    stages: ["validation", "mvp", "growth"],
    website: "https://www.43north.org",
    email: "info@43north.org",
    address: "640 Ellicott St, Buffalo, NY 14203",
    tags: ["competition", "equity-free", "cash-prize", "buffalo-focused"],
    eligibility: "Must commit to operating in Buffalo for one year",
    applicationProcess: "Annual competition, typically opens in spring",
    featured: true,
    verified: true,
    addedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "launch-ny",
    name: "Launch NY",
    description:
      "Venture development organization providing funding and mentorship to Upstate NY startups.",
    category: "funding",
    stages: ["mvp", "growth", "scale"],
    website: "https://www.launchny.org",
    email: "info@launchny.org",
    tags: ["seed-funding", "mentorship", "upstate-ny"],
    eligibility: "Upstate NY-based companies",
    featured: true,
    verified: true,
    addedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },

  // Accelerators & Incubators
  {
    id: "z80-labs",
    name: "Z80 Labs",
    description:
      "Buffalo's startup accelerator and co-working space in the heart of downtown.",
    category: "accelerator",
    stages: ["idea", "validation", "mvp"],
    website: "https://www.z80labs.com",
    address: "617 Main St, Buffalo, NY 14203",
    tags: ["accelerator", "co-working", "community"],
    featured: true,
    verified: true,
    addedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "blackstone-launchpad",
    name: "Blackstone LaunchPad at UB",
    description:
      "Campus entrepreneurship program providing mentorship, resources, and funding to UB students and alumni.",
    category: "accelerator",
    stages: ["idea", "validation", "mvp"],
    website: "https://www.buffalo.edu/innovation/blackstone-launchpad.html",
    address: "University at Buffalo",
    tags: ["ub", "students", "mentorship", "free"],
    eligibility: "UB students, faculty, staff, and alumni",
    featured: true,
    verified: true,
    addedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },

  // Education
  {
    id: "ub-school-management",
    name: "UB School of Management",
    description:
      "Entrepreneurship programs, courses, and resources for students interested in starting businesses.",
    category: "education",
    stages: ["idea", "validation"],
    website: "https://mgt.buffalo.edu",
    address: "University at Buffalo",
    tags: ["courses", "degree-programs", "student-focused"],
    featured: true,
    verified: true,
    addedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "buffalo-niagara-sbdc",
    name: "Buffalo Niagara SBDC",
    description:
      "Free business advising, training, and resources for Western NY entrepreneurs.",
    category: "education",
    stages: ["all"],
    website: "https://www.nybizadvising.com",
    email: "sbdc@brockport.edu",
    tags: ["free", "advising", "training", "workshops"],
    featured: true,
    verified: true,
    addedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },

  // Co-working Spaces
  {
    id: "cowork-buffalo",
    name: "CoworkBuffalo",
    description:
      "Professional co-working space in the heart of downtown Buffalo.",
    category: "coworking",
    stages: ["all"],
    website: "https://www.coworkbuffalo.com",
    address: "672 Delaware Ave, Buffalo, NY 14209",
    tags: ["co-working", "office-space", "community"],
    verified: true,
    featured: false,
    addedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },

  // Networking
  {
    id: "buffalo-niagara-partnership",
    name: "Buffalo Niagara Partnership",
    description:
      "Regional chamber of commerce connecting businesses and fostering economic growth.",
    category: "networking",
    stages: ["all"],
    website: "https://www.thepartnership.org",
    tags: ["chamber", "networking", "events"],
    featured: true,
    verified: true,
    addedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "startup-grind-buffalo",
    name: "Startup Grind Buffalo",
    description:
      "Monthly events featuring successful entrepreneurs, innovators, and investors.",
    category: "networking",
    stages: ["all"],
    website: "https://www.startupgrind.com/buffalo",
    tags: ["events", "networking", "speakers"],
    verified: true,
    featured: false,
    addedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },

  // Government Resources
  {
    id: "empire-state-development",
    name: "Empire State Development",
    description:
      "NY State economic development agency offering grants, tax credits, and business support.",
    category: "government",
    stages: ["growth", "scale"],
    website: "https://esd.ny.gov",
    tags: ["grants", "tax-credits", "state-resources"],
    featured: true,
    verified: true,
    addedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },

  // Legal
  {
    id: "volunteer-lawyers-project",
    name: "Volunteer Lawyers Project",
    description:
      "Free legal services for qualifying small businesses and nonprofits.",
    category: "legal",
    stages: ["all"],
    website: "https://www.vlpbuffalo.org",
    tags: ["legal", "free", "nonprofit"],
    eligibility: "Income-qualified small businesses",
    verified: true,
    featured: false,
    addedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
];

/**
 * In-Memory Resource Repository Implementation
 */
class InMemoryResourceRepository implements IResourceRepository {
  private resources: BuffaloResource[] = BUFFALO_RESOURCES;

  getAll(): Promise<BuffaloResource[]> {
    return Promise.resolve([...this.resources]);
  }

  getById(id: string): Promise<BuffaloResource | null> {
    return Promise.resolve(this.resources.find((r) => r.id === id) || null);
  }

  getByCategory(category: ResourceCategory): Promise<BuffaloResource[]> {
    return Promise.resolve(
      this.resources.filter((r) => r.category === category),
    );
  }

  getByStage(stage: ResourceStage): Promise<BuffaloResource[]> {
    if (stage === "all") {
      return this.getAll();
    }
    return Promise.resolve(
      this.resources.filter((r) => r.stages.includes(stage)),
    );
  }

  search(filter: ResourceFilter): Promise<BuffaloResource[]> {
    let results = [...this.resources];

    if (filter.category) {
      results = results.filter((r) => r.category === filter.category);
    }

    if (filter.stage && filter.stage !== "all") {
      results = results.filter((r) =>
        r.stages.includes(filter.stage as ResourceStage),
      );
    }

    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    if (filter.featuredOnly) {
      results = results.filter((r) => r.featured);
    }

    return Promise.resolve(results);
  }

  getFeatured(): Promise<BuffaloResource[]> {
    return Promise.resolve(this.resources.filter((r) => r.featured));
  }
}

/**
 * Resource Service - Application Service Layer
 */
class ResourceService {
  private static instance: ResourceService;
  private repository: IResourceRepository;

  private constructor() {
    this.repository = new InMemoryResourceRepository();
  }

  static getInstance(): ResourceService {
    if (!ResourceService.instance) {
      ResourceService.instance = new ResourceService();
    }
    return ResourceService.instance;
  }

  // Query methods
  getAllResources(): Promise<BuffaloResource[]> {
    return this.repository.getAll();
  }

  getResourceById(id: string): Promise<BuffaloResource | null> {
    return this.repository.getById(id);
  }

  getResourcesByCategory(
    category: ResourceCategory,
  ): Promise<BuffaloResource[]> {
    return this.repository.getByCategory(category);
  }

  getResourcesByStage(stage: ResourceStage): Promise<BuffaloResource[]> {
    return this.repository.getByStage(stage);
  }

  searchResources(filter: ResourceFilter): Promise<BuffaloResource[]> {
    return this.repository.search(filter);
  }

  getFeaturedResources(): Promise<BuffaloResource[]> {
    return this.repository.getFeatured();
  }

  // Category metadata
  getCategoryConfig(): Record<
    ResourceCategory,
    { name: string; description: string; icon: string; color: string }
  > {
    return {
      funding: {
        name: "Funding",
        description: "Grants, competitions, and investment opportunities",
        icon: "DollarSign",
        color: "text-green-600",
      },
      accelerator: {
        name: "Accelerators & Incubators",
        description: "Programs to accelerate your startup journey",
        icon: "Rocket",
        color: "text-blue-600",
      },
      education: {
        name: "Education & Training",
        description: "Courses, workshops, and learning resources",
        icon: "GraduationCap",
        color: "text-purple-600",
      },
      coworking: {
        name: "Co-Working Spaces",
        description: "Physical spaces to work and collaborate",
        icon: "Building2",
        color: "text-blue-600",
      },
      networking: {
        name: "Networking & Events",
        description: "Connect with the Buffalo startup community",
        icon: "Users",
        color: "text-pink-600",
      },
      mentorship: {
        name: "Mentorship",
        description: "Get guidance from experienced entrepreneurs",
        icon: "UserPlus",
        color: "text-indigo-600",
      },
      legal: {
        name: "Legal Services",
        description: "Legal support for startups",
        icon: "Scale",
        color: "text-gray-600",
      },
      government: {
        name: "Government Resources",
        description: "State and local government support",
        icon: "Landmark",
        color: "text-red-600",
      },
    };
  }
}

// Export singleton instance
export const resourceService = ResourceService.getInstance();

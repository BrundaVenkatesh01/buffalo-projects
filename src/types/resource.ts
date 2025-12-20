/**
 * Resource Domain - Types and Interfaces
 * DDD: Domain models for Buffalo entrepreneurial resources
 */

export type ResourceCategory =
  | "funding"
  | "coworking"
  | "accelerator"
  | "education"
  | "networking"
  | "mentorship"
  | "legal"
  | "government";

export type ResourceStage =
  | "idea"
  | "validation"
  | "mvp"
  | "growth"
  | "scale"
  | "all";

/**
 * Resource Aggregate Root
 */
export interface BuffaloResource {
  id: string;
  name: string;
  description: string;
  category: ResourceCategory;
  stages: ResourceStage[];

  // Contact & Location
  website?: string;
  email?: string;
  phone?: string;
  address?: string;

  // Details
  logo?: string;
  tags: string[];
  eligibility?: string;
  applicationProcess?: string;

  // Meta
  featured: boolean;
  verified: boolean;
  addedAt: string;
  lastUpdated: string;
}

/**
 * Resource Category Configuration
 */
export interface ResourceCategoryConfig {
  id: ResourceCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}

/**
 * Resource Filter
 */
export interface ResourceFilter {
  category?: ResourceCategory;
  stage?: ResourceStage;
  searchQuery?: string;
  featuredOnly?: boolean;
}

/**
 * Resource Repository Interface
 */
export interface IResourceRepository {
  getAll(): Promise<BuffaloResource[]>;
  getById(id: string): Promise<BuffaloResource | null>;
  getByCategory(category: ResourceCategory): Promise<BuffaloResource[]>;
  getByStage(stage: ResourceStage): Promise<BuffaloResource[]>;
  search(filter: ResourceFilter): Promise<BuffaloResource[]>;
  getFeatured(): Promise<BuffaloResource[]>;
}

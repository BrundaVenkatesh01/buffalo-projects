// Buffalo Entrepreneurial Ecosystem Resources

export interface Resource {
  id: string;
  category: ResourceCategory;
  name: string;
  description: string;
  website?: string;
  location?: string;
  contact?: string;
  tags: string[];
  featured?: boolean;
  programs?: string[];
}

export type ResourceCategory =
  | "incubator"
  | "accelerator"
  | "funding"
  | "coworking"
  | "education"
  | "networking"
  | "mentorship"
  | "government"
  | "competition"
  | "legal"
  | "marketing"
  | "technical";

export const BUFFALO_RESOURCES: Resource[] = [
  // INCUBATORS & ACCELERATORS
  {
    id: "buf-1",
    category: "incubator",
    name: "43North",
    description:
      "One of the largest startup competitions globally, offering $5 million in cash prizes annually and free incubator space in Buffalo.",
    website: "https://43north.org",
    location: "Seneca One Tower, Buffalo, NY",
    tags: ["startup", "competition", "funding", "accelerator"],
    featured: true,
    programs: ["Annual Competition", "Portfolio Support", "Mentorship Program"],
  },
  {
    id: "buf-2",
    category: "accelerator",
    name: "Launch NY",
    description:
      "Venture development organization providing pro-bono mentoring and capital access to high-growth startups across Upstate NY.",
    website: "https://launchny.org",
    location: "Buffalo, NY",
    contact: "info@launchny.org",
    tags: ["mentorship", "funding", "seed-fund"],
    featured: true,
    programs: ["Entrepreneur-in-Residence", "Seed Fund", "Mentor Network"],
  },
  {
    id: "buf-3",
    category: "incubator",
    name: "UB CAT (Center for Advanced Technology)",
    description:
      "University at Buffalo incubator focused on biomedical and biotechnology startups, offering lab space and technical resources.",
    website: "https://www.buffalo.edu/cat",
    location: "University at Buffalo",
    tags: ["biotech", "research", "university", "lab-space"],
    programs: ["Technology Transfer", "Lab Access", "Research Collaboration"],
  },
  {
    id: "buf-4",
    category: "incubator",
    name: "Buffalo Manufacturing Works",
    description:
      "Innovation center helping manufacturers and startups develop and commercialize new products through advanced manufacturing technologies.",
    website: "https://buffalomanufacturingworks.com",
    location: "683 Northland Ave, Buffalo, NY",
    tags: ["manufacturing", "hardware", "prototyping", "3D-printing"],
    programs: [
      "Prototyping Services",
      "Equipment Access",
      "Technical Consulting",
    ],
  },
  {
    id: "buf-5",
    category: "incubator",
    name: "Z80 Labs",
    description:
      "Business incubator and coworking space supporting tech startups with mentorship, resources, and community.",
    website: "https://z80labs.com",
    location: "Williamsville, NY",
    tags: ["tech", "software", "coworking", "community"],
    programs: ["Incubator Program", "Coworking Membership", "Startup Events"],
  },

  // FUNDING SOURCES
  {
    id: "buf-6",
    category: "funding",
    name: "Empire State Development",
    description:
      "New York State's chief economic development agency offering grants, loans, and tax credits for businesses.",
    website: "https://esd.ny.gov",
    tags: ["grants", "tax-credits", "state-funding", "loans"],
    programs: ["Start-Up NY", "Excelsior Jobs Program", "Innovation Grants"],
  },
  {
    id: "buf-7",
    category: "funding",
    name: "WNY Impact Investment Fund",
    description:
      "Revolving loan fund providing capital to small businesses and startups in Western New York.",
    website: "https://wnyimpact.org",
    location: "Buffalo, NY",
    tags: ["loans", "small-business", "impact-investing"],
    programs: ["Microloans", "Small Business Loans", "Technical Assistance"],
  },
  {
    id: "buf-8",
    category: "funding",
    name: "Buffalo Angels",
    description:
      "Angel investor network connecting local entrepreneurs with accredited investors for seed and early-stage funding.",
    website: "https://buffaloangels.com",
    tags: ["angel-investors", "seed-funding", "pitch-events"],
    programs: [
      "Monthly Pitch Meetings",
      "Due Diligence Support",
      "Portfolio Services",
    ],
  },

  // COWORKING SPACES
  {
    id: "buf-9",
    category: "coworking",
    name: "Dig Buffalo",
    description:
      "Collaborative workspace in the Theater District offering flexible memberships, private offices, and event space.",
    website: "https://digbuffalo.com",
    location: "640 Ellicott St, Buffalo, NY",
    tags: ["coworking", "events", "downtown", "community"],
    programs: ["Hot Desk", "Dedicated Desk", "Private Office", "Event Space"],
  },
  {
    id: "buf-10",
    category: "coworking",
    name: "Innovation Center Buffalo",
    description:
      "Coworking and office space in the Buffalo Niagara Medical Campus, ideal for health and life sciences startups.",
    website: "https://innovationcenterbuffalo.org",
    location: "640 Ellicott St, Buffalo, NY",
    tags: ["medical", "life-sciences", "bnmc", "lab-space"],
    programs: ["Office Space", "Lab Space", "Conference Rooms"],
  },
  {
    id: "buf-11",
    category: "coworking",
    name: "Hansa Coworking",
    description:
      "Boutique coworking space in North Buffalo offering a professional environment for freelancers and small teams.",
    website: "https://hansacoworking.com",
    location: "3485 Main St, Buffalo, NY",
    tags: ["coworking", "north-buffalo", "small-teams"],
    programs: ["Day Pass", "Monthly Membership", "Meeting Rooms"],
  },

  // EDUCATIONAL PROGRAMS
  {
    id: "buf-12",
    category: "education",
    name: "UB Blackstone LaunchPad",
    description:
      "University at Buffalo program providing entrepreneurship education, mentorship, and resources to students and alumni.",
    website: "https://www.buffalo.edu/blackstone",
    location: "University at Buffalo",
    tags: ["university", "students", "mentorship", "education"],
    featured: true,
    programs: [
      "Workshops",
      "Mentorship",
      "Pitch Competitions",
      "Startup Bootcamp",
    ],
  },
  {
    id: "buf-13",
    category: "education",
    name: "Canisius College Wehle School",
    description:
      "Business school offering entrepreneurship programs, MBA degrees, and startup resources for students and community.",
    website: "https://www.canisius.edu/wehle",
    location: "Canisius College, Buffalo, NY",
    tags: ["mba", "education", "university", "business-school"],
    programs: ["Entrepreneurship Minor", "MBA Program", "Executive Education"],
  },
  {
    id: "buf-14",
    category: "education",
    name: "Buffalo State E-Ship",
    description:
      "Entrepreneurship program at Buffalo State College offering courses, competitions, and mentorship.",
    website: "https://suny.buffalostate.edu",
    location: "Buffalo State College",
    tags: ["university", "students", "competitions"],
    programs: [
      "E-Ship Courses",
      "Elevator Pitch Competition",
      "Startup Weekend",
    ],
  },

  // NETWORKING & COMMUNITY
  {
    id: "buf-15",
    category: "networking",
    name: "Startup Grind Buffalo",
    description:
      "Global startup community chapter hosting monthly fireside chats with successful entrepreneurs and innovators.",
    website: "https://www.startupgrind.com/buffalo",
    tags: ["networking", "events", "community", "speakers"],
    programs: ["Monthly Events", "Fireside Chats", "Annual Conference"],
  },
  {
    id: "buf-16",
    category: "networking",
    name: "Buffalo Niagara Partnership",
    description:
      "Regional chamber of commerce and economic development organization supporting business growth.",
    website: "https://www.thepartnership.org",
    location: "665 Main St, Buffalo, NY",
    tags: ["chamber", "advocacy", "business-support"],
    programs: [
      "Business Advocacy",
      "Economic Development",
      "Workforce Programs",
    ],
  },
  {
    id: "buf-17",
    category: "networking",
    name: "1 Million Cups Buffalo",
    description:
      "Weekly educational program for entrepreneurs to present their startups to the community and receive feedback.",
    website: "https://www.1millioncups.com/buffalo",
    tags: ["pitch-practice", "feedback", "weekly-events", "community"],
    programs: [
      "Weekly Presentations",
      "Entrepreneur Education",
      "Community Feedback",
    ],
  },

  // MENTORSHIP
  {
    id: "buf-18",
    category: "mentorship",
    name: "SCORE Buffalo Niagara",
    description:
      "Free business mentoring and education services helping entrepreneurs start and grow successful businesses.",
    website: "https://buffaloniagara.score.org",
    tags: ["free", "mentorship", "business-planning", "workshops"],
    programs: ["1-on-1 Mentoring", "Business Workshops", "Online Resources"],
  },
  {
    id: "buf-19",
    category: "mentorship",
    name: "WNY Women's Foundation",
    description:
      "Supporting women entrepreneurs through mentorship, funding opportunities, and leadership development.",
    website: "https://wnywomensfoundation.org",
    tags: ["women", "mentorship", "leadership", "funding"],
    programs: ["Mentorship Program", "Leadership Institute", "Grant Programs"],
  },

  // GOVERNMENT RESOURCES
  {
    id: "buf-20",
    category: "government",
    name: "Buffalo Urban Development Corporation",
    description:
      "City of Buffalo agency providing loans, grants, and technical assistance to businesses.",
    website: "https://www.buffalourbandevelopment.com",
    location: "95 Perry St, Buffalo, NY",
    tags: ["city", "loans", "grants", "urban-development"],
    programs: ["Business Loans", "Facade Grants", "Technical Assistance"],
  },
  {
    id: "buf-21",
    category: "government",
    name: "Erie County IDA",
    description:
      "Industrial Development Agency offering tax incentives and financial assistance for business expansion.",
    website: "https://www.ecidany.com",
    tags: ["tax-incentives", "industrial", "expansion", "county"],
    programs: ["Tax Abatements", "Bond Financing", "Adaptive Reuse Program"],
  },

  // COMPETITIONS
  {
    id: "buf-22",
    category: "competition",
    name: "Panasci Business Plan Competition",
    description:
      "Annual UB competition awarding over $50,000 in prizes to student entrepreneurs.",
    website: "https://www.buffalo.edu/business/panasci",
    location: "University at Buffalo",
    tags: ["students", "cash-prizes", "business-plan"],
    programs: [
      "Business Plan Track",
      "Innovation Track",
      "Social Impact Track",
    ],
  },
  {
    id: "buf-23",
    category: "competition",
    name: "Bright Buffalo Niagara",
    description:
      "Regional business idea competition for high school students with cash prizes and mentorship.",
    website: "https://brightbuffalo.com",
    tags: ["high-school", "youth", "cash-prizes", "mentorship"],
    programs: [
      "Student Competition",
      "Teacher Resources",
      "Mentorship Program",
    ],
  },

  // LEGAL & PROFESSIONAL SERVICES
  {
    id: "buf-24",
    category: "legal",
    name: "Volunteer Lawyers Project",
    description:
      "Pro bono legal services for qualifying entrepreneurs and small businesses.",
    website: "https://www.vlpwny.org",
    tags: ["pro-bono", "legal", "free", "small-business"],
    programs: ["Legal Clinics", "Business Formation", "Contract Review"],
  },
  {
    id: "buf-25",
    category: "legal",
    name: "UB Law Entrepreneurship Clinic",
    description:
      "Law students providing free legal services to startups under attorney supervision.",
    website: "https://www.law.buffalo.edu",
    location: "University at Buffalo School of Law",
    tags: ["free", "legal", "university", "startups"],
    programs: ["Business Formation", "IP Counseling", "Contract Drafting"],
  },

  // TECHNICAL RESOURCES
  {
    id: "buf-26",
    category: "technical",
    name: "WNY Developers",
    description:
      "Community of software developers, designers, and tech professionals in Western New York.",
    website: "https://www.wnydevelopers.com",
    tags: ["developers", "tech", "community", "meetups"],
    programs: ["Monthly Meetups", "Slack Community", "Job Board"],
  },
  {
    id: "buf-27",
    category: "technical",
    name: "Buffalo Game Space",
    description:
      "Collaborative workspace for game developers offering resources, events, and community.",
    website: "https://www.buffalogamespace.com",
    location: "Buffalo, NY",
    tags: ["gaming", "vr", "ar", "developers"],
    programs: ["Game Jams", "Developer Meetups", "Equipment Access"],
  },

  // MARKETING & MEDIA
  {
    id: "buf-28",
    category: "marketing",
    name: "Buffalo Rising",
    description:
      "Local media outlet covering Buffalo startups, business news, and entrepreneurial stories.",
    website: "https://www.buffalorising.com",
    tags: ["media", "pr", "news", "publicity"],
    programs: ["Startup Coverage", "Event Promotion", "Business Features"],
  },
  {
    id: "buf-29",
    category: "marketing",
    name: "Buffalo Business First",
    description:
      "Business journal providing news, data, and networking for Buffalo's business community.",
    website: "https://www.bizjournals.com/buffalo",
    tags: ["media", "news", "networking", "data"],
    programs: ["Business News", "Industry Lists", "Networking Events"],
  },
];

// Helper functions for resource management
export const getResourcesByCategory = (
  category: ResourceCategory,
): Resource[] => {
  return BUFFALO_RESOURCES.filter((r) => r.category === category);
};

export const getFeaturedResources = (): Resource[] => {
  return BUFFALO_RESOURCES.filter((r) => r.featured);
};

export const searchResources = (query: string): Resource[] => {
  const lowerQuery = query.toLowerCase();
  return BUFFALO_RESOURCES.filter(
    (r) =>
      r.name.toLowerCase().includes(lowerQuery) ||
      r.description.toLowerCase().includes(lowerQuery) ||
      r.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  );
};

export const getResourceById = (id: string): Resource | undefined => {
  return BUFFALO_RESOURCES.find((r) => r.id === id);
};

// Category metadata
export const RESOURCE_CATEGORIES = [
  {
    id: "incubator",
    name: "Incubators",
    icon: "",
    description:
      "Physical spaces and programs that nurture early-stage startups",
  },
  {
    id: "accelerator",
    name: "Accelerators",
    icon: "",
    description: "Intensive programs that rapidly scale startups",
  },
  {
    id: "funding",
    name: "Funding",
    icon: "",
    description: "Grants, loans, and investment opportunities",
  },
  {
    id: "coworking",
    name: "Coworking Spaces",
    icon: "",
    description: "Shared workspaces for entrepreneurs and teams",
  },
  {
    id: "education",
    name: "Education",
    icon: "",
    description: "Courses, workshops, and training programs",
  },
  {
    id: "networking",
    name: "Networking",
    icon: "",
    description: "Events and communities for making connections",
  },
  {
    id: "mentorship",
    name: "Mentorship",
    icon: "",
    description: "Guidance from experienced entrepreneurs",
  },
  {
    id: "government",
    name: "Government",
    icon: "",
    description: "Public sector support and incentives",
  },
  {
    id: "competition",
    name: "Competitions",
    icon: "",
    description: "Pitch competitions and business plan contests",
  },
  {
    id: "legal",
    name: "Legal Services",
    icon: "",
    description: "Legal support for business formation and growth",
  },
  {
    id: "marketing",
    name: "Marketing & PR",
    icon: "",
    description: "Media coverage and marketing resources",
  },
  {
    id: "technical",
    name: "Technical Resources",
    icon: "",
    description: "Developer communities and technical support",
  },
];

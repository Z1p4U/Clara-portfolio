export type PortfolioProject = {
  name: string;
  category: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  alt: string;
  color: string;
  summary: string;
  focus: string;
  highlights: string[];
  tools: string[];
};

export const projects: PortfolioProject[] = [
  {
    name: "Salespoint",
    category: "Retail · point of sale",
    image: "/images/salepoint.png",
    imageWidth: 1600,
    imageHeight: 1067,
    alt: "Salespoint point of sale dashboard on desktop and mobile",
    color: "#f7c9d0",
    summary:
      "A point of sale experience for desktop and mobile that brings sales, orders, products, customers, and reporting into one clear system.",
    focus: "Retail workflows · desktop and mobile",
    highlights: ["Sales and order tracking", "Products and customer tools", "Business reporting"],
    tools: ["Figma", "FigJam", "Prototyping"],
  },
  {
    name: "YC Fitness",
    category: "Mobile · fitness",
    image: "/images/yc.png",
    imageWidth: 360,
    imageHeight: 360,
    alt: "YC Fitness brand mark",
    color: "#fbe9cc",
    summary:
      "A fitness app with personalized plans and progress tracking, shaped around a shorter, more direct route from opening the app to starting a workout.",
    focus: "Mobile product design · fitness",
    highlights: ["35% fewer navigation steps", "Personalized workout plans", "Progress tracking"],
    tools: ["Figma", "User flows", "Prototyping"],
  },
  {
    name: "Share Friend Thailand",
    category: "Mobile · social",
    image: "/images/sf.png",
    imageWidth: 160,
    imageHeight: 160,
    alt: "Share Friend Thailand app mark",
    color: "#d8c7ea",
    summary:
      "Core social journeys for a mobile product, covering onboarding, profiles, discovery, matching, chat, notifications, and account management.",
    focus: "Social product journeys · mobile",
    highlights: ["Onboarding and profiles", "Discovery, matching, and chat", "Notifications and account flows"],
    tools: ["Figma", "Interaction design", "UI systems"],
  },
  {
    name: "360 Digital",
    category: "SaaS · travel and hospitality",
    image: "/images/360.png",
    imageWidth: 360,
    imageHeight: 360,
    alt: "360 Digital brand mark",
    color: "#f1b79e",
    summary:
      "Product design for travel and hospitality platforms, supported by a shared component system for complex, connected services.",
    focus: "SaaS product design · travel and hospitality",
    highlights: ["120+ design components", "50+ production screens", "Shared product patterns"],
    tools: ["Figma", "Design systems", "Developer handoff"],
  },
];

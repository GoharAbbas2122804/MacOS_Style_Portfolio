/**
 * Project Catalog Constants
 * 
 * Centralized data store for all portfolio projects.
 * Each project includes image, links, technologies, and descriptions.
 */

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string; // Path to image in public/project_images/
  githubUrl?: string; // GitHub repository URL
  liveDemoUrl?: string; // Live demo/production URL
  tools: string[]; // Technologies, frameworks, and tools used
  category?: string; // e.g., "Web Development", "E-commerce", "Landing Page"
  featured?: boolean; // Whether to highlight this project
  gradient?: string; // Tailwind gradient classes for UI
  year?: number; // Project year
}

/**
 * Project Catalog
 * 
 * Add your projects here with all relevant information.
 * Images should be placed in public/project_images/ directory.
 */
export const PROJECTS: Project[] = [
  {
    id: "fragrance-web",
    title: "Fragrance Web",
    description: "E-commerce platform for fragrance products with modern UI/UX design.",
    longDescription: "A fully responsive e-commerce website built for fragrance products. Features include product catalog, shopping cart, user authentication, and payment integration.",
    image: "/project_images/fragrance_web.jpeg",
    githubUrl: "https://github.com/GoharAbbas2122804/fragrance-web",
    liveDemoUrl: "https://fragrance-web.vercel.app",
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Stripe", "MongoDB"],
    category: "E-commerce",
    featured: true,
    gradient: "from-purple-500 to-pink-500",
    year: 2024,
  },
  {
    id: "landing-page",
    title: "Landing Page",
    description: "Modern and responsive landing page with smooth animations and engaging design.",
    longDescription: "A conversion-optimized landing page featuring smooth scroll animations, interactive elements, and mobile-first responsive design.",
    image: "/project_images/landing_page.jpeg",
    githubUrl: "https://github.com/GoharAbbas2122804/landing-page",
    liveDemoUrl: "https://landing-page-demo.vercel.app",
    tools: ["React", "Next.js", "Framer Motion", "Tailwind CSS", "GSAP"],
    category: "Landing Page",
    featured: false,
    gradient: "from-blue-500 to-cyan-500",
    year: 2024,
  },
  {
    id: "mojito-landing",
    title: "Mojito Landing Page",
    description: "Creative landing page design for Mojito brand with vibrant visuals.",
    longDescription: "An eye-catching landing page showcasing Mojito products with creative animations, product showcases, and engaging call-to-action sections.",
    image: "/project_images/mojito_landing_page.jpeg",
    githubUrl: "https://github.com/GoharAbbas2122804/mojito-landing",
    liveDemoUrl: "https://mojito-landing.vercel.app",
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    category: "Landing Page",
    featured: true,
    gradient: "from-green-500 to-emerald-500",
    year: 2024,
  },
  {
    id: "nike-shoes",
    title: "Nike Shoes E-commerce",
    description: "E-commerce platform for Nike shoes with product catalog and shopping features.",
    longDescription: "A modern e-commerce website for Nike shoes featuring product filtering, detailed product pages, shopping cart functionality, and seamless checkout experience.",
    image: "/project_images/nike_shoes.jpeg",
    githubUrl: "https://github.com/GoharAbbas2122804/nike-shoes",
    liveDemoUrl: "https://nike-shoes-demo.vercel.app",
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Zustand", "Stripe"],
    category: "E-commerce",
    featured: true,
    gradient: "from-orange-500 to-red-500",
    year: 2024,
  },
  {
    id: "signalist",
    title: "Signalist",
    description: "Real-time communication platform with modern interface and features.",
    longDescription: "A communication platform built with real-time messaging capabilities, user management, and intuitive interface design.",
    image: "/project_images/signalist.jpeg",
    githubUrl: "https://github.com/GoharAbbas2122804/signalist",
    liveDemoUrl: "https://signalist.vercel.app",
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Socket.io", "PostgreSQL"],
    category: "Web Application",
    featured: false,
    gradient: "from-indigo-500 to-purple-500",
    year: 2024,
  },
];

/**
 * Helper functions to filter and query projects
 */
export const getProjectById = (id: string): Project | undefined => {
  return PROJECTS.find((project) => project.id === id);
};

export const getFeaturedProjects = (): Project[] => {
  return PROJECTS.filter((project) => project.featured === true);
};

export const getProjectsByCategory = (category: string): Project[] => {
  return PROJECTS.filter((project) => project.category === category);
};

export const getAllCategories = (): string[] => {
  const categories = PROJECTS.map((project) => project.category).filter(
    (category): category is string => category !== undefined
  );
  return Array.from(new Set(categories));
};

/**
 * Project statistics
 */
export const PROJECT_STATS = {
  total: PROJECTS.length,
  featured: PROJECTS.filter((p) => p.featured).length,
  categories: getAllCategories().length,
};

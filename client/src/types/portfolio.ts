export interface PortfolioPersonalData {
  full_name: string;
  title: string;
  contact_email: string;
  linkedin_url: string;
  github_url: string;
  bio: string;
  slug: string;
  theme_color: string;
  summary: string;
}

export interface PortfolioProject {
  id: string;
  name: string;
  description: string;
  tags: string;
  image_url: string;
  live_url: string;
  github_url: string;
  isNew: boolean;
}

export interface PortfolioSkill {
  category: string;
  skills: string[];
  isNew: boolean;
}

export interface PortfolioData extends PortfolioPersonalData {
  projects: PortfolioProject[];
  skills: PortfolioSkill[];
}

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

export interface PortfolioExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  technologies: string;
}

export interface PortfolioEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface PortfolioData extends PortfolioPersonalData {
  projects: PortfolioProject[];
  skills: PortfolioSkill[];
  experience: PortfolioExperience[];
  education: PortfolioEducation[];
  resume_ids?: string[];
}

export interface PortfolioPersonalData {
  fullName: string;
  title: string;
  email: string;
  linkedlnUrl: string;
  githubUrl: string;
  slug: string;
  colorTheme: string;
  description: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  link: string;
  githubUrl: string;
  isNew: boolean;
  tags: string;
}
// image_url: string;

export interface PortfolioSkill {
  skills: string[];
  category: string;
  isNew: boolean;
}

export interface PortfolioExperience {
  id: number;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  isNew: boolean;
}

export interface PortfolioEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface PortfolioData extends PortfolioPersonalData {
  id?: string;
  projects: PortfolioProject[];
  skills: PortfolioSkill[];
  experiences: PortfolioExperience[];
  education: PortfolioEducation[];
  resume_ids?: string[];
}

// LINKS
// GITHUB : https://github.com/Elfque
// LINKEDIN : https://www.linkedin.com/in/adeyemifaruqfrontendwebdeveloper/

// PROJECT

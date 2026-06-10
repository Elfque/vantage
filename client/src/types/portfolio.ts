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
}
// image_url: string;

export interface PortfolioSkill {
  name: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
  isNew: boolean;
}

export interface PortfolioExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string[];
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
  id?: string;
  projects: PortfolioProject[];
  skills: PortfolioSkill[];
  experience: PortfolioExperience[];
  education: PortfolioEducation[];
  resume_ids?: string[];
}

// LINKS
// GITHUB : https://github.com/Elfque
// LINKEDIN : https://www.linkedin.com/in/adeyemifaruqfrontendwebdeveloper/

// PROJECT

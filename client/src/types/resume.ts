export interface ResumePersonalData {
  full_name: string;
  contact_email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  website_url: string;
}

export interface ResumeEducation {
  id: number;
  school: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  graduation_date: string;
  isNew?: boolean;
}

export type SingleResumeExperience = {
  id: number;
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  description: string;
  isNew?: boolean;
};

export type ResumeExperience = SingleResumeExperience[];

export interface ResumeSkill {
  id: number;
  name: string;
  level: string;
  isNew?: boolean;
}

export interface ResumeProject {
  id: number;
  title: string;
  description: string;
  link: string;
  technologies: string;
  isNew?: boolean;
}

export interface ResumeData extends ResumePersonalData {
  summary: string;
}

export interface ResumeResponseData {
  id: string;
  title: string;
  summary: string;
  created_at: string;
}

export interface ResumeDataResponse {
  full_name: string;
  contact_email: string;
  phone: string;
  location: string;
  linkedin_url: string;
  website_url: string;
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    graduation_date: string;
  }>;
  skills: Array<{
    id: number;
    name: string;
    level: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string;
    link: string;
  }>;
  portfolio_ids?: string[];
}

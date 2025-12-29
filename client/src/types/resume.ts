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
}

export type SingleResumeExperience = {
  id: number;
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  description: string;
};

export type ResumeExperience = SingleResumeExperience[];

export interface ResumeSkill {
  id: number;
  name: string;
  level: string;
}

export interface ResumeProject {
  id: number;
  title: string;
  description: string;
  link: string;
  technologies: string;
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

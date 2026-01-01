"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Textarea from "@/components/Textarea";
import AppLayout from "@/components/layout/AppLayout";
import {
  ResumeData,
  ResumeEducation,
  ResumeExperience,
  ResumeProject,
  ResumeSkill,
} from "@/types/resume";
import PersonalInfo from "@/components/resumes/PersonalInfo";
import Experiences from "@/components/resumes/Experiences";
import Projects from "@/components/resumes/Projects";
import Education from "@/components/resumes/Education";
import Header from "@/components/layout/Header";
import { postAPIRequest } from "@/utils/requests";
import { showErrorToast, showSuccessToast } from "@/utils/ToasterProps";
import Skills from "@/components/resumes/Skills";

export default function NewResume() {
  const { data: session } = useSession();
  const router = useRouter();

  const [skills, setSkills] = useState<ResumeSkill[]>([]);
  const [projects, setProjects] = useState<ResumeProject[]>([]);
  const [education, setEducation] = useState<ResumeEducation[]>([]);
  const [experience, setExperience] = useState<ResumeExperience>([]);
  const [resumeData, setResumeData] = useState<ResumeData>({
    full_name: session?.user?.name || "",
    contact_email: session?.user?.email || "",
    phone: "",
    location: "",
    linkedin_url: "",
    website_url: "",
    summary: "",
  });
  const [activeSection, setActiveSection] = useState("personal");

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const newEdu = education.map((edu) => {
      const { id, ...rest } = edu;
      return { ...rest };
    });
    const newExp = experience.map((exp) => {
      const { id, ...rest } = exp;
      return { ...rest };
    });
    const newPro = projects.map((pro) => {
      const { id, ...rest } = pro;
      return { ...rest };
    });
    const newSkills = skills.map((skill) => {
      const { id, ...rest } = skill;
      return { ...rest };
    });

    postAPIRequest("/resumes/create", {
      ...resumeData,
      title: resumeData.full_name + " - Resume",
      education: newEdu,
      experience: newExp,
      projects: newPro,
      skills: newSkills,
    })
      .then(() => {
        showSuccessToast("Resume created successfully!");
        router.push(`/`);
      })
      .catch((err) => {
        console.log(err.response);
        showErrorToast("Error creating resume");
      });
  };

  return (
    <AppLayout>
      <div className="">
        <Header title="Create New Resume" />

        <header className="shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end items-center py-4">
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {/* Form Section */}
            <div className="w-1/2 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="mb-6 overflow-x-auto hide-scrollbar">
                <nav className="flex space-x-4 text-nowrap">
                  {[
                    { id: "personal", label: "Personal Info" },
                    { id: "summary", label: "Summary" },
                    { id: "experience", label: "Experience" },
                    { id: "education", label: "Education" },
                    { id: "skills", label: "Skills" },
                    { id: "projects", label: "Projects" },
                  ].map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        activeSection === section.id
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Personal Info Section */}
              {activeSection === "personal" && (
                <PersonalInfo
                  resumeData={resumeData}
                  updatePersonalInfo={updatePersonalInfo}
                />
              )}

              {/* Summary Section */}
              {activeSection === "summary" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Professional Summary
                  </h3>
                  <Textarea
                    value={resumeData.summary}
                    onChange={(e) =>
                      setResumeData((prev) => ({
                        ...prev,
                        summary: e.target.value,
                      }))
                    }
                    placeholder="Write a brief summary of your professional background and goals..."
                    rows={6}
                  />
                </div>
              )}

              {/* Experience Section */}
              {activeSection === "experience" && (
                <Experiences
                  experience={experience}
                  setExperience={setExperience}
                />
              )}

              {/* Education Section */}
              {activeSection === "education" && (
                <Education education={education} setEducation={setEducation} />
              )}

              {/* Skills Section */}
              {activeSection === "skills" && (
                <Skills skills={skills} setSkills={setSkills} />
              )}

              {/* Projects Section */}
              {activeSection === "projects" && (
                <Projects projects={projects} setProjects={setProjects} />
              )}
            </div>

            {/* Live Preview Section */}
            <div className="w-1/2 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Live Preview
              </h3>
              <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-700">
                {/* Resume Preview */}
                <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 shadow-lg">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {resumeData.full_name || "Your Name"}
                    </h1>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {resumeData.contact_email && (
                        <span>{resumeData.contact_email} • </span>
                      )}
                      {resumeData.phone && <span>{resumeData.phone} • </span>}
                      {resumeData.location && (
                        <span>{resumeData.location}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-wrap word-wrap">
                      {resumeData.linkedin_url && (
                        <span className="text-wrap word-wrap">
                          {resumeData.linkedin_url} •{" "}
                        </span>
                      )}
                      {resumeData.website_url && (
                        <span>{resumeData.website_url}</span>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  {resumeData.summary && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">
                        Professional Summary
                      </h2>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {resumeData.summary}
                      </p>
                    </div>
                  )}

                  {/* Experience */}
                  {experience.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">
                        Experience
                      </h2>
                      {experience.map((exp, index) => (
                        <div key={`exp-${index}`} className="mb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {exp.position}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {exp.company}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-500">
                              {exp.start_date} - {exp.end_date || "Present"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                            {exp.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Education */}
                  {education.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">
                        Education
                      </h2>
                      {education.map((edu, index) => (
                        <div key={`edu-${index}`} className="mb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {edu.degree} in {edu.field_of_study}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {edu.school}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-500">
                              {edu.graduation_date}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">
                        Skills
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {skills.map(
                          (skill, index) =>
                            skill && (
                              <span
                                key={`skills-${index}`}
                                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
                              >
                                {skill.name}
                              </span>
                            )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {projects.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">
                        Projects
                      </h2>
                      {projects.map((proj, index) => (
                        <div key={`projects-${index}`} className="mb-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {proj.title}
                            </h3>
                            {proj.link && (
                              <a
                                href={proj.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 text-sm"
                              >
                                Link
                              </a>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                            {proj.description}
                          </p>
                          {proj.technologies && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              Technologies: {proj.technologies}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

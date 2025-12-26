"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import AppLayout from "@/components/layout/AppLayout";

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
  }>;
  skills: string[];
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string;
    link: string;
  }>;
}

export default function NewResume() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
  });

  const [activeSection, setActiveSection] = useState("personal");

  //   if (status === "loading") {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center">
  //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  //       </div>
  //     );
  //   }

  //   if (!session) {
  //     router.push("/auth");
  //     return null;
  //   }

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      graduationDate: "",
    };
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addSkill = () => {
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) => (i === index ? value : skill)),
    }));
  };

  const removeSkill = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addProject = () => {
    const newProj = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: "",
      link: "",
    };
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj],
    }));
  };

  const updateProject = (id: string, field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  const handleSave = () => {
    // TODO: Save to database or local storage
    console.log("Saving resume:", resumeData);
    alert("Resume saved successfully!");
  };

  const handleExport = () => {
    // TODO: Implement PDF export
    alert("Export functionality coming soon!");
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    alert("Share functionality coming soon!");
  };

  return (
    <AppLayout>
      <div className="">
        <header className="shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push("/")}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  ← Back to Dashboard
                </button>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Create New Resume
                </h1>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Save
                </button>
                <button
                  onClick={handleExport}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Export PDF
                </button>
                <button
                  onClick={handleShare}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {/* Form Section */}
            <div className="w-1/2 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="mb-6">
                <nav className="flex space-x-4">
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
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="text"
                        value={resumeData.personalInfo.fullName}
                        onChange={(e) =>
                          updatePersonalInfo("fullName", e.target.value)
                        }
                        label="Full Name"
                        name="fullName"
                      />
                    </div>
                    <div>
                      <Input
                        label="Email"
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) =>
                          updatePersonalInfo("email", e.target.value)
                        }
                        name="email"
                      />
                    </div>
                    <div>
                      <Input
                        label="Phone"
                        type="tel"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) =>
                          updatePersonalInfo("phone", e.target.value)
                        }
                        name="phone"
                      />
                    </div>
                    <div>
                      <Input
                        label="Location"
                        value={resumeData.personalInfo.location}
                        onChange={(e) =>
                          updatePersonalInfo("location", e.target.value)
                        }
                        name="location"
                      />
                    </div>
                    <div>
                      <Input
                        label="LinkedIn"
                        type="url"
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) =>
                          updatePersonalInfo("linkedin", e.target.value)
                        }
                        name="linkedin"
                      />
                    </div>
                    <div>
                      <Input
                        label="Website"
                        type="url"
                        value={resumeData.personalInfo.website}
                        onChange={(e) =>
                          updatePersonalInfo("website", e.target.value)
                        }
                        name="website"
                      />
                    </div>
                    {/* <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Website
                    </label>
                    <input
                      type="url"
                      value={resumeData.personalInfo.website}
                      onChange={(e) =>
                        updatePersonalInfo("website", e.target.value)
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div> */}
                  </div>
                </div>
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
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Work Experience
                    </h3>
                    <button
                      onClick={addExperience}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Add Experience
                    </button>
                  </div>
                  {resumeData.experience.map((exp, index) => (
                    <div
                      key={exp.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-md p-4"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-md font-medium">
                          Experience {index + 1}
                        </h4>
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Input
                            type="text"
                            value={exp.company}
                            label="Company"
                            onChange={(e) =>
                              updateExperience(
                                exp.id,
                                "company",
                                e.target.value
                              )
                            }
                            name="company"
                          />
                        </div>
                        <div>
                          <Input
                            label="Position"
                            type="text"
                            value={exp.position}
                            onChange={(e) =>
                              updateExperience(
                                exp.id,
                                "position",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <Input
                            label="Start Date"
                            type="month"
                            value={exp.startDate}
                            onChange={(e) =>
                              updateExperience(
                                exp.id,
                                "startDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div>
                          <Input
                            label="End Date"
                            type="month"
                            value={exp.endDate}
                            onChange={(e) =>
                              updateExperience(
                                exp.id,
                                "endDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Textarea
                          label="Description"
                          value={exp.description}
                          onChange={(e) =>
                            updateExperience(
                              exp.id,
                              "description",
                              e.target.value
                            )
                          }
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Education Section */}
              {activeSection === "education" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Education
                    </h3>
                    <button
                      onClick={addEducation}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Add Education
                    </button>
                  </div>
                  {resumeData.education.map((edu, index) => (
                    <div
                      key={edu.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-md p-4"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-md font-medium">
                          Education {index + 1}
                        </h4>
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Input
                            type="text"
                            value={edu.institution}
                            onChange={(e) =>
                              updateEducation(
                                edu.id,
                                "institution",
                                e.target.value
                              )
                            }
                            label="Institution"
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            value={edu.degree}
                            onChange={(e) =>
                              updateEducation(edu.id, "degree", e.target.value)
                            }
                            label="Degree"
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            value={edu.field}
                            onChange={(e) =>
                              updateEducation(edu.id, "field", e.target.value)
                            }
                            label="Field of Study"
                          />
                        </div>
                        <div>
                          <Input
                            type="month"
                            value={edu.graduationDate}
                            onChange={(e) =>
                              updateEducation(
                                edu.id,
                                "graduationDate",
                                e.target.value
                              )
                            }
                            label="Graduation Date"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills Section */}
              {activeSection === "skills" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Skills
                    </h3>
                    <button
                      onClick={addSkill}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
                    >
                      Add Skill
                    </button>
                  </div>
                  {resumeData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="text"
                        value={skill}
                        onChange={(e) => updateSkill(index, e.target.value)}
                        placeholder="Enter a skill"
                      />
                      <button
                        onClick={() => removeSkill(index)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects Section */}
              {activeSection === "projects" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Projects
                    </h3>
                    <button
                      onClick={addProject}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Add Project
                    </button>
                  </div>
                  {resumeData.projects.map((proj, index) => (
                    <div
                      key={proj.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-md p-4"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-md font-medium">
                          Project {index + 1}
                        </h4>
                        <button
                          onClick={() => removeProject(proj.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Input
                            type="text"
                            value={proj.name}
                            onChange={(e) =>
                              updateProject(proj.id, "name", e.target.value)
                            }
                            label="Project Name"
                          />
                        </div>
                        <div>
                          <Textarea
                            label="Description"
                            value={proj.description}
                            onChange={(e) =>
                              updateProject(
                                proj.id,
                                "description",
                                e.target.value
                              )
                            }
                            rows={3}
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            value={proj.technologies}
                            onChange={(e) =>
                              updateProject(
                                proj.id,
                                "technologies",
                                e.target.value
                              )
                            }
                            placeholder="e.g., React, Node.js, MongoDB"
                            label="Technologies used"
                          />
                        </div>
                        <div>
                          <Input
                            type="url"
                            value={proj.link}
                            onChange={(e) =>
                              updateProject(proj.id, "link", e.target.value)
                            }
                            placeholder="https://yourprojectlink.com"
                            label="Project Link"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
                      {resumeData.personalInfo.fullName || "Your Name"}
                    </h1>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {resumeData.personalInfo.email && (
                        <span>{resumeData.personalInfo.email} • </span>
                      )}
                      {resumeData.personalInfo.phone && (
                        <span>{resumeData.personalInfo.phone} • </span>
                      )}
                      {resumeData.personalInfo.location && (
                        <span>{resumeData.personalInfo.location}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {resumeData.personalInfo.linkedin && (
                        <span>{resumeData.personalInfo.linkedin} • </span>
                      )}
                      {resumeData.personalInfo.website && (
                        <span>{resumeData.personalInfo.website}</span>
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
                  {resumeData.experience.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">
                        Experience
                      </h2>
                      {resumeData.experience.map((exp) => (
                        <div key={exp.id} className="mb-4">
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
                              {exp.startDate} - {exp.endDate || "Present"}
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
                  {resumeData.education.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">
                        Education
                      </h2>
                      {resumeData.education.map((edu) => (
                        <div key={edu.id} className="mb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {edu.degree} in {edu.field}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {edu.institution}
                              </p>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-500">
                              {edu.graduationDate}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {resumeData.skills.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">
                        Skills
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map(
                          (skill, index) =>
                            skill && (
                              <span
                                key={index}
                                className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
                              >
                                {skill}
                              </span>
                            )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {resumeData.projects.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-600 pb-1 mb-2">
                        Projects
                      </h2>
                      {resumeData.projects.map((proj) => (
                        <div key={proj.id} className="mb-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {proj.name}
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

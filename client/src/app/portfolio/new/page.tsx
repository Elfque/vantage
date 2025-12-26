"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Button from "@/components/Button";
import GeneralSidebar from "@/components/layout/Sidebar";
import AppLayout from "@/components/layout/AppLayout";

interface PortfolioData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
    bio: string;
  };
  projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string;
    imageUrl: string;
    liveUrl: string;
    githubUrl: string;
    featured: boolean;
  }>;
  skills: Array<{
    category: string;
    skills: string[];
  }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    technologies: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
  }>;
}

export default function NewPortfolio() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    personalInfo: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
      bio: "",
    },
    projects: [],
    skills: [],
    experience: [],
    education: [],
  });

  const [activeSection, setActiveSection] = useState("personal");

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const updatePersonalInfo = (field: string, value: string) => {
    setPortfolioData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const addProject = () => {
    const newProj = {
      id: Date.now().toString(),
      title: "",
      description: "",
      technologies: "",
      imageUrl: "",
      liveUrl: "",
      githubUrl: "",
      featured: false,
    };
    setPortfolioData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProj],
    }));
  };

  const updateProject = (
    id: string,
    field: string,
    value: string | boolean
  ) => {
    setPortfolioData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, [field]: value } : proj
      ),
    }));
  };

  const removeProject = (id: string) => {
    setPortfolioData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  const addSkillCategory = () => {
    setPortfolioData((prev) => ({
      ...prev,
      skills: [...prev.skills, { category: "", skills: [] }],
    }));
  };

  const updateSkillCategory = (
    index: number,
    field: string,
    value: string | string[]
  ) => {
    setPortfolioData((prev) => ({
      ...prev,
      skills: prev.skills.map((skillCat, i) =>
        i === index ? { ...skillCat, [field]: value } : skillCat
      ),
    }));
  };

  const removeSkillCategory = (index: number) => {
    setPortfolioData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addSkillToCategory = (categoryIndex: number) => {
    const skills = [...portfolioData.skills[categoryIndex].skills, ""];
    updateSkillCategory(categoryIndex, "skills", skills);
  };

  const updateSkillInCategory = (
    categoryIndex: number,
    skillIndex: number,
    value: string
  ) => {
    const skills = [...portfolioData.skills[categoryIndex].skills];
    skills[skillIndex] = value;
    updateSkillCategory(categoryIndex, "skills", skills);
  };

  const removeSkillFromCategory = (
    categoryIndex: number,
    skillIndex: number
  ) => {
    const skills = portfolioData.skills[categoryIndex].skills.filter(
      (_, i) => i !== skillIndex
    );
    updateSkillCategory(categoryIndex, "skills", skills);
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      technologies: "",
    };
    setPortfolioData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setPortfolioData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setPortfolioData((prev) => ({
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
    setPortfolioData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setPortfolioData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setPortfolioData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const handleSave = () => {
    // TODO: Save to database or local storage
    console.log("Saving portfolio:", portfolioData);
    alert("Portfolio saved successfully!");
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    alert("Export functionality coming soon!");
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    alert("Share functionality coming soon!");
  };

  return (
    <AppLayout>
      <div className="flex min-h-screen">
        <div className="flex-1">
          <header className="bg-white dark:bg-gray-800 shadow">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center space-x-4">
                  {/* <Button
                    onClick={() => router.push("/")}
                    variant="outline"
                    size="sm"
                  >
                    ← Back to Dashboard
                  </Button> */}
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Create New Portfolio
                  </h1>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSave} variant="primary" size="sm">
                    Save
                  </Button>
                  <Button onClick={handleExport} variant="primary" size="sm">
                    Export
                  </Button>
                  <Button onClick={handleShare} variant="secondary" size="sm">
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {/* Form Section */}
              <div className="w-1/2 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="mb-6">
                  <nav className="flex space-x-4 flex-wrap">
                    {[
                      { id: "personal", label: "Personal Info" },
                      { id: "projects", label: "Projects" },
                      { id: "skills", label: "Skills" },
                      { id: "experience", label: "Experience" },
                      { id: "education", label: "Education" },
                    ].map((section) => (
                      <Button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        variant={
                          activeSection === section.id ? "primary" : "outline"
                        }
                        size="sm"
                        className="mb-2"
                      >
                        {section.label}
                      </Button>
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
                      <div className="col-span-2">
                        <Input
                          label="Full Name"
                          type="text"
                          value={portfolioData.personalInfo.fullName}
                          onChange={(e) =>
                            updatePersonalInfo("fullName", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          label="Professional Title"
                          type="text"
                          value={portfolioData.personalInfo.title}
                          onChange={(e) =>
                            updatePersonalInfo("title", e.target.value)
                          }
                          placeholder="e.g., Full Stack Developer"
                        />
                      </div>
                      <div>
                        <Input
                          label="Email"
                          type="email"
                          value={portfolioData.personalInfo.email}
                          onChange={(e) =>
                            updatePersonalInfo("email", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Input
                          label="Phone"
                          type="tel"
                          value={portfolioData.personalInfo.phone}
                          onChange={(e) =>
                            updatePersonalInfo("phone", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Input
                          label="Location"
                          type="text"
                          value={portfolioData.personalInfo.location}
                          onChange={(e) =>
                            updatePersonalInfo("location", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Input
                          label="LinkedIn"
                          type="url"
                          value={portfolioData.personalInfo.linkedin}
                          onChange={(e) =>
                            updatePersonalInfo("linkedin", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Input
                          label="GitHub"
                          type="url"
                          value={portfolioData.personalInfo.github}
                          onChange={(e) =>
                            updatePersonalInfo("github", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Input
                          label="Website"
                          type="url"
                          value={portfolioData.personalInfo.website}
                          onChange={(e) =>
                            updatePersonalInfo("website", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Textarea
                        label="Bio"
                        value={portfolioData.personalInfo.bio}
                        onChange={(e) =>
                          updatePersonalInfo("bio", e.target.value)
                        }
                        placeholder="Tell visitors about yourself..."
                        rows={4}
                      />
                    </div>
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
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Add Project
                      </button>
                    </div>
                    {portfolioData.projects.map((proj, index) => (
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
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={proj.featured}
                              onChange={(e) =>
                                updateProject(
                                  proj.id,
                                  "featured",
                                  e.target.checked
                                )
                              }
                              className="rounded"
                            />
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Featured Project
                            </label>
                          </div>
                          <div>
                            <Input
                              label="Project Title"
                              type="text"
                              value={proj.title}
                              onChange={(e) =>
                                updateProject(proj.id, "title", e.target.value)
                              }
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
                              label="Technologies Used"
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
                            />
                          </div>
                          <div>
                            <Input
                              label="Image URL"
                              type="url"
                              value={proj.imageUrl}
                              onChange={(e) =>
                                updateProject(
                                  proj.id,
                                  "imageUrl",
                                  e.target.value
                                )
                              }
                              placeholder="https://example.com/project-image.jpg"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Input
                                label="Live Demo URL"
                                type="url"
                                value={proj.liveUrl}
                                onChange={(e) =>
                                  updateProject(
                                    proj.id,
                                    "liveUrl",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Input
                                label="GitHub URL"
                                type="url"
                                value={proj.githubUrl}
                                onChange={(e) =>
                                  updateProject(
                                    proj.id,
                                    "githubUrl",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
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
                      <Button
                        onClick={addSkillCategory}
                        variant="primary"
                        size="sm"
                      >
                        Add Category
                      </Button>
                    </div>
                    {portfolioData.skills.map((skillCat, catIndex) => (
                      <div
                        key={catIndex}
                        className="border border-gray-200 dark:border-gray-600 rounded-md p-4"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-md font-medium">
                            Skill Category {catIndex + 1}
                          </h4>
                          <button
                            onClick={() => removeSkillCategory(catIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="mb-4">
                          <Input
                            label="Category Name"
                            type="text"
                            value={skillCat.category}
                            onChange={(e) =>
                              updateSkillCategory(
                                catIndex,
                                "category",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Frontend, Backend, Tools"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Skills
                            </label>
                            <button
                              onClick={() => addSkillToCategory(catIndex)}
                              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs"
                            >
                              Add Skill
                            </button>
                          </div>
                          {skillCat.skills.map((skill, skillIndex) => (
                            <div
                              key={skillIndex}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="text"
                                value={skill}
                                onChange={(e) =>
                                  updateSkillInCategory(
                                    catIndex,
                                    skillIndex,
                                    e.target.value
                                  )
                                }
                                placeholder="Enter a skill"
                                className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              />
                              <button
                                onClick={() =>
                                  removeSkillFromCategory(catIndex, skillIndex)
                                }
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Experience Section */}
                {activeSection === "experience" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Experience
                      </h3>
                      <button
                        onClick={addExperience}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Add Experience
                      </button>
                    </div>
                    {portfolioData.experience.map((exp, index) => (
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
                              label="Company"
                              type="text"
                              value={exp.company}
                              onChange={(e) =>
                                updateExperience(
                                  exp.id,
                                  "company",
                                  e.target.value
                                )
                              }
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
                        <div className="mt-4">
                          <Input
                            label="Technologies Used"
                            type="text"
                            value={exp.technologies}
                            onChange={(e) =>
                              updateExperience(
                                exp.id,
                                "technologies",
                                e.target.value
                              )
                            }
                            placeholder="e.g., React, Node.js, AWS"
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
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Add Education
                      </button>
                    </div>
                    {portfolioData.education.map((edu, index) => (
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
                              label="Institution"
                              type="text"
                              value={edu.institution}
                              onChange={(e) =>
                                updateEducation(
                                  edu.id,
                                  "institution",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Input
                              label="Degree"
                              type="text"
                              value={edu.degree}
                              onChange={(e) =>
                                updateEducation(
                                  edu.id,
                                  "degree",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Input
                              label="Field of Study"
                              type="text"
                              value={edu.field}
                              onChange={(e) =>
                                updateEducation(edu.id, "field", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Input
                              label="Graduation Date"
                              type="month"
                              value={edu.graduationDate}
                              onChange={(e) =>
                                updateEducation(
                                  edu.id,
                                  "graduationDate",
                                  e.target.value
                                )
                              }
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
                <div className="border border-gray-200 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-700 max-h-screen overflow-y-auto">
                  {/* Portfolio Preview */}
                  <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {portfolioData.personalInfo.fullName || "Your Name"}
                      </h1>
                      <p className="text-xl text-green-600 dark:text-green-400 mb-4">
                        {portfolioData.personalInfo.title || "Your Title"}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">
                        {portfolioData.personalInfo.bio ||
                          "Your bio will appear here..."}
                      </p>
                      <div className="flex justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        {portfolioData.personalInfo.email && (
                          <span>{portfolioData.personalInfo.email}</span>
                        )}
                        {portfolioData.personalInfo.phone && (
                          <span>• {portfolioData.personalInfo.phone}</span>
                        )}
                        {portfolioData.personalInfo.location && (
                          <span>• {portfolioData.personalInfo.location}</span>
                        )}
                      </div>
                      <div className="flex justify-center space-x-4 mt-4">
                        {portfolioData.personalInfo.linkedin && (
                          <a
                            href={portfolioData.personalInfo.linkedin}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            LinkedIn
                          </a>
                        )}
                        {portfolioData.personalInfo.github && (
                          <a
                            href={portfolioData.personalInfo.github}
                            className="text-gray-800 dark:text-gray-200 hover:text-gray-600"
                          >
                            GitHub
                          </a>
                        )}
                        {portfolioData.personalInfo.website && (
                          <a
                            href={portfolioData.personalInfo.website}
                            className="text-green-600 hover:text-green-800"
                          >
                            Website
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Featured Projects */}
                    {portfolioData.projects.filter((p) => p.featured).length >
                      0 && (
                      <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-300 dark:border-gray-600 pb-2">
                          Featured Projects
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {portfolioData.projects
                            .filter((p) => p.featured)
                            .map((proj) => (
                              <div
                                key={proj.id}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-md"
                              >
                                {proj.imageUrl && (
                                  <img
                                    src={proj.imageUrl}
                                    alt={proj.title}
                                    className="w-full h-48 object-cover"
                                  />
                                )}
                                <div className="p-6">
                                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {proj.title || "Project Title"}
                                  </h3>
                                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {proj.description ||
                                      "Project description..."}
                                  </p>
                                  {proj.technologies && (
                                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                                      <strong>Technologies:</strong>{" "}
                                      {proj.technologies}
                                    </p>
                                  )}
                                  <div className="flex space-x-4">
                                    {proj.liveUrl && (
                                      <a
                                        href={proj.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                                      >
                                        Live Demo
                                      </a>
                                    )}
                                    {proj.githubUrl && (
                                      <a
                                        href={proj.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded text-sm"
                                      >
                                        GitHub
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </section>
                    )}

                    {/* All Projects */}
                    {portfolioData.projects.length > 0 && (
                      <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-300 dark:border-gray-600 pb-2">
                          All Projects
                        </h2>
                        <div className="space-y-6">
                          {portfolioData.projects.map((proj) => (
                            <div
                              key={proj.id}
                              className="border-l-4 border-green-500 pl-6"
                            >
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {proj.title || "Project Title"}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 mb-2">
                                {proj.description || "Project description..."}
                              </p>
                              {proj.technologies && (
                                <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                                  <strong>Technologies:</strong>{" "}
                                  {proj.technologies}
                                </p>
                              )}
                              <div className="flex space-x-4">
                                {proj.liveUrl && (
                                  <a
                                    href={proj.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-800 text-sm"
                                  >
                                    Live Demo →
                                  </a>
                                )}
                                {proj.githubUrl && (
                                  <a
                                    href={proj.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-gray-800 text-sm"
                                  >
                                    GitHub →
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Skills */}
                    {portfolioData.skills.length > 0 && (
                      <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-300 dark:border-gray-600 pb-2">
                          Skills
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {portfolioData.skills.map((skillCat, index) => (
                            <div key={index}>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                {skillCat.category || "Skill Category"}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {skillCat.skills.map(
                                  (skill, skillIndex) =>
                                    skill && (
                                      <span
                                        key={skillIndex}
                                        className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm"
                                      >
                                        {skill}
                                      </span>
                                    )
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Experience */}
                    {portfolioData.experience.length > 0 && (
                      <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-300 dark:border-gray-600 pb-2">
                          Experience
                        </h2>
                        <div className="space-y-6">
                          {portfolioData.experience.map((exp) => (
                            <div
                              key={exp.id}
                              className="border-l-4 border-blue-500 pl-6"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                  {exp.position || "Position"}
                                </h3>
                                <span className="text-sm text-gray-500 dark:text-gray-500">
                                  {exp.startDate} - {exp.endDate || "Present"}
                                </span>
                              </div>
                              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                                {exp.company || "Company"}
                              </p>
                              <p className="text-gray-700 dark:text-gray-300 mb-2">
                                {exp.description || "Job description..."}
                              </p>
                              {exp.technologies && (
                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                  <strong>Technologies:</strong>{" "}
                                  {exp.technologies}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {/* Education */}
                    {portfolioData.education.length > 0 && (
                      <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-300 dark:border-gray-600 pb-2">
                          Education
                        </h2>
                        <div className="space-y-4">
                          {portfolioData.education.map((edu) => (
                            <div
                              key={edu.id}
                              className="border-l-4 border-purple-500 pl-6"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {edu.degree || "Degree"} in{" "}
                                    {edu.field || "Field"}
                                  </h3>
                                  <p className="text-gray-600 dark:text-gray-400">
                                    {edu.institution || "Institution"}
                                  </p>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-500">
                                  {edu.graduationDate || "Graduation Date"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

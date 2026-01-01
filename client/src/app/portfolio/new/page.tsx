"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Button from "@/components/Button";
import AppLayout from "@/components/layout/AppLayout";
import { postAPIRequest } from "@/utils/requests";
import { showErrorToast, showSuccessToast } from "@/utils/ToasterProps";
import {
  PortfolioPersonalData,
  PortfolioProject,
  PortfolioSkill,
} from "@/types/portfolio";
import PortfolioPersonalInfo from "@/components/portfolios/PortfolioPersonalInfo";
import PortfolioProjects from "@/components/portfolios/PortfolioProjects";
import PortfolioSkills from "@/components/portfolios/PortfolioSkills";

export default function NewPortfolio() {
  const { data: session } = useSession();
  const router = useRouter();

  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [skills, setSkills] = useState<PortfolioSkill[]>([]);
  const [portfolioData, setPortfolioData] = useState<PortfolioPersonalData>({
    full_name: session?.user?.name || "",
    contact_email: session?.user?.email || "",
    title: "",
    linkedin_url: "",
    github_url: "",
    bio: "",
    slug: "",
    theme_color: "#3B82F6",
    summary: "",
  });

  const [activeSection, setActiveSection] = useState("personal");

  const updatePersonalInfo = (field: string, value: string) => {
    setPortfolioData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const payload = {
      ...portfolioData,
      projects,
      skills,
    };

    postAPIRequest("/portfolio/create", payload)
      .then(({ id }) => {
        showSuccessToast("Portfolio created successfully!");
        console.log(id);
        router.push(`/portfolio/${id}`);
      })
      .catch((err) => {
        showErrorToast(
          err.response?.data?.message ?? "Error creating portfolio."
        );
      });
  };

  return (
    <AppLayout>
      <Header title="Create New Portfolio" />
      <div className="flex min-h-screen">
        <div className="flex-1">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex justify-end items-center py-4">
              <Button onClick={handleSave} variant="primary" size="md">
                Save
              </Button>
            </div>
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
                  <PortfolioPersonalInfo
                    portfolioData={portfolioData}
                    updatePersonalInfo={updatePersonalInfo}
                  />
                )}

                {/* Projects Section */}
                {activeSection === "projects" && (
                  <PortfolioProjects
                    projects={projects}
                    setProjects={setProjects}
                  />
                )}

                {/* Skills Section */}
                {activeSection === "skills" && (
                  <PortfolioSkills skills={skills} setSkills={setSkills} />
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
                        {portfolioData.full_name || "Your Name"}
                      </h1>
                      <p className="text-xl text-green-600 dark:text-green-400 mb-4">
                        {portfolioData.title || "Your Title"}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">
                        {portfolioData.bio || "Your bio will appear here..."}
                      </p>
                      <div className="flex justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        {portfolioData.contact_email && (
                          <span>{portfolioData.contact_email}</span>
                        )}
                      </div>
                      <div className="flex justify-center space-x-4 mt-4">
                        {portfolioData.linkedin_url && (
                          <a
                            href={portfolioData.linkedin_url}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            LinkedIn
                          </a>
                        )}
                        {portfolioData.github_url && (
                          <a
                            href={portfolioData.github_url}
                            className="text-gray-800 dark:text-gray-200 hover:text-gray-600"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>

                    {/* All Projects */}
                    {projects.length > 0 && (
                      <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-300 dark:border-gray-600 pb-2">
                          All Projects
                        </h2>
                        <div className="space-y-6">
                          {projects.map((proj) => (
                            <div
                              key={proj.id}
                              className="border-l-4 border-green-500 pl-6"
                            >
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {proj.name || "Project Title"}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 mb-2">
                                {proj.description || "Project description..."}
                              </p>
                              {proj.tags && (
                                <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                                  <strong>Tags:</strong> {proj.tags}
                                </p>
                              )}
                              <div className="flex space-x-4">
                                {proj.live_url && (
                                  <a
                                    href={proj.live_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-600 hover:text-green-800 text-sm"
                                  >
                                    Live Demo →
                                  </a>
                                )}
                                {proj.github_url && (
                                  <a
                                    href={proj.github_url}
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
                    {skills.length > 0 && (
                      <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-300 dark:border-gray-600 pb-2">
                          Skills
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {skills.map((skillCat, index) => (
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

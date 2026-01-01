"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AppLayout from "@/components/layout/AppLayout";
import {
  PortfolioPersonalData,
  PortfolioProject,
  PortfolioSkill,
} from "@/types/portfolio";
import PortfolioPersonalInfo from "@/components/portfolios/PortfolioPersonalInfo";
import PortfolioProjects from "@/components/portfolios/PortfolioProjects";
import Header from "@/components/layout/Header";
import { postAPIRequest } from "@/utils/requests";
import { showErrorToast, showSuccessToast } from "@/utils/ToasterProps";
import PortfolioSkills from "@/components/portfolios/PortfolioSkills";

export default function NewPortfolio() {
  const { data: session, status } = useSession();
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

  const handleSave = async () => {
    try {
      const payload = {
        ...portfolioData,
        projects,
        skills,
      };

      const response = await postAPIRequest("portfolios", payload);
      showSuccessToast("Portfolio created successfully!");
      router.push("/portfolio");
    } catch (error) {
      console.error("Error creating portfolio:", error);
      showErrorToast("Failed to create portfolio");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const sections = [
    { id: "personal", label: "Personal Info" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "education", label: "Education" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <Header title="Create New Portfolio" />

        <div className="max-w-4xl mx-auto">
          {/* Section Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Section Content */}
          <div className="space-y-8">
            {activeSection === "personal" && (
              <PortfolioPersonalInfo
                portfolioData={portfolioData}
                updatePersonalInfo={updatePersonalInfo}
              />
            )}

            {activeSection === "projects" && (
              <PortfolioProjects
                projects={projects}
                setProjects={setProjects}
              />
            )}

            {activeSection === "skills" && (
              <PortfolioSkills skills={skills} setSkills={setSkills} />
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium"
            >
              Create Portfolio
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

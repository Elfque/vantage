"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import {
  PortfolioPersonalData,
  PortfolioProject,
  PortfolioSkill,
} from "@/types/portfolio";
import PortfolioPersonalInfo from "@/components/portfolios/PortfolioPersonalInfo";
import PortfolioProjects from "@/components/portfolios/PortfolioProjects";
import PortfolioSkills from "@/components/portfolios/PortfolioSkills";
import {
  getAPIRequest,
  putAPIRequest,
  deleteAPIRequest,
} from "@/utils/requests";
import { showErrorToast, showSuccessToast } from "@/utils/ToasterProps";

export default function EditPortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id?: string };

  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  useEffect(() => {
    if (id) fetchPortfolio();
  }, [id]);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const data = await getAPIRequest(`/portfolio/${id}`);
      // normalize data to local state shape
      setPortfolioData({
        full_name: data.full_name || "",
        contact_email: data.contact_email || "",
        title: data.title || "",
        linkedin_url: data.linkedin_url || "",
        github_url: data.github_url || "",
        bio: data.bio || "",
        slug: data.slug || "",
        theme_color: data.theme_color || "#3B82F6",
        summary: data.summary || "",
      });
      setProjects(data.projects || []);
      //   setSkills(data.skills || []);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      showErrorToast("Failed to load portfolio");
      //   router.push("/portfolio");
    } finally {
      setLoading(false);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setPortfolioData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);

    const newProject = projects.map((proj) => {
      const { id, isNew, ...rest } = proj;
      return isNew ? { ...rest } : { id, ...rest };
    });

    try {
      const payload = {
        ...portfolioData,
        projects: newProject,
        skills,
      };
      await putAPIRequest(`/portfolio/${id}`, payload);
      showSuccessToast("Portfolio updated successfully");
      router.push(`/portfolio/${id}`);
    } catch (error) {
      console.error("Error updating portfolio:", error);
      showErrorToast("Failed to update portfolio");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Delete this portfolio? This action cannot be undone."))
      return;
    setDeleting(true);
    try {
      await deleteAPIRequest(`/portfolio/${id}`);
      showSuccessToast("Portfolio deleted");
      router.push("/portfolio");
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      showErrorToast("Failed to delete portfolio");
    } finally {
      setDeleting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AppLayout>
    );
  }

  if (!portfolioData) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Portfolio not found
          </h3>
          <button
            onClick={() => router.push("/portfolio")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Portfolios
          </button>
        </div>
      </AppLayout>
    );
  }

  const sections = [
    { id: "personal", label: "Personal Info" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <Header title="Edit Portfolio" />

        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    const el = document.getElementById(section.id);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded"
                >
                  {section.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <section id="personal">
              <PortfolioPersonalInfo
                portfolioData={portfolioData}
                updatePersonalInfo={updatePersonalInfo}
              />
            </section>

            <section id="projects">
              <PortfolioProjects
                projects={projects}
                setProjects={setProjects}
              />
            </section>

            <section id="skills">
              <PortfolioSkills skills={skills} setSkills={setSkills} />
            </section>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

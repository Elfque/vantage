"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { getAPIRequest, deleteAPIRequest } from "@/utils/requests";
import { showErrorToast, showSuccessToast } from "@/utils/ToasterProps";
import { FaEdit, FaTrash } from "react-icons/fa";
import DeleteModal from "@/components/resumes/DeleteModal";
import Link from "next/link";

interface PortfolioData {
  id: string;
  full_name: string;
  title: string;
  contact_email: string;
  linkedin_url: string;
  github_url: string;
  bio: string;
  slug: string;
  theme_color: string;
  summary: string;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    tags: string;
    image_url: string;
    live_url: string;
    github_url: string;
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

export default function ViewPortfolio() {
  const router = useParams();
  const navigate = useRouter();
  const portfolioSlug = router.id as string;

  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (portfolioSlug) {
      fetchPortfolio();
    }
  }, [portfolioSlug]);

  const fetchPortfolio = async () => {
    try {
      const data = await getAPIRequest(`/portfolio/${portfolioSlug}`);
      setPortfolioData(data);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      showErrorToast("Failed to load portfolio");
      navigate.push("/portfolio");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteAPIRequest(`/portfolio/${portfolioData?.id}`);
      showSuccessToast("Portfolio deleted successfully");
      navigate.push("/portfolio");
      setDeleting(false);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      setDeleting(false);
      showErrorToast("Failed to delete portfolio");
    }
  };

  if (loading) {
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
            onClick={() => navigate.push("/portfolio")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Portfolios
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <Header title={portfolioData.title} />

        <div className="px-4 space-y-6">
          <div className="flex gap-2 justify-end">
            <Link
              href={`/portfolio/view/${portfolioData.slug}`}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              Preview
            </Link>
            <Link
              href={`/portfolio/${portfolioData.id}/edit`}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FaEdit />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FaTrash />
              Delete
            </button>
          </div>

          <div className="mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
            {/* Personal Info */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {portfolioData.full_name}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                {portfolioData.title}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                {portfolioData.bio}
              </p>
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                <a
                  href={`mailto:${portfolioData.contact_email}`}
                  className="hover:text-blue-600"
                >
                  {portfolioData.contact_email}
                </a>
                {portfolioData.linkedin_url && (
                  <a
                    href={portfolioData.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                  >
                    LinkedIn
                  </a>
                )}
                {portfolioData.github_url && (
                  <a
                    href={portfolioData.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </div>

            {/* Summary */}
            {portfolioData.summary && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Summary
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {portfolioData.summary}
                </p>
              </div>
            )}

            {/* Skills */}
            {portfolioData.skills?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Skills
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {portfolioData.skills.map((skillGroup, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        {skillGroup.category}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {portfolioData.projects.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Projects
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {portfolioData.projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {project.name}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {project.description}
                      </p>
                      {project.tags && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <strong>Tags:</strong> {project.tags}
                        </p>
                      )}
                      <div className="flex gap-2">
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Live Demo
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {showDeleteModal && (
          <DeleteModal
            setShowDeleteModal={setShowDeleteModal}
            confirmDelete={confirmDelete}
            deleting={deleting}
            isPortfolio
          />
        )}
      </div>
    </AppLayout>
  );
}

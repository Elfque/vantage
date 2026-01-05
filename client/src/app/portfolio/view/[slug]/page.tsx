"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAPIRequest } from "@/utils/requests";
import { showErrorToast } from "@/utils/ToasterProps";
import ViewPortflioLayout from "@/components/layout/ViewPortflioLayout";

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

export default function PortfolioPreview() {
  const params = useParams();
  const slug = params.slug as string;

  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPortfolio();
    }
  }, [slug]);

  const fetchPortfolio = async () => {
    try {
      const data = await getAPIRequest(`/portfolio/slug/${slug}`);
      setPortfolioData(data);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      showErrorToast("Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Portfolio Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The portfolio you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ViewPortflioLayout
      title={portfolioData.full_name}
      desc={portfolioData.summary}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header
          className="py-16 px-4 sm:px-6 lg:px-8"
          style={{ backgroundColor: portfolioData.theme_color }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {portfolioData.full_name}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-6">
              {portfolioData.title}
            </p>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {portfolioData.summary}
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {/* Contact Info */}
          <section className="mb-16 text-center">
            <div className="flex justify-center space-x-6">
              {portfolioData.contact_email && (
                <a
                  href={`mailto:${portfolioData.contact_email}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Email
                </a>
              )}
              {portfolioData.linkedin_url && (
                <a
                  href={portfolioData.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  LinkedIn
                </a>
              )}
              {portfolioData.github_url && (
                <a
                  href={portfolioData.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  GitHub
                </a>
              )}
            </div>
          </section>

          {/* Summary */}
          {portfolioData.summary && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                About
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {portfolioData.bio}
                </p>
              </div>
            </section>
          )}

          {/* Skills */}
          {portfolioData.skills && portfolioData.skills.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Skills
              </h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {portfolioData.skills.map((skillGroup, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      {skillGroup.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {portfolioData.experience && portfolioData.experience.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Experience
              </h2>
              <div className="space-y-6">
                {portfolioData.experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {exp.position}
                        </h3>
                        <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">
                          {exp.company}
                        </p>
                      </div>
                      <div className="text-right text-gray-600 dark:text-gray-400">
                        <p className="font-medium">
                          {exp.startDate} - {exp.endDate || "Present"}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {exp.description}
                    </p>
                    {exp.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.split(",").map((tech, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {portfolioData.projects && portfolioData.projects.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Projects
              </h2>
              <div className="grid gap-8 md:grid-cols-2">
                {portfolioData.projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                  >
                    {project.image_url && (
                      <img
                        src={project.image_url}
                        alt={project.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {project.name}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-4">
                        {project.description}
                      </p>
                      {project.tags && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.split(",").map((tag, index) => (
                            <span
                              key={index}
                              className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-4">
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                          >
                            Live Demo →
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 font-medium"
                          >
                            GitHub →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {portfolioData.education && portfolioData.education.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Education
              </h2>
              <div className="space-y-6">
                {portfolioData.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {edu.degree} in {edu.field}
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                          {edu.institution}
                        </p>
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        <p className="font-medium">{edu.graduationDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-800 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} {portfolioData.full_name}. Built with
              Resume Builder.
            </p>
          </div>
        </footer>
      </div>
    </ViewPortflioLayout>
  );
}

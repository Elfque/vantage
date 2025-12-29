"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { getAPIRequest } from "@/utils/requests";
import { showErrorToast } from "@/utils/ToasterProps";
import {
  FaEdit,
  FaDownload,
  FaShare,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa";

interface ResumeData {
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
}

export default function ViewResume() {
  const router = useParams();
  const navigate = useRouter();
  const resumeId = router.id as string;

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resumeId) {
      fetchResume();
    }
  }, [resumeId]);

  const fetchResume = async () => {
    try {
      const data = await getAPIRequest(`/resumes/${resumeId}`);
      setResumeData(data);
    } catch (error) {
      console.error("Error fetching resume:", error);
      showErrorToast("Failed to load resume");
      navigate.push("/resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate.push(`/resume/edit/${resumeId}`);
  };

  const handleDownload = () => {
    // TODO: Implement PDF download
    alert("PDF download coming soon!");
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    alert("Share functionality coming soon!");
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

  if (!resumeData) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Resume not found</p>
        </div>
      </AppLayout>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <AppLayout>
      <Header title="Resume Preview" />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FaEdit />
              Edit
            </button>
            <button
              onClick={handleDownload}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FaDownload />
              Download PDF
            </button>
            <button
              onClick={handleShare}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FaShare />
              Share
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white p-8">
            <h1 className="text-3xl font-bold mb-2">{resumeData.full_name}</h1>
            <div className="flex flex-wrap gap-4 text-blue-100">
              {resumeData.location && (
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt />
                  {resumeData.location}
                </div>
              )}
              {resumeData.phone && (
                <div className="flex items-center gap-1">
                  <FaPhone />
                  {resumeData.phone}
                </div>
              )}
              {resumeData.contact_email && (
                <div className="flex items-center gap-1">
                  <FaEnvelope />
                  {resumeData.contact_email}
                </div>
              )}
              {resumeData.linkedin_url && (
                <a
                  href={resumeData.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white"
                >
                  <FaLinkedin />
                  LinkedIn
                </a>
              )}
              {resumeData.website_url && (
                <a
                  href={resumeData.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white"
                >
                  <FaGlobe />
                  Website
                </a>
              )}
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Summary Section */}
            {resumeData.summary && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b-2 border-blue-600 pb-2">
                  Professional Summary
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {resumeData.summary}
                </p>
              </section>
            )}

            {/* Experience Section */}
            {resumeData.experience && resumeData.experience.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b-2 border-blue-600 pb-2">
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {resumeData.experience.map((exp, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-600 pl-4"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {exp.position}
                      </h3>
                      <p className="text-blue-600 font-medium mb-2">
                        {exp.company}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {formatDate(exp.start_date)} -{" "}
                        {exp.end_date ? formatDate(exp.end_date) : "Present"}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education Section */}
            {resumeData.education && resumeData.education.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b-2 border-blue-600 pb-2">
                  Education
                </h2>
                <div className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-green-600 pl-4"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {edu.degree} in {edu.field_of_study}
                      </h3>
                      <p className="text-green-600 font-medium mb-1">
                        {edu.school}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {formatDate(edu.start_date)} -{" "}
                        {formatDate(edu.graduation_date)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills Section */}
            {resumeData.skills && resumeData.skills.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b-2 border-blue-600 pb-2">
                  Skills
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {resumeData.skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-900 dark:text-white font-medium">
                        {skill.name}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm capitalize">
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects Section */}
            {resumeData.projects && resumeData.projects.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b-2 border-blue-600 pb-2">
                  Projects
                </h2>
                <div className="space-y-6">
                  {resumeData.projects.map((project, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-purple-600 pl-4"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {project.title}
                      </h3>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800 mb-2 inline-block"
                        >
                          View Project →
                        </a>
                      )}
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                        {project.description}
                      </p>
                      {project.technologies && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          <strong>Technologies:</strong> {project.technologies}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

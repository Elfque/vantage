"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const resumeRef = useRef<HTMLDivElement>(null);

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
    navigate.push(`/resume/${resumeId}/edit`);
  };

  const handleDownload = async () => {
    if (!resumeRef.current) return;

    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`${resumeData?.full_name || "resume"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      showErrorToast("Failed to download PDF");
    }
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
          <p className="text-gray-500">Resume not found</p>
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
          <div className="mb-4">
            <label className="block text-sm font-medium  dark:text-gray-300 mb-2">
              Choose Template:
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(Number(e.target.value))}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900"
            >
              <option value={1}>Template 1 - Classic</option>
              <option value={2}>Template 2 - Modern</option>
              <option value={3}>Template 3 - Minimal</option>
              <option value={4}>Template 4 - Creative</option>
            </select>
          </div>
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

        <div
          ref={resumeRef}
          className="shadow-lg mx-auto max-w-4xl font-serif"
          style={{
            width: "8.5in",
            minHeight: "11in",
            padding: "0.5in",
            boxSizing: "border-box",
            backgroundColor: "white",
            color: "black",
          }}
        >
          {selectedTemplate === 1 && (
            <>
              <div className="p-8">
                <h1 className="text-3xl font-bold mb-2">
                  {resumeData.full_name}
                </h1>
                <div className="flex flex-wrap gap-4">
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
                      className="flex items-center gap-1"
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
                      className="flex items-center gap-1"
                    >
                      <FaGlobe />
                      Website
                    </a>
                  )}
                </div>
              </div>
              <div className="p-8 space-y-8">
                {resumeData.summary && (
                  <section>
                    <h2
                      className="text-2xl font-bold mb-4 border-b-2 pb-2"
                      style={{ borderColor: "black" }}
                    >
                      Professional Summary
                    </h2>
                    <p className=" leading-relaxed">{resumeData.summary}</p>
                  </section>
                )}

                {/* Experience Section */}
                {resumeData.experience && resumeData.experience.length > 0 && (
                  <section>
                    <h2
                      className="text-2xl font-bold mb-4 border-b-2 pb-2"
                      style={{ borderColor: "black" }}
                    >
                      Work Experience
                    </h2>
                    <div className="space-y-6">
                      {resumeData.experience.map((exp, index) => (
                        <div key={index} className="">
                          <h3 className="text-xl font-semibold">
                            {exp.position}
                          </h3>
                          <p className="link-text font-medium mb-2">
                            {exp.company}
                          </p>
                          <p className="mb-3">
                            {formatDate(exp.start_date)} -{" "}
                            {exp.end_date
                              ? formatDate(exp.end_date)
                              : "Present"}
                          </p>
                          <p className=" leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Education Section */}
                {resumeData.education && resumeData.education.length > 0 && (
                  <section>
                    <h2
                      className="text-2xl font-bold mb-4 border-b-2 pb-2"
                      style={{ borderColor: "black" }}
                    >
                      Education
                    </h2>
                    <div className="space-y-4">
                      {resumeData.education.map((edu, index) => (
                        <div key={index} className="">
                          <h3 className="text-xl font-semibold">
                            {edu.degree} in {edu.field_of_study}
                          </h3>
                          <p className="font-medium mb-1">{edu.school}</p>
                          <p className="text-sm">
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
                    <h2
                      className="text-2xl font-bold mb-4 border-b-2 pb-2"
                      style={{ borderColor: "black" }}
                    >
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-4">
                      {resumeData.skills.map((skill) => skill.name).join(", ")}
                    </div>
                  </section>
                )}

                {/* Projects Section */}
                {resumeData.projects && resumeData.projects.length > 0 && (
                  <section>
                    <h2
                      className="text-2xl font-bold mb-4 border-b-2 pb-2"
                      style={{ borderColor: "black" }}
                    >
                      Projects
                    </h2>
                    <div className="space-y-6">
                      {resumeData.projects.map((project, index) => (
                        <div key={index}>
                          <h3 className="text-xl font-semibold">
                            {project.title}
                          </h3>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-text mb-2 inline-block"
                            >
                              View Project →
                            </a>
                          )}
                          <p className=" leading-relaxed mb-2">
                            {project.description}
                          </p>
                          {project.technologies && (
                            <p className="text-sm">
                              <strong>Technologies:</strong>{" "}
                              {project.technologies}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </>
          )}

          {selectedTemplate === 2 && (
            <>
              <div className="bg-gray-100 p-8 mb-8 border-b-4 border-gray-400">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  {resumeData.full_name}
                </h1>
                <div className="grid grid-cols-2 gap-4 text-gray-600">
                  {resumeData.location && (
                    <div>
                      <FaMapMarkerAlt className="inline mr-1" />
                      {resumeData.location}
                    </div>
                  )}
                  {resumeData.phone && (
                    <div>
                      <FaPhone className="inline mr-1" />
                      {resumeData.phone}
                    </div>
                  )}
                  {resumeData.contact_email && (
                    <div>
                      <FaEnvelope className="inline mr-1" />
                      {resumeData.contact_email}
                    </div>
                  )}
                  {resumeData.linkedin_url && (
                    <div>
                      <FaLinkedin className="inline mr-1" />
                      <a
                        href={resumeData.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    </div>
                  )}
                  {resumeData.website_url && (
                    <div>
                      <FaGlobe className="inline mr-1" />
                      <a
                        href={resumeData.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-8 space-y-6">
                {/* Summary Section */}
                {resumeData.summary && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 uppercase tracking-wide">
                      Professional Summary
                    </h2>
                    <p className=" leading-relaxed">{resumeData.summary}</p>
                  </section>
                )}

                {/* Experience Section */}
                {resumeData.experience && resumeData.experience.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 uppercase tracking-wide">
                      Work Experience
                    </h2>
                    <div className="space-y-4">
                      {resumeData.experience.map((exp, index) => (
                        <div key={index} className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {exp.position}
                          </h3>
                          <p className="text-gray-600 font-medium mb-1">
                            {exp.company} | {formatDate(exp.start_date)} -{" "}
                            {exp.end_date
                              ? formatDate(exp.end_date)
                              : "Present"}
                          </p>
                          <p className=" leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Education Section */}
                {resumeData.education && resumeData.education.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 uppercase tracking-wide">
                      Education
                    </h2>
                    <div className="space-y-3">
                      {resumeData.education.map((edu, index) => (
                        <div key={index}>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {edu.degree} in {edu.field_of_study}
                          </h3>
                          <p className="text-gray-600">
                            {edu.school} | {formatDate(edu.start_date)} -{" "}
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 uppercase tracking-wide">
                      Skills
                    </h2>
                    <p className="">
                      {resumeData.skills.map((skill) => skill.name).join(" • ")}
                    </p>
                  </section>
                )}

                {/* Projects Section */}
                {resumeData.projects && resumeData.projects.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3 uppercase tracking-wide">
                      Projects
                    </h2>
                    <div className="space-y-4">
                      {resumeData.projects.map((project, index) => (
                        <div key={index}>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {project.title}
                          </h3>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 mb-1 inline-block"
                            >
                              View Project
                            </a>
                          )}
                          <p className=" leading-relaxed mb-1">
                            {project.description}
                          </p>
                          {project.technologies && (
                            <p className="text-gray-600 text-sm">
                              Technologies: {project.technologies}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </>
          )}

          {selectedTemplate === 3 && (
            <>
              <div className="text-center p-8 mb-8">
                <h1 className="text-5xl font-light text-gray-800 mb-4">
                  {resumeData.full_name}
                </h1>
                <div className="flex justify-center flex-wrap gap-6 text-gray-600 text-sm">
                  {resumeData.location && <span>{resumeData.location}</span>}
                  {resumeData.phone && <span>{resumeData.phone}</span>}
                  {resumeData.contact_email && (
                    <span>{resumeData.contact_email}</span>
                  )}
                  {resumeData.linkedin_url && (
                    <a
                      href={resumeData.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn
                    </a>
                  )}
                  {resumeData.website_url && (
                    <a
                      href={resumeData.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Website
                    </a>
                  )}
                </div>
              </div>
              <div className="px-8 space-y-8">
                {/* Summary Section */}
                {resumeData.summary && (
                  <section>
                    <h2 className="text-xl font-light text-gray-800 mb-4 uppercase">
                      Summary
                    </h2>
                    <p className=" leading-relaxed">{resumeData.summary}</p>
                  </section>
                )}

                {/* Experience Section */}
                {resumeData.experience && resumeData.experience.length > 0 && (
                  <section>
                    <h2 className="text-xl font-light text-gray-800 mb-4 uppercase">
                      Experience
                    </h2>
                    <div className="space-y-6">
                      {resumeData.experience.map((exp, index) => (
                        <div key={index}>
                          <h3 className="text-lg font-normal text-gray-900">
                            {exp.position}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {exp.company} • {formatDate(exp.start_date)} -{" "}
                            {exp.end_date
                              ? formatDate(exp.end_date)
                              : "Present"}
                          </p>
                          <p className=" leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Education Section */}
                {resumeData.education && resumeData.education.length > 0 && (
                  <section>
                    <h2 className="text-xl font-light text-gray-800 mb-4 uppercase">
                      Education
                    </h2>
                    <div className="space-y-4">
                      {resumeData.education.map((edu, index) => (
                        <div key={index}>
                          <h3 className="text-lg font-normal text-gray-900">
                            {edu.degree} in {edu.field_of_study}
                          </h3>
                          <p className="text-gray-600">
                            {edu.school} • {formatDate(edu.start_date)} -{" "}
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
                    <h2 className="text-xl font-light text-gray-800 mb-4 uppercase">
                      Skills
                    </h2>
                    <p className="">
                      {resumeData.skills.map((skill) => skill.name).join(", ")}
                    </p>
                  </section>
                )}

                {/* Projects Section */}
                {resumeData.projects && resumeData.projects.length > 0 && (
                  <section>
                    <h2 className="text-xl font-light text-gray-800 mb-4 uppercase">
                      Projects
                    </h2>
                    <div className="space-y-6">
                      {resumeData.projects.map((project, index) => (
                        <div key={index}>
                          <h3 className="text-lg font-normal text-gray-900">
                            {project.title}
                          </h3>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 mb-2 inline-block"
                            >
                              Link
                            </a>
                          )}
                          <p className=" leading-relaxed mb-2">
                            {project.description}
                          </p>
                          {project.technologies && (
                            <p className="text-gray-600 text-sm">
                              {project.technologies}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </>
          )}

          {selectedTemplate === 4 && (
            <>
              <div className="flex">
                <div className="w-1/3 bg-purple-100 p-6">
                  <h1 className="text-2xl font-bold text-purple-800 mb-4">
                    {resumeData.full_name}
                  </h1>
                  <div className="space-y-2 text-sm text-purple-700 mb-6">
                    {resumeData.location && (
                      <div>
                        <FaMapMarkerAlt className="inline mr-1" />
                        {resumeData.location}
                      </div>
                    )}
                    {resumeData.phone && (
                      <div>
                        <FaPhone className="inline mr-1" />
                        {resumeData.phone}
                      </div>
                    )}
                    {resumeData.contact_email && (
                      <div>
                        <FaEnvelope className="inline mr-1" />
                        {resumeData.contact_email}
                      </div>
                    )}
                    {resumeData.linkedin_url && (
                      <div>
                        <FaLinkedin className="inline mr-1" />
                        <a
                          href={resumeData.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          LinkedIn
                        </a>
                      </div>
                    )}
                    {resumeData.website_url && (
                      <div>
                        <FaGlobe className="inline mr-1" />
                        <a
                          href={resumeData.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>
                  {resumeData.skills && resumeData.skills.length > 0 && (
                    <div>
                      <h3 className="font-bold text-purple-800 mb-2">Skills</h3>
                      <ul className="text-sm text-purple-700 space-y-1">
                        {resumeData.skills.map((skill) => (
                          <li key={skill.id}>• {skill.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="w-2/3 p-6">
                  {/* Summary Section */}
                  {resumeData.summary && (
                    <section className="mb-6">
                      <h2 className="text-xl font-bold mb-3">Summary</h2>
                      <p className=" leading-relaxed">{resumeData.summary}</p>
                    </section>
                  )}

                  {/* Experience Section */}
                  {resumeData.experience &&
                    resumeData.experience.length > 0 && (
                      <section className="mb-6">
                        <h2 className="text-xl font-bold mb-3">Experience</h2>
                        <div className="space-y-4">
                          {resumeData.experience.map((exp, index) => (
                            <div key={index}>
                              <h3 className="text-lg font-semibold">
                                {exp.position}
                              </h3>
                              <p className="text-purple-600 font-medium mb-1">
                                {exp.company}
                              </p>
                              <p className="text-gray-600 text-sm mb-2">
                                {formatDate(exp.start_date)} -{" "}
                                {exp.end_date
                                  ? formatDate(exp.end_date)
                                  : "Present"}
                              </p>
                              <p className=" leading-relaxed">
                                {exp.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                  {/* Education Section */}
                  {resumeData.education && resumeData.education.length > 0 && (
                    <section className="mb-6">
                      <h2 className="text-xl font-bold mb-3">Education</h2>
                      <div className="space-y-3">
                        {resumeData.education.map((edu, index) => (
                          <div key={index}>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {edu.degree} in {edu.field_of_study}
                            </h3>
                            <p className="text-gray-600">
                              {edu.school} • {formatDate(edu.start_date)} -{" "}
                              {formatDate(edu.graduation_date)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Projects Section */}
                  {resumeData.projects && resumeData.projects.length > 0 && (
                    <section>
                      <h2 className="text-xl font-bold mb-3">Projects</h2>
                      <div className="space-y-4">
                        {resumeData.projects.map((project, index) => (
                          <div key={index}>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {project.title}
                            </h3>
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link-text mb-1 inline-block"
                              >
                                View Project
                              </a>
                            )}
                            <p className=" leading-relaxed mb-1">
                              {project.description}
                            </p>
                            {project.technologies && (
                              <p className="text-sm">
                                Technologies: {project.technologies}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </>
          )}

          {resumeData.summary && (
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b-2 pb-2">
                Professional Summary
              </h2>
              <p className="leading-relaxed">{resumeData.summary}</p>
            </section>
          )}

          {/* {resumeData.experience && resumeData.experience.length > 0 && (
            <section>
              <h2
                className="text-2xl font-bold mb-4 border-b-2 pb-2"
                style={{ borderColor: "black" }}
              >
                Work Experience
              </h2>
              <div className="space-y-6">
                {resumeData.experience.map((exp, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-semibold">{exp.position}</h3>
                    <p className="font-medium mb-2 link-text">{exp.company}</p>
                    <p className="mb-3">
                      {formatDate(exp.start_date)} -{" "}
                      {exp.end_date ? formatDate(exp.end_date) : "Present"}
                    </p>
                    <p className=" leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          Education Section
          {resumeData.education && resumeData.education.length > 0 && (
            <section>
              <h2
                className="text-2xl font-bold mb-4 border-b-2 pb-2"
                style={{ borderColor: "black" }}
              >
                Education
              </h2>
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="text-xl font-semibold">
                      {edu.degree} in {edu.field_of_study}
                    </h3>
                    <p className="font-medium mb-1">{edu.school}</p>
                    <p className="">
                      {formatDate(edu.start_date)} -{" "}
                      {formatDate(edu.graduation_date)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          Skills Section
          {resumeData.skills && resumeData.skills.length > 0 && (
            <section>
              <h2
                className="text-2xl font-bold mb-4 border-b-2 pb-2"
                style={{ borderColor: "black" }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-4">
                {resumeData.skills.map((skill) => skill.name).join(", ")}
              </div>
            </section>
          )}

          Projects Section
          {resumeData.projects && resumeData.projects.length > 0 && (
            <section>
              <h2
                className="text-2xl font-bold mb-4 border-b-2 pb-2"
                style={{ borderColor: "black" }}
              >
                Projects
              </h2>
              <div className="space-y-6">
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-text mb-2 inline-block"
                      >
                        View Project →
                      </a>
                    )}
                    <p className=" leading-relaxed mb-2">
                      {project.description}
                    </p>
                    {project.technologies && (
                      <p className="text-sm">
                        <strong>Technologies:</strong> {project.technologies}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )} */}
        </div>
      </div>
    </AppLayout>
  );
}

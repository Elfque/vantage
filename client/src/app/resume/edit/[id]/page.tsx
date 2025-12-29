"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { getAPIRequest, putAPIRequest } from "@/utils/requests";
import { showErrorToast, showSuccessToast } from "@/utils/ToasterProps";
import Skills from "@/components/resumes/Skills";

export default function EditResume() {
  const { data: session } = useSession();
  const router = useParams();
  const navigate = useRouter();
  const resumeId = router.id as string;

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resumeId) {
      fetchResume();
    }
  }, [resumeId]);

  const fetchResume = async () => {
    try {
      const data = await getAPIRequest(`/resumes/${resumeId}`);
      const resume = data;
      setResumeData(resume);

      setSkills(resume.skills || []);
      setProjects(resume.projects || []);
      setEducation(resume.education || []);
      setExperience(resume.experience || []);
    } catch (error) {
      console.error("Error fetching resume:", error);
      showErrorToast("Failed to load resume");
      navigate.push("/resumes");
    } finally {
      setLoading(false);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,

      [field]: value,
    }));
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

    putAPIRequest(`/resumes/${resumeId}`, {
      ...resumeData,
      title: resumeData.full_name + " - Resume",
      education: newEdu,
      experience: newExp,
      projects: newPro,
      skills: newSkills,
    })
      .then(() => {
        showSuccessToast("Resume updated successfully!");
        navigate.push("/resumes");
      })
      .catch((err) => {
        console.error("Error updating resume:", err);
        showErrorToast("Error updating resume");
      });
  };

  const handleExport = () => {
    // TODO: Implement PDF export
    alert("Export functionality coming soon!");
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

  return (
    <AppLayout>
      <div className="">
        <Header title="Edit Resume" />

        <header className="shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-end items-center py-4">
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleExport}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  Export PDF
                </button>
                <button
                  onClick={handleShare}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-2">
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
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeSection === "personal" && (
                <PersonalInfo
                  resumeData={resumeData}
                  updatePersonalInfo={updatePersonalInfo}
                />
              )}

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

              {activeSection === "experience" && (
                <Experiences
                  experience={experience}
                  setExperience={setExperience}
                />
              )}

              {activeSection === "education" && (
                <Education education={education} setEducation={setEducation} />
              )}

              {activeSection === "skills" && (
                <Skills skills={skills} setSkills={setSkills} />
              )}

              {activeSection === "projects" && (
                <Projects projects={projects} setProjects={setProjects} />
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

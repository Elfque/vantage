"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { getAPIRequest, deleteAPIRequest } from "@/utils/requests";
import { showErrorToast, showSuccessToast } from "@/utils/ToasterProps";
import { FaEdit, FaDownload, FaTrash } from "react-icons/fa";
import { ResumeDataResponse } from "@/types/resume";
import Template1 from "@/components/resume-templates/Template1";
import Template2 from "@/components/resume-templates/Template2";
import Template3 from "@/components/resume-templates/Template3";
import Template4 from "@/components/resume-templates/Template4";
import BottomTemplate from "@/components/resume-templates/BottomTemplate";
import { pdf } from "@react-pdf/renderer";
import Template1PDF from "@/components/renderer-templates/Renderer";
import DeleteModal from "@/components/resumes/DeleteModal";

export default function ViewResume() {
  const router = useParams();
  const navigate = useRouter();
  const resumeId = router.id as string;

  const [resumeData, setResumeData] = useState<ResumeDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
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

  async function handleDownload() {
    setDownloading(true);

    const blob = await pdf(
      <Template1PDF
        resumeData={resumeData as ResumeDataResponse}
        template={selectedTemplate}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resumeData?.full_name}.pdf`;
    a.click();

    URL.revokeObjectURL(url);
    setDownloading(false);
  }

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteAPIRequest(`/resumes/${resumeId}`);
      showSuccessToast("Resume deleted successfully");
      navigate.push("/resumes");
      setDeleting(false);
      setShowDeleteModal(false);
    } catch (error) {
      setDeleting(false);
      console.error("Error deleting resume:", error);
      showErrorToast("Failed to delete resume");
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

  if (!resumeData) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Resume not found</p>
        </div>
      </AppLayout>
    );
  }

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
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FaTrash />
              Delete
            </button>
          </div>
        </div>

        <div
          ref={resumeRef}
          className="font-serif space-y-8 pb-10"
          style={{
            backgroundColor: "white",
            color: "black",
          }}
        >
          {selectedTemplate === 1 && <Template1 resumeData={resumeData} />}
          {selectedTemplate === 2 && <Template2 resumeData={resumeData} />}
          {selectedTemplate === 3 && <Template3 resumeData={resumeData} />}
          {selectedTemplate === 4 && <Template4 resumeData={resumeData} />}

          <BottomTemplate resumeData={resumeData} />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal
          setShowDeleteModal={setShowDeleteModal}
          confirmDelete={confirmDelete}
          deleting={deleting}
        />
      )}
    </AppLayout>
  );
}

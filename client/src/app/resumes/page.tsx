"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { getAPIRequest, deleteAPIRequest } from "@/utils/requests";
import { showErrorToast, showSuccessToast } from "@/utils/ToasterProps";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { ResumeData, ResumeResponseData } from "@/types/resume";

export default function ResumesPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeResponseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    getAPIRequest("resumes")
      .then(({ data }) => {
        setResumes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
        showErrorToast("Failed to load resumes");
        setLoading(false);
      });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      await deleteAPIRequest(`/resumes/${id}`);
      setResumes(resumes.filter((resume) => resume.id !== id));
      showSuccessToast("Resume deleted successfully");
    } catch (error) {
      console.error("Error deleting resume:", error);
      showErrorToast("Failed to delete resume");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/resume/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/resume/view/${id}`);
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
      <div className="space-y-6">
        <Header title="My Resumes" />

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-4">
          <div className="flex justify-end items-center">
            <button
              onClick={() => router.push("/resume/new")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FaPlus />
              Create New Resume
            </button>
          </div>

          {resumes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <FaPlus className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No resumes yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Create your first resume to get started.
              </p>
              <button
                onClick={() => router.push("/resume/new")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Create Resume
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {resume.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(resume.id)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View Resume"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEdit(resume.id)}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Edit Resume"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(resume.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete Resume"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <p>
                      Created:{" "}
                      {new Date(resume.created_at).toLocaleDateString()}
                    </p>
                    {/* <p>
                    Last updated:{" "}
                    {new Date(resume.updated_at).toLocaleDateString()}
                  </p> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

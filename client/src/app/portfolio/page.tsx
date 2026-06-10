"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { getAPIRequest, deleteAPIRequest } from "@/utils/requests";
import { showErrorToast, showSuccessToast } from "@/utils/ToasterProps";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Link from "next/link";
import DeleteModal from "@/components/resumes/DeleteModal";
import { formatDate } from "@/utils/functions";

interface PortfolioResponseData {
  id: string;
  slug: string;
  title: string;
  fullName: string;
  createdAt: string;
}

export default function PortfoliosPage() {
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<PortfolioResponseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    getAPIRequest("/portfolio")
      .then(({ data }) => {
        setPortfolios(data);
      })
      .catch((err) => {
        showErrorToast(
          err.response.data.message ?? "Failed to load portfolios",
        );
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: string) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteAPIRequest(`/portfolio/${selectedId}`).then(() => {
        showSuccessToast("Portfolio deleted successfully");
        fetchPortfolios();
        setSelectedId("");
        setShowDeleteModal(false);
      });
    } catch (error) {
      showErrorToast("Failed to delete portfolio");
    } finally {
      setDeleting(false);
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <Header title="My Portfolios" />

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-4">
          <div className="flex justify-end items-center">
            <button
              onClick={() => router.push("/portfolio/new")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FaPlus />
              Create New Portfolio
            </button>
          </div>

          {portfolios.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <FaPlus className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No portfolios yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Create your first portfolio to get started.
              </p>
              <button
                onClick={() => router.push("/portfolio/new")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Create Portfolio
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {portfolios.map((portfolio) => (
                <div
                  key={portfolio.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate w-[calc(100%-80px)]">
                      {portfolio.title}
                    </h3>

                    <div className="flex gap-2">
                      <Link
                        href={`/portfolio/${portfolio.id}`}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="View Portfolio"
                      >
                        <FaEye />
                      </Link>

                      <Link
                        href={`/portfolio/${portfolio.id}/edit`}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Edit Portfolio"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(portfolio.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete Portfolio"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {portfolio.fullName}
                  </p>

                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <p>
                      Created:{" "}
                      {new Date(portfolio.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
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

"use client";

import AppLayout from "@/components/layout/AppLayout";
import Header from "@/components/layout/Header";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log(session);

  const handleCreateResume = () => {
    router.push("/resume/new");
  };

  const handleCreatePortfolio = () => {
    router.push("/portfolio/new");
  };

  return (
    <AppLayout>
      <div className="">
        <Header />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Create Your Professional Documents
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Build stunning resumes and portfolios that showcase your skills
                and experience
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {/* Resume Card */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <svg
                        className="h-8 w-8 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Resume
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Create a professional resume to land your dream job
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={handleCreateResume}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Create New Resume
                    </button>
                  </div>
                </div>
              </div>

              {/* Portfolio Card */}
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <svg
                        className="h-8 w-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Portfolio
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Showcase your work and projects in a beautiful portfolio
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={handleCreatePortfolio}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Create New Portfolio
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Documents Section */}
            <div className="mt-12">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Recent Documents
              </h3>
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  <li>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            No documents yet
                          </p>
                          <p className="ml-2 shrink-0 text-sm text-gray-500 dark:text-gray-400">
                            Create your first resume or portfolio
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
}

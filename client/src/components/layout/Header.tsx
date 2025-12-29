import { useSession, signOut } from "next-auth/react";

type headerProps = {
  title?: string;
};

const Header = ({ title }: headerProps) => {
  const { data: session } = useSession();

  return (
    <header className="shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-300">
              Welcome, {session?.user?.name?.split(" ")[0] || "User"}
            </span>
            <button
              onClick={() => signOut()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

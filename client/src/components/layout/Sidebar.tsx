import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "@/constants/sidebar";

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  menuItems: MenuItem[];
  className?: string;
}

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div
      className={`bg-gray-900 text-white w-full min-h-screen p-4 sticky top-0 h-100dvh`}
    >
      <div className="mb-8">
        <h2 className="text-xl font-bold">Resume Builder</h2>
      </div>
      <nav className="space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {item.Icon && (
              <span className="mr-3">
                <item.Icon />
              </span>
            )}

            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

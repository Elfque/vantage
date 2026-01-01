import React, { useState, useEffect } from "react";
import { getAPIRequest } from "@/utils/requests";
import { FaMousePointer, FaCheck, FaTimes, FaEye, FaEdit } from "react-icons/fa";

interface Item {
  id: string;
  title: string;
  full_name?: string;
  created_at: string;
}

interface AttachmentSelectorProps {
  type: "resumes" | "portfolio";
  selectedId: string | null;
  onSelectionChange: (id: string | null) => void;
  label: string;
}

const AttachmentSelector: React.FC<AttachmentSelectorProps> = ({
  type,
  selectedId,
  onSelectionChange,
  label,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSelector, setShowSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await getAPIRequest(type);
      setItems(data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = (itemId: string) => {
    onSelectionChange(itemId);
  };

  const handleRemove = () => {
    onSelectionChange(null);
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.full_name &&
        item.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedItem = selectedId
    ? items.find((item) => item.id === selectedId)
    : null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {label}
        </h3>
        <button
          onClick={() => setShowSelector(!showSelector)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-2"
        >
          <FaMousePointer className="text-xs" />
          {selectedId ? "Change" : "Select"}{" "}
          {type === "resumes" ? "Resume" : "Portfolio"}
        </button>
      </div>

      {/* Selected Item */}
      {selectedItem && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Attached {type === "resumes" ? "Resume" : "Portfolio"}:
          </h4>
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedItem.title}
                </p>
                {selectedItem.full_name && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedItem.full_name}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={
                  type === "resumes"
                    ? `/resume/${selectedItem.id}`
                    : `/portfolio/${selectedItem.id}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 p-1"
                title={`View ${type === "resumes" ? "Resume" : "Portfolio"}`}
              >
                <FaEye />
              </a>
              <a
                href={
                  type === "resumes"
                    ? `/resume/${selectedItem.id}/edit`
                    : `/portfolio/${selectedItem.id}/edit`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 p-1"
                title={`Edit ${type === "resumes" ? "Resume" : "Portfolio"}`}
              >
                <FaEdit />
              </a>
              <button
                onClick={handleRemove}
                className="text-red-600 hover:text-red-800 p-1"
                title={`Remove ${type === "resumes" ? "Resume" : "Portfolio"}`}
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Selector */}
      {showSelector && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
          <div className="mb-4">
            <input
              type="text"
              placeholder={`Search ${type}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-2 hide-scrollbar">
              {filteredItems
                .filter((item) => item.id !== selectedId)
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                    onClick={() => handleAdd(item.id)}
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </p>
                      {item.full_name && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {item.full_name}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Created:{" "}
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaCheck />
                    </button>
                  </div>
                ))}
              {filteredItems.filter((item) => item.id !== selectedId).length ===
                0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No {type} available to attach
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttachmentSelector;

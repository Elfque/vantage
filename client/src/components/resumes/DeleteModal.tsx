type DeleteModalProps = {
  setShowDeleteModal: (show: boolean) => void;
  confirmDelete: () => void;
  deleting?: boolean;
  isPortfolio?: boolean;
};

const DeleteModal = ({
  setShowDeleteModal,
  confirmDelete,
  deleting = false,
  isPortfolio,
}: DeleteModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Delete {isPortfolio ? "Portfolio" : "Resume"}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Are you sure you want to delete this{" "}
          {isPortfolio ? "portfolio" : "resume"}? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {deleting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

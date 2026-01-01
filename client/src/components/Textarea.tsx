import React from "react";

interface TextareaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  rows?: number;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  name?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  rows = 4,
  className = "",
  onFocus,
  onBlur,
  name,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200 ease-in-out resize-vertical ${
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
        }`}
        onFocus={onFocus}
        onBlur={onBlur}
        name={name ?? ""}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Textarea;

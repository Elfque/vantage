import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
  name?: string;
  required?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  className = "",
  name,
  required,
  onBlur,
  onFocus,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          htmlFor={name ?? ""}
        >
          {label}
        </label>
      )}
      <input
        type={type ?? "text"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200 ease-in-out ${
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
        }`}
        name={name}
        required={required}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;

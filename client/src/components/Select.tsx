import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  className?: string;
  name?: string;
  required?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

const Select: React.FC<SelectProps> = ({
  label,
  placeholder,
  options,
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
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-200 ease-in-out appearance-none bg-no-repeat bg-right bg-size-[1.5em_1.5em] ${
          error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
        }}
        name={name}
        required={required}
        onBlur={onBlur}
        onFocus={onFocus}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Select;

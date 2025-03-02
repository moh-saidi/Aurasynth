import React from "react";

interface InputFieldProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateClick?: () => void; // Handler for the Generate button
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  onGenerateClick,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative w-full max-w-md">
        {/* Input Field */}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full p-2 pl-4 pr-24 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />

        {/* Generate Button */}
        <button
          type="button"
          onClick={onGenerateClick}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Generate
        </button>
      </div>
    </div>
  );
};

export default InputField;
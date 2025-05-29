import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  code: string;
  language: string;
  onChange: (val: string) => void;
  onLanguageChange: (lang: string) => void;
  onClose: () => void;
}

const CodePopup: React.FC<Props> = ({
  code,
  language,
  onChange,
  onLanguageChange,
  onClose,
}) => {
  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-white dark:bg-gray-800 border rounded-lg shadow-md mt-4">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Code Snippet Editor
        </span>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>
      </div>

      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value)}
        className="mb-2 p-1 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="typescript">TypeScript</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
        <option value="csharp">C#</option>
        <option value="ruby">Ruby</option>
        <option value="go">Go</option>
        <option value="rust">Rust</option>
      </select>

      <textarea
        rows={6}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your code here..."
        className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white mb-2"
      />

      <div className="border border-gray-300 dark:border-gray-600 rounded">
        <SyntaxHighlighter language={language} style={darcula}>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodePopup;

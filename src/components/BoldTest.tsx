import React, { useEffect } from "react";
import { formatLLMResponse } from "../utils/textFormatter";
import { debugTextParsing } from "../utils/debugFormatter";

const BoldTest: React.FC = () => {
  const testTexts = [
    "This is **bold text** in the middle.",
    "**Bold at the start** and regular text.",
    "Regular text and **bold at the end**",
    "Multiple **bold** words **here** and **there**.",
    "**Are you curious about its mathematical properties?**",
    "This has * bullet points and **bold text** together.",
    "Text with `code` and **bold** and (parenthetical) content.",
  ];

  useEffect(() => {
    // Debug the first test case
    console.log("Debugging bold text parsing:");
    debugTextParsing(testTexts[0]);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Bold Formatting Test
      </h1>

      <div className="bg-yellow-100 p-4 rounded-lg mb-4">
        <p className="text-sm text-yellow-800">
          <strong>Debug Info:</strong> Check the browser console for parsing
          details. Bold text should appear in{" "}
          <span className="font-bold text-blue-600">blue and bold</span>.
        </p>
      </div>

      {testTexts.map((text, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500 mb-2">Test {index + 1}:</div>
          <div className="text-gray-600 text-xs mb-2 font-mono bg-gray-100 p-2 rounded">
            {text}
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            {formatLLMResponse(text)}
          </div>
          <button
            onClick={() => debugTextParsing(text)}
            className="mt-2 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          >
            Debug This Text
          </button>
        </div>
      ))}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Expected Results:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>
            • Text between **asterisks** should be{" "}
            <strong className="text-blue-600">bold and blue</strong>
          </li>
          <li>
            • Questions ending with ? should be{" "}
            <strong className="text-purple-600">bold and purple</strong>
          </li>
          <li>
            • Bullet points should have <span className="text-blue-500">•</span>{" "}
            blue bullets
          </li>
          <li>
            • Code should have{" "}
            <code className="bg-gray-100 px-1 rounded">gray background</code>
          </li>
          <li>
            • Parenthetical text should be{" "}
            <em className="text-gray-600">(italic and gray)</em>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BoldTest;

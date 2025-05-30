import React, { useEffect } from "react";
import { formatLLMResponse } from "../utils/textFormatter";
import { debugTextParsing } from "../utils/debugFormatter";

const OriginalTextTest: React.FC = () => {
  const originalText =
    "Okay. Is there anything specific you'd like to know or discuss regarding the number 123? For example: * **Are you curious about its mathematical properties?** (e.g., is it prime, composite, divisible by certain numbers?) * **Do you want to know if it has any special significance in a particular context?** (e.g., a code, a year, a street address) * **Are you just looking for random facts about it?** Let me know what you have in mind.";

  useEffect(() => {
    console.log("=== DEBUGGING ORIGINAL TEXT ===");
    debugTextParsing(originalText);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Original Text Debug Test
      </h1>

      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
        <h2 className="text-lg font-semibold text-red-800 mb-2">
          Original Problematic Text:
        </h2>
        <div className="text-sm text-gray-600 font-mono bg-white p-3 rounded border overflow-x-auto">
          {originalText}
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h2 className="text-lg font-semibold text-green-800 mb-2">
          Formatted Result:
        </h2>
        <div className="bg-white p-4 rounded border">
          {formatLLMResponse(originalText)}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Analysis:</h2>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Expected bold sections:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>"Are you curious about its mathematical properties?"</li>
            <li>
              "Do you want to know if it has any special significance in a
              particular context?"
            </li>
            <li>"Are you just looking for random facts about it?"</li>
          </ul>
          <p className="mt-3">
            <strong>Check console for detailed parsing information.</strong>
          </p>
        </div>
      </div>

      <button
        onClick={() => debugTextParsing(originalText)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Re-run Debug Analysis
      </button>
    </div>
  );
};

export default OriginalTextTest;

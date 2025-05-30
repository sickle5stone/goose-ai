import React, { useState } from "react";
import { formatLLMResponse } from "../utils/textFormatter";
import { debugTextParsing } from "../utils/debugFormatter";
import Typewriter from "../Typewriter";

const FormattingTestPage: React.FC = () => {
  const [showTypewriter, setShowTypewriter] = useState(false);

  const originalText =
    "Okay. Is there anything specific you'd like to know or discuss regarding the number 123? For example: * **Are you curious about its mathematical properties?** (e.g., is it prime, composite, divisible by certain numbers?) * **Do you want to know if it has any special significance in a particular context?** (e.g., a code, a year, a street address) * **Are you just looking for random facts about it?** Let me know what you have in mind.";

  const simpleTests = [
    "This is **bold text** in the middle.",
    "**Bold at the start** and regular text.",
    "Regular text and **bold at the end**",
    "Multiple **bold** words **here** and **there**.",
    "**Are you curious about its mathematical properties?**",
    "Text with `code` and **bold** and (parenthetical) content.",
  ];

  React.useEffect(() => {
    console.log("=== FORMATTING TEST PAGE LOADED ===");
    debugTextParsing(originalText);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            LLM Text Formatting Test
          </h1>
          <p className="text-gray-600">
            Testing bold text, bullet points, and other formatting features
          </p>
        </div>

        {/* Status Indicator */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-800 font-medium">
              Formatting System Active
            </span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Check browser console for detailed parsing information
          </p>
        </div>

        {/* Original Problematic Text */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Original Problematic Text
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Raw Text:
              </h3>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono text-gray-700 overflow-x-auto">
                {originalText}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Formatted Result:
              </h3>
              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded">
                {formatLLMResponse(originalText)}
              </div>
            </div>
            <button
              onClick={() => debugTextParsing(originalText)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
            >
              Debug This Text
            </button>
          </div>
        </div>

        {/* Simple Test Cases */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Simple Test Cases
          </h2>
          <div className="grid gap-4">
            {simpleTests.map((text, index) => (
              <div key={index} className="border border-gray-200 rounded p-4">
                <div className="text-xs text-gray-500 mb-2">
                  Test {index + 1}:
                </div>
                <div className="text-xs font-mono bg-gray-100 p-2 rounded mb-2 text-gray-600">
                  {text}
                </div>
                <div className="border-l-4 border-green-500 pl-3">
                  {formatLLMResponse(text)}
                </div>
                <button
                  onClick={() => debugTextParsing(text)}
                  className="mt-2 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                >
                  Debug
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Typewriter Test */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Typewriter Effect Test
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => setShowTypewriter(!showTypewriter)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
            >
              {showTypewriter ? "Reset" : "Start"} Typewriter Test
            </button>
            {showTypewriter && (
              <div className="border-l-4 border-purple-500 pl-4 bg-purple-50 p-4 rounded">
                <Typewriter
                  text={originalText}
                  delay={30}
                  onUpdate={() => {}}
                />
              </div>
            )}
          </div>
        </div>

        {/* Expected Results Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            Expected Results
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-blue-700 mb-2">
                Formatting Types:
              </h3>
              <ul className="space-y-1 text-blue-600">
                <li>
                  • **Bold text** →{" "}
                  <span className="font-bold text-blue-600">Bold and blue</span>
                </li>
                <li>
                  • **Questions?** →{" "}
                  <span className="font-bold text-purple-600">
                    Bold and purple
                  </span>
                </li>
                <li>
                  • * Bullet points → <span className="text-blue-500">•</span>{" "}
                  Blue bullets
                </li>
                <li>
                  • (Parenthetical) →{" "}
                  <em className="text-gray-600">(italic gray)</em>
                </li>
                <li>
                  • `Code` →{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    gray background
                  </code>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-700 mb-2">Key Features:</h3>
              <ul className="space-y-1 text-blue-600">
                <li>• Nested formatting in bullets</li>
                <li>• Question detection (ends with ?)</li>
                <li>• Proper parsing order</li>
                <li>• Typewriter compatibility</li>
                <li>• Debug capabilities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormattingTestPage;

import {
  TextFormatterOptions,
  formatLLMResponse,
} from "../utils/textFormatter";

import React from "react";

const FormattingDemo: React.FC = () => {
  const sampleText =
    "Okay. Is there anything specific you'd like to know or discuss regarding the number 123? For example: * **Are you curious about its mathematical properties?** (e.g., is it prime, composite, divisible by certain numbers?) * **Do you want to know if it has any special significance in a particular context?** (e.g., a code, a year, a street address) * **Are you just looking for random facts about it?** Let me know what you have in mind.";

  const codeExampleText =
    "Here's how you can use the `formatLLMResponse` function: * Import it from the utility file * Pass your text string * Optionally provide custom styling options (like `bulletColor` or `boldColor`)";

  const customOptions: TextFormatterOptions = {
    bulletColor: "text-green-500",
    boldColor: "text-red-600",
    questionColor: "text-purple-700",
    parentheticalColor: "text-gray-500",
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        LLM Text Formatting Demo
      </h1>

      <div className="space-y-6">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Default Formatting
          </h2>
          <div className="border-l-4 border-blue-500 pl-4 bg-gray-50 p-4 rounded">
            {formatLLMResponse(sampleText)}
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Custom Color Scheme
          </h2>
          <div className="border-l-4 border-green-500 pl-4 bg-gray-50 p-4 rounded">
            {formatLLMResponse(sampleText, customOptions)}
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Code Examples
          </h2>
          <div className="border-l-4 border-purple-500 pl-4 bg-gray-50 p-4 rounded">
            {formatLLMResponse(codeExampleText)}
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Formatting Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-600">
                Supported Formats:
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• **Bold text** → Bold styling</li>
                <li>• **Questions?** → Special question styling</li>
                <li>• * Bullet points → Formatted lists</li>
                <li>• (Parenthetical text) → Italic gray text</li>
                <li>• `Code snippets` → Monospace with background</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-600">
                Customizable Options:
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• bulletColor</li>
                <li>• boldColor</li>
                <li>• questionColor</li>
                <li>• parentheticalColor</li>
                <li>• emphasisColor</li>
                <li>• codeBackgroundColor</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FormattingDemo;

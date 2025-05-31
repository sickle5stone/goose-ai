import type { FormattedSegment, TextFormatterOptions } from "../types";

import React from "react";

export class TextFormatter {
  private options: TextFormatterOptions;

  constructor(options: TextFormatterOptions = {}) {
    this.options = {
      bulletColor: "text-blue-500",
      boldColor: "text-blue-600",
      parentheticalColor: "text-gray-600",
      questionColor: "text-orange-600",
      emphasisColor: "text-green-600",
      codeBackgroundColor: "bg-gray-100",
      ...options,
    };
  }

  parseTextToSegments(text: string): FormattedSegment[] {
    const segments: FormattedSegment[] = [];
    let currentSegment = "";
    let segmentType: FormattedSegment["type"] = "text";
    let i = 0;
    let segmentCounter = 0;

    while (i < text.length) {
      const char = text[i];
      const nextChar = text[i + 1];
      const prevChar = text[i - 1];

      // Handle bold text with ** (check this BEFORE bullet points)
      if (char === "*" && nextChar === "*") {
        if (currentSegment.trim()) {
          segments.push({
            type: segmentType,
            content: currentSegment,
            key: `segment-${segmentCounter++}`,
          });
          currentSegment = "";
        }

        let j = i + 2;
        let boldContent = "";
        while (j < text.length) {
          if (j < text.length - 1 && text[j] === "*" && text[j + 1] === "*") {
            break;
          }
          boldContent += text[j];
          j++;
        }

        if (j < text.length && text[j] === "*" && text[j + 1] === "*") {
          // Check if this is a question (ends with ?)
          const isQuestion = boldContent.trim().endsWith("?");
          segments.push({
            type: isQuestion ? "question" : "bold",
            content: boldContent,
            key: `segment-${segmentCounter++}`,
          });
          i = j + 2;
          segmentType = "text";
          continue;
        } else {
          // If no closing **, treat as regular text
          currentSegment += "**" + boldContent;
          i = j;
          continue;
        }
      }

      // Handle code blocks with backticks
      if (char === "`") {
        if (currentSegment.trim()) {
          segments.push({
            type: segmentType,
            content: currentSegment,
            key: `segment-${segmentCounter++}`,
          });
          currentSegment = "";
        }

        let j = i + 1;
        let codeContent = "";
        while (j < text.length && text[j] !== "`") {
          codeContent += text[j];
          j++;
        }

        if (j < text.length) {
          segments.push({
            type: "code",
            content: codeContent,
            key: `segment-${segmentCounter++}`,
          });
          i = j + 1;
          segmentType = "text";
          continue;
        }
      }

      // Handle bullet points with * (only single * followed by space, not **)
      if (
        char === "*" &&
        nextChar === " " &&
        (i === 0 || prevChar === " " || prevChar === "\n")
      ) {
        if (currentSegment.trim()) {
          segments.push({
            type: segmentType,
            content: currentSegment,
            key: `segment-${segmentCounter++}`,
          });
          currentSegment = "";
        }

        let j = i + 2; // Skip "* "
        let bulletContent = "";
        while (j < text.length) {
          // Stop at next bullet point or end of text
          if (
            text[j] === "*" &&
            text[j + 1] === " " &&
            (text[j - 1] === " " || text[j - 1] === "\n")
          ) {
            break;
          }
          bulletContent += text[j];
          j++;
        }

        // Parse the bullet content for nested formatting
        const bulletSegments = this.parseTextToSegments(bulletContent.trim());

        // Create a bullet container with nested segments
        segments.push({
          type: "bullet",
          content: bulletContent.trim(),
          key: `segment-${segmentCounter++}`,
          children: bulletSegments,
        });

        i = j;
        segmentType = "text";
        continue;
      }

      // Handle parenthetical text
      if (char === "(") {
        if (currentSegment.trim()) {
          segments.push({
            type: segmentType,
            content: currentSegment,
            key: `segment-${segmentCounter++}`,
          });
          currentSegment = "";
        }

        let j = i + 1;
        let parentheticalContent = "(";
        let parenCount = 1;
        while (j < text.length && parenCount > 0) {
          parentheticalContent += text[j];
          if (text[j] === "(") parenCount++;
          if (text[j] === ")") parenCount--;
          j++;
        }

        segments.push({
          type: "parenthetical",
          content: parentheticalContent,
          key: `segment-${segmentCounter++}`,
        });
        i = j;
        segmentType = "text";
        continue;
      }

      currentSegment += char;
      i++;
    }

    // Add remaining segment
    if (currentSegment.trim()) {
      segments.push({
        type: segmentType,
        content: currentSegment,
        key: `segment-${segmentCounter++}`,
      });
    }

    return segments;
  }

  renderSegment = (segment: FormattedSegment): React.ReactElement => {
    switch (segment.type) {
      case "bold":
        return (
          <span
            key={segment.key}
            className={`font-bold ${this.options.boldColor}`}
          >
            {segment.content}
          </span>
        );
      case "question":
        return (
          <span
            key={segment.key}
            className={`font-bold ${this.options.questionColor}`}
          >
            {segment.content}
          </span>
        );
      case "bullet":
        return (
          <div key={segment.key} className="flex items-start gap-2 my-1">
            <span className={`${this.options.bulletColor} font-bold mt-0.5`}>
              •
            </span>
            <span className="flex-1">
              {segment.children && segment.children.length > 0
                ? segment.children.map(this.renderSegment)
                : segment.content}
            </span>
          </div>
        );
      case "parenthetical":
        return (
          <span
            key={segment.key}
            className={`${this.options.parentheticalColor} italic`}
          >
            {segment.content}
          </span>
        );
      case "code":
        return (
          <code
            key={segment.key}
            className={`${this.options.codeBackgroundColor} px-1 py-0.5 rounded text-sm font-mono`}
          >
            {segment.content}
          </code>
        );
      case "emphasis":
        return (
          <em
            key={segment.key}
            className={`${this.options.emphasisColor} italic`}
          >
            {segment.content}
          </em>
        );
      case "text":
      default:
        return <span key={segment.key}>{segment.content}</span>;
    }
  };

  formatText(text: string): React.ReactElement {
    const segments = this.parseTextToSegments(text);
    return <div className="space-y-1">{segments.map(this.renderSegment)}</div>;
  }
}

// Default formatter instance
export const defaultTextFormatter = new TextFormatter();

// Utility function for quick formatting
export const formatLLMResponse = (
  text: string,
  options?: TextFormatterOptions
): React.ReactElement => {
  const formatter = options ? new TextFormatter(options) : defaultTextFormatter;
  return formatter.formatText(text);
};

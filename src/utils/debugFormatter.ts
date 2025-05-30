import { TextFormatter } from "./textFormatter";

export const debugTextParsing = (text: string) => {
  const formatter = new TextFormatter();
  const segments = formatter.parseTextToSegments(text);

  console.log("=== DEBUG TEXT PARSING ===");
  console.log("Input text:", text);
  console.log("Parsed segments:");

  segments.forEach((segment, index) => {
    console.log(
      `${index + 1}. Type: ${segment.type}, Content: "${segment.content}"`
    );
  });

  console.log("=== END DEBUG ===");

  return segments;
};

export const testBoldParsing = (): void => {
  const testCases = [
    "This is **bold text** in the middle.",
    "**Bold at the start** and regular text.",
    "Regular text and **bold at the end**",
    "Multiple **bold** words **here** and **there**.",
    "**Are you curious about its mathematical properties?**",
    "This has * bullet points and **bold text** together.",
    "* **Bold bullet point** with formatting",
    "Text with `code` and **bold** and (parenthetical) content.",
  ];

  testCases.forEach((testCase, index) => {
    console.log(`\n--- Test Case ${index + 1} ---`);
    debugTextParsing(testCase);
  });
};

// Export for browser console testing
if (typeof window !== "undefined") {
  (
    window as typeof window & {
      debugTextParsing: typeof debugTextParsing;
      testBoldParsing: typeof testBoldParsing;
    }
  ).debugTextParsing = debugTextParsing;
  (
    window as typeof window & {
      debugTextParsing: typeof debugTextParsing;
      testBoldParsing: typeof testBoldParsing;
    }
  ).testBoldParsing = testBoldParsing;
}

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({ apiKey: `${process.env.GEMINI_API_KEY}` });

const submitMessage = async (message: string): Promise<string> => {
  try {
    console.log(message);
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: message,
    });

    // Get the text from the response - it's a property, not a method
    const text = response.text;
    return text || "No response generated";
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate response from Gemini API");
  }
};

export { submitMessage };

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({ apiKey: `${process.env.GEMINI_API_KEY}` });

const submitMessage = async (message: string) => {
  console.log(message);
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: message,
  });
  return response.text;
};

export { submitMessage };

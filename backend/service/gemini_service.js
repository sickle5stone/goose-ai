"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitMessage = void 0;
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log(process.env.GEMINI_API_KEY);
const ai = new genai_1.GoogleGenAI({ apiKey: `${process.env.GEMINI_API_KEY}` });
const submitMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(message);
        const response = yield ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: message,
        });
        // Get the text from the response - it's a property, not a method
        const text = response.text;
        return text || "No response generated";
    }
    catch (error) {
        console.error("Error generating content:", error);
        throw new Error("Failed to generate response from Gemini API");
    }
});
exports.submitMessage = submitMessage;

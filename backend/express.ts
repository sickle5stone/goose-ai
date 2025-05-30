import express, { Request, Response } from "express";

import cors from "cors";
import { submitMessage } from "./service/gemini_service";

// Type definitions
interface ChatRequest {
  message: string;
  model: string;
}

interface ChatResponse {
  id: number;
  question: string;
  response: string;
}

interface HealthResponse {
  status: string;
  message: string;
}

const app = express();
const port = process.env.PORT || 3008;

// CORS configuration for production
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [
          "https://goose-ai-frontend.onrender.com",
          "https://your-frontend-domain.onrender.com",
        ]
      : [
          "http://localhost:5177",
          "http://localhost:5173",
          "http://localhost:5174",
        ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

// Health check endpoint for Render
app.get("/", (req: Request, res: Response<HealthResponse>) => {
  res.json({ status: "OK", message: "Goose AI Backend is running!" });
});

const rootRoute = "/api/v1";

app.post(
  `${rootRoute}/chat/initiate`,
  async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("initiate");
      console.log(req.body);

      const body = req.body as ChatRequest;

      if (!body?.message) {
        res.status(400).json({
          id: 0,
          question: "",
          response: "Message is required",
        } as ChatResponse);
        return;
      }

      const response = await submitMessage(body.message);
      console.log(response);

      // delay 3 second
      setTimeout(() => {
        const responseToReturn: ChatResponse = {
          id: Math.random(),
          question: body.message,
          response: response,
        };
        res.json(responseToReturn);
      }, 1500);
    } catch (error) {
      console.error("Error in chat initiate:", error);
      res.status(500).json({
        id: 0,
        question: (req.body as ChatRequest)?.message || "",
        response: "An error occurred while processing your request",
      } as ChatResponse);
    }
  }
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

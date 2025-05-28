import express, { Request, Response } from "express";

import cors from "cors";
import { submitMessage } from "./service/gemini_service";

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
      : "http://localhost:5177",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

// Health check endpoint for Render
app.get("/", (req: Request, res: Response) => {
  res.json({ status: "OK", message: "Goose AI Backend is running!" });
});

const rootRoute = "/api/v1";

app.post(`${rootRoute}/chat/initiate`, async (req: Request, res: Response) => {
  console.log("initiate");
  console.log(req.body);

  const response = await submitMessage(req.body?.message);
  console.log(response);
  // delay 3 second
  setTimeout(async () => {
    const responseToReturn = {
      id: Math.random(),
      question: req.body?.message,
      response: response,
    };
    res.json(responseToReturn);
  }, 1500);

  // res.json({
  //   id: Math.random(),
  //   question: req.body.message,
  //   response: "Message received",
  // });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

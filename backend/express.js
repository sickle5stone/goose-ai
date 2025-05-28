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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const gemini_service_1 = require("./service/gemini_service");
const app = (0, express_1.default)();
const port = process.env.PORT || 3008;
// CORS configuration for production
const corsOptions = {
    origin: process.env.NODE_ENV === "production"
        ? [
            "https://goose-ai-frontend.onrender.com",
            "https://your-frontend-domain.onrender.com",
        ]
        : "http://localhost:5177",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Health check endpoint for Render
app.get("/", (req, res) => {
    res.json({ status: "OK", message: "Goose AI Backend is running!" });
});
const rootRoute = "/api/v1";
app.post(`${rootRoute}/chat/initiate`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log("initiate");
        console.log(req.body);
        const body = req.body;
        if (!(body === null || body === void 0 ? void 0 : body.message)) {
            res.status(400).json({
                id: 0,
                question: "",
                response: "Message is required",
            });
            return;
        }
        const response = yield (0, gemini_service_1.submitMessage)(body.message);
        console.log(response);
        // delay 3 second
        setTimeout(() => {
            const responseToReturn = {
                id: Math.random(),
                question: body.message,
                response: response,
            };
            res.json(responseToReturn);
        }, 1500);
    }
    catch (error) {
        console.error("Error in chat initiate:", error);
        res.status(500).json({
            id: 0,
            question: ((_a = req.body) === null || _a === void 0 ? void 0 : _a.message) || "",
            response: "An error occurred while processing your request",
        });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

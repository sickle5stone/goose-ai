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
const port = 3008;
app.use((0, cors_1.default)({
    origin: "http://localhost:5177",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
const rootRoute = "/api/v1";
app.post(`${rootRoute}/chat/initiate`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("initiate");
    console.log(req.body);
    const response = yield (0, gemini_service_1.submitMessage)((_a = req.body) === null || _a === void 0 ? void 0 : _a.message);
    console.log(response);
    // delay 3 second
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const responseToReturn = {
            id: Math.random(),
            question: (_a = req.body) === null || _a === void 0 ? void 0 : _a.message,
            response: response,
        };
        res.json(responseToReturn);
    }), 1500);
    // res.json({
    //   id: Math.random(),
    //   question: req.body.message,
    //   response: "Message received",
    // });
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

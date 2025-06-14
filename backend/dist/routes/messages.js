"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generative_ai_1 = require("@google/generative-ai");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
const GEMINI_API_KEY = "AIzaSyAAiC5eGpM3CZFSnr_XvbJn2TSDdgd-194"; // Replace with your actual key
const genAI = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // or "gemini-1.5-flash"
// POST /api/personalized-message - Generate personalized message
router.post("/", validation_1.validateMessageRequest, async (req, res) => {
    try {
        const body = req.body;
        const prompt = `Generate a personalized LinkedIn outreach message for the following person:

Name: ${body.name}
Job Title: ${body.job_title}
Company: ${body.company}
Location: ${body.location}
Summary: ${body.summary}

The message should:
- Be professional and friendly
- Reference their specific role and company
- Mention how OutFlo can help with their outreach and sales
- Be concise (under 200 words)
- Include a clear call to action to connect
- Sound natural and personalized

Generate only the message text, no additional formatting or explanations.`;
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        const message = result.response.text().trim();
        if (!message)
            throw new Error("Failed to generate message");
        res.json({ message });
    }
    catch (error) {
        console.error("Error generating personalized message:", error);
        const body = req.body;
        const fallbackMessage = `Hi ${body?.name || "there"}, I noticed you're working as a ${body?.job_title || "professional"} at ${body?.company || "your company"}. OutFlo can help automate your outreach to increase meetings & sales. Let's connect!`;
        res.json({
            message: fallbackMessage,
            note: "Generated using fallback due to AI service unavailability",
        });
    }
});
exports.default = router;
//# sourceMappingURL=messages.js.map
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai"
import { validateMessageRequest } from "../middleware/validation";

const router = express.Router();


const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // or "gemini-1.5-flash"

interface ProfileData {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}

// POST /api/personalized-message - Generate personalized message
router.post("/", validateMessageRequest, async (req, res) => {
  try {
    const body: ProfileData = req.body;

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

    if (!message) throw new Error("Failed to generate message");

    res.json({ message });
  } catch (error) {
    console.error("Error generating personalized message:", error);

    const body: ProfileData = req.body;
    const fallbackMessage = `Hi ${
      body?.name || "there"
    }, I noticed you're working as a ${body?.job_title || "professional"} at ${
      body?.company || "your company"
    }. OutFlo can help automate your outreach to increase meetings & sales. Let's connect!`;

    res.json({
      message: fallbackMessage,
      note: "Generated using fallback due to AI service unavailability",
    });
  }
});

export default router;

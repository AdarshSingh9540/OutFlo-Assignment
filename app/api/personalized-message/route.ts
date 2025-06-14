import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ProfileData {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||"";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(request: NextRequest) {
  try {
    const body: ProfileData = await request.json();
    const requiredFields = [
      "name",
      "job_title",
      "company",
      "location",
      "summary",
    ];
    const missingFields = requiredFields.filter(
      (field) => !body[field as keyof ProfileData]
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Generate personalized message using Gemini
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

    if (!message) {
      throw new Error("Failed to generate message");
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error generating personalized message:", error);

    const body = await request.json().catch(() => ({} as ProfileData)); // Fallback to empty object if body was already read
    const fallbackMessage = `Hi ${
      body?.name || "there"
    }, I noticed you're working as a ${body?.job_title || "professional"} at ${
      body?.company || "your company"
    }. OutFlo can help automate your outreach to increase meetings & sales. Let's connect!`;

    return NextResponse.json(
      {
        message: fallbackMessage,
        note: "Generated using fallback due to AI service unavailability",
      },
      { status: 200 }
    );
  }
}

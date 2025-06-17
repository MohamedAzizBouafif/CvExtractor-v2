import OpenAI from "openai";
import { z } from "zod";
import { cvDataSchema } from "@shared/schema";

export async function extractCVData(pdfText: string): Promise<z.infer<typeof cvDataSchema>> {
  // Initialize OpenAI client (works with DeepSeek API as well)
  const apiKey = process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const openai = new OpenAI({
    apiKey,
    baseURL: process.env.DEEPSEEK_API_KEY ? "https://api.deepseek.com" : undefined,
  });

  const prompt = `
Extract structured information from this CV text and return it as a JSON object with the following schema:

{
  "first_name": string,
  "last_name": string,
  "sex": string (Male/Female/Other/Prefer not to say),
  "language": string (primary language),
  "email": string,
  "phone": string,
  "education": string (most relevant degree/institution),
  "skills": array of strings,
  "expertise": array of objects with {date: string, company: string, role: string},
  "summary": string (professional summary/elevator pitch)
}

CV Text:
${pdfText}

Instructions:
- Extract accurate information only from the CV text
- For missing information, use empty strings or empty arrays
- For skills, include technical and professional skills
- For expertise, list work experience in chronological order
- Keep the summary concise and professional
- Respond only with valid JSON, no additional text
`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.DEEPSEEK_API_KEY ? "deepseek-chat" : "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a CV information extraction expert. Extract structured data from CV text and return only valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const extractedData = JSON.parse(response.choices[0].message.content || "{}");
    
    // Validate the extracted data against our schema
    return cvDataSchema.parse(extractedData);
  } catch (error) {
    console.error('AI extraction error:', error);
    throw new Error('Failed to extract CV data using AI');
  }
}
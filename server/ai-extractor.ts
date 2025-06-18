import axios from "axios";
import { z } from "zod";
import { cvDataSchema } from "@shared/schema";

export async function extractCVData(
  pdfText: string
): Promise<z.infer<typeof cvDataSchema>> {
  // Initialize DeepSeek API configuration
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DeepSeek API key not configured");
  }

  const prompt = `
Extract structured information from this CV text and return it as a well-formatted JSON object with the following schema:

{
  "first_name": string,
  "last_name": string,
  "sex": string (Male/Female/Other/Prefer not to say),
  "language": array of strings (spoken languages),
  "email": string,
  "phone": array of strings (list of phone numbers),
  "location": string (current city and country),
  "linkedin": string (URL or empty),
  "education": array of objects with {degree: string, institution: string, location: string, start_date: string, end_date: string},
  "certificates": array of strings,
  "skills": array of strings (technical, soft, and leadership skills),
  "hobbies": array of strings,
  "expertise": array of objects with {date: string, company: string, role: string, description: string},
  "projects": array of objects with {project_name: string, industry: string, country: string, role: string, phases: array of strings},
  "summary": string (professional elevator pitch, max 3 sentences)
}

Instructions:
- Extract accurate information only from the CV text provided.
- If some information is missing, use empty strings, empty arrays, or null.
- Group skills into a single array (both technical and soft skills).
- For expertise, extract company, role, time period, and a short description of responsibilities.
- For projects, capture as much structure as possible: name/industry/country/version/role/phases.
- For education, include both university and ITI.
- Only return a clean, valid JSON. Do not include any extra explanation or commentary.

CV Text:
${pdfText}

`;

  try {
    // DeepSeek API endpoint for chat completions
    const apiUrl = "https://api.deepseek.com/v1/chat/completions";

    // API request configuration
    const response = await axios.post(
      apiUrl,
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are a CV information extraction expert. Extract structured data from CV text and return only valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    // Extract the content from the response
    const content = response.data.choices[0].message.content;
    const extractedData = JSON.parse(content || "{}");

    // Validate the extracted data against our schema
    return cvDataSchema.parse(extractedData);
  } catch (error) {
    console.error("DeepSeek API extraction error:", error);
    throw new Error("Failed to extract CV data using DeepSeek AI");
  }
}

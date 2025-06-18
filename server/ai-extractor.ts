import axios from "axios";
import { z } from "zod";
import { cvDataSchema } from "@shared/schema";

export async function extractCVData(
  pdfText: string
): Promise<z.infer<typeof cvDataSchema>> {
  // Initialize DeepSeek API configuration
  const apiKey = process.env.DEEPSEEK_API_KEY;

  // Log API key presence (not the actual key) for debugging
  console.log(`DeepSeek API key status: ${apiKey ? "Found" : "Missing"}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(
    `Some available environment variables: ${Object.keys(process.env)
      .filter(
        (key) =>
          !key.includes("KEY") &&
          !key.includes("SECRET") &&
          !key.includes("TOKEN")
      )
      .slice(0, 10)
      .join(", ")}`
  );

  if (!apiKey) {
    throw new Error(
      "DeepSeek API key not configured. Please add DEEPSEEK_API_KEY to environment variables."
    );
  }

  const prompt = `
Extract structured information from this CV text and return it as a well-formatted JSON object with the following schema:

{
  "first_name": string,
  "last_name": string,
  "sex": string (Male/Female/Other/Prefer not to say),
  "language": array of strings (spoken languages),
  "email": string (email or empty)
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
- If anthink is not indicated in the cv return as empty string with the key.

CV Text:
${pdfText}

`;
  try {
    // Add a debug flag to check if we're using production or test mode
    const isProd = process.env.NODE_ENV === "production";
    console.log(`Running in ${isProd ? "production" : "development"} mode`);

    // DeepSeek API endpoint for chat completions
    const apiUrl = "https://api.deepseek.com/v1/chat/completions";

    console.log(`Attempting to connect to DeepSeek API...`);

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
  } catch (error: any) {
    console.error("DeepSeek API extraction error:");

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data)}`);
      console.error(`Headers: ${JSON.stringify(error.response.headers)}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from DeepSeek API");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`Error message: ${error.message}`);
    }

    throw new Error(
      `Failed to extract CV data: ${error.message || "Unknown error"}`
    );
  }
}

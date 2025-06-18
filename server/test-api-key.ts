import "dotenv/config";
import axios from "axios";

async function testDeepSeekAPI() {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    console.error("❌ DEEPSEEK_API_KEY is not set in environment variables");
    process.exit(1);
  }

  console.log("🔑 DEEPSEEK_API_KEY found in environment variables");

  try {
    // A simple API test call
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content:
              "Hello, this is a test message to verify API connectivity.",
          },
        ],
        temperature: 0.1,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    console.log("✅ API connection successful!");
    console.log("Model response:", response.data.choices[0].message.content);
  } catch (error: any) {
    console.error("❌ API test failed:", error.response?.data || error.message);
    process.exit(1);
  }
}

testDeepSeekAPI();

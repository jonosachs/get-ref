import fetch from "node-fetch";

const LLM_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Make Gemini API POST request with prompt
export async function fetchLlm(prompt, urlMetaData) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const body = {
    contents: [{ parts: [{ text: `${prompt}\n\n${urlMetaData}` }] }],
  };

  const response = await fetch(`${LLM_ENDPOINT}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data from Gemini API.");
  }

  return response.json();
}

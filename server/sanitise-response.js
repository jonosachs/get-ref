export function sanitiseResponse(response) {
  const citationText = response?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!citationText) {
    throw new Error("No citation text returned from Gemini API");
  }

  // Clean response data to provide valid Json
  let cleaned = citationText
    .replace(/\n/g, "")
    .replace(/\\+/g, "")
    .replace(/^.*?(?=\{)/s, "")
    .replace(/(?<=\})([\s\S]*)$/, "");

  return JSON.parse(cleaned);
}

export function parseResponse(response) {
  if (!response) {
    throw new Error("No citation text returned from LLM API");
  }

  const responseText = response?.candidates?.[0]?.content?.parts?.[0]?.text;

  // Clean response data to provide valid Json
  let cleaned = responseText
    .replace(/\n/g, "")
    .replace(/\\+/g, "")
    .replace(/^.*?(?=\{)/s, "")
    .replace(/(?<=\})([\s\S]*)$/, "");

  return JSON.parse(cleaned);
}

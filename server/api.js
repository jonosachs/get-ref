import { fetchLlm } from "./fetch-llm.js";
import { llmPrompt } from "./prompt.js";
import { createExpressApp } from "./express.js";
import { sanitiseResponse } from "./sanitise-response.js";

const DEFAULT_PORT = process.env.PORT || 3000;

export async function runServer(port = DEFAULT_PORT) {
  const app = createExpressApp();

  // Setup API endpoint to fetch citation from LLM
  app.post("/gemini", async (req, res) => {
    try {
      const urlMetaData = req.body.urlMetaData;

      if (!urlMetaData) {
        return res.status(400).json({ error: "Missing URL metadata in request body" });
      }

      if (urlMetaData.length > 100_000) {
        return res.status(400).json({
          error: "URL metadata is too long, please try again with a shorter webpage",
        });
      }

      const llmResponse = await fetchLlm(llmPrompt, urlMetaData);
      const sanitised = sanitiseResponse(llmResponse);

      return res.status(200).json(sanitised);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch data from LLM API." });
    }
  });

  return app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

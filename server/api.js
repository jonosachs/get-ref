import { parseResponse } from "./parse-response.js";
import { llmPrompt } from "./prompt.js";

export async function runServer(app, port, llm) {
  // create API endpoint to accept url metadata and return formatted citation from LLM
  app.post("/citation", async (req, res) => {
    try {
      const urlMetaData = req?.body?.urlMetaData;
      validate(urlMetaData);

      const llmResponse = await llm.fetch(buildPrompt(llmPrompt, urlMetaData));
      const parsed = parseResponse(llmResponse);

      return res.status(200).json(parsed);
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ error: `Failed to fetch data from LLM API. ${error.message}` });
    }
  });

  return app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

function validate(urlMetaData) {
  if (!urlMetaData || urlMetaData == null) {
    throw new Error("Missing URL metadata in request body");
  }

  if (urlMetaData.length > 100_000) {
    throw new Error("URL metadata is too long, please try again with a shorter webpage");
  }
}

function buildPrompt(llmPrompt, urlMetaData) {
  return llmPrompt + "\n\n" + "USER\n" + urlMetaData;
}

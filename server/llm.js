import fetch from "node-fetch";

class Llm {
  constructor(apiKey, apiPath) {
    this.apiKey = apiKey;
    this.apiPath = apiPath;
  }

  async fetch(prompt) {
    const url = `${this.apiPath}?key=${this.apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(this.buildBody(prompt)),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`LLM API returned an error: ${data.error}`);
    }

    return data;
  }

  buildBody(prompt) {
    //this is Gemini specific format, change to suit other LLMs if needed
    return {
      contents: [{ parts: [{ text: `${prompt}` }] }],
    };
  }
}

export { Llm };

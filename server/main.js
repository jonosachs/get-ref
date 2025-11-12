import "dotenv/config"; //must be imported before any other modules
import { runServer } from "./api.js";
import { createApp } from "./app.js";
import { Llm } from "./llm.js";

const app = createApp();
const gemini = new Llm(process.env.GEMINI_API_KEY, process.env.GEMINI_API_PATH);
runServer(app, 3000, gemini);

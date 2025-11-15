# Get-Ref AI

Get-Ref AI is a two-part toolchain that turns any web page into an EndNote-friendly citation:

- A Chrome extension scrapes high-signal metadata from the active tab, lets you review/edit the suggested fields, and exports an `.enw` file.
- A lightweight Node.js server forwards the collected metadata to a Large Language Model (LLM) prompt tuned for deterministic EndNote tagging, then returns the cleaned JSON payload to the extension.

![Popup screenshot](screen-shot.png)

## Architecture

- `extensions/`: Vite + CRX-powered Chrome extension (Manifest V3). It injects a DOM-scraping helper into the active tab, posts the metadata to the local API, renders the returned fields, and downloads the citation.
- `server/`: Express server that exposes `POST /citation`. It validates the payload, builds the LLM prompt (`server/prompt.js`), calls the Gemini API (or another compatible endpoint), and normalizes the model response.

```
┌─────────────┐      metadata       ┌─────────────┐     prompt + metadata     ┌─────────────┐
│   Browser   │ ─────────────────▶  │  Local API  │ ─────────────────────────▶│   Gemini    │
│ extension   │◀──────────────────  │  (Express)  │◀──────────────────────────│    API      │
└─────────────┘   citation JSON     └─────────────┘      structured JSON      └─────────────┘
```

## Prerequisites

- Node.js 18+ and npm.
- A Gemini (Generative Language) API key with access to the `models/gemini-1.5-*` endpoint (or another endpoint that accepts the same request body).
- Google Chrome or any Chromium browser with developer mode enabled for loading unpacked extensions.

## Setup

### 1. Server

```bash
cd server
npm install
```

Create a `.env` file (see `server/main.js` for the expected variable names):

```env
GEMINI_API_KEY=your-api-key
GEMINI_API_PATH=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent
PORT=3000   # optional; defaults to 3000 if omitted
```

Start the API:

```bash
npm start
```

> **Tip:** `npm start` simply runs `node main.js`, so feel free to invoke either command when debugging.

### 2. Chrome extension

```bash
cd extensions
npm install
npm run build
```

The build generates the unpacked extension in `extensions/dist` and a zipped artifact under `extensions/release/`.

Load the unpacked build in Chrome:

1. Visit `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select `<repo>/extensions/dist`.

## Usage

1. Navigate to the article or page you want to cite.
2. Ensure the local API server is running (`http://localhost:3000` by default).
3. Click the Get-Ref extension icon, then **Get Citation**.
4. Review or tweak any of the returned EndNote fields.
5. Click the download icon to export an `.enw` file named after the `%T` (Title) field.

## Development Workflow

- `npm run dev` (inside `extensions/`) runs Vite's development server with hot module reloading for the popup UI.
- `npm run build` bundles the extension, runs the CRX manifest transforms, and creates a distributable zip.
- The server currently has no automated tests. If you make changes to validation/parsing, consider adding unit tests for `parse-response.js` and integration tests for `api.js`.

## Troubleshooting

- **CORS or network errors:** The extension talks to `http://localhost:3000/citation`. Confirm the API server is running and reachable from Chrome.
- **LLM errors:** The server surfaces raw Gemini error messages. Verify your API key, quota, and that the `GEMINI_API_PATH` matches the model you have access to.
- **Malformed citations:** Inspect `server/parse-response.js` and the LLM prompt if the JSON shape drifts. Parsing is strict, so unexpected model output will raise an error that gets surfaced in the popup.

## Project Status

This project is an early prototype. Known gaps include:

- There are no automated tests for the server or extension.
- Better error handling and retry logic would make the extension more resilient when the LLM or local API is offline.

Contributions and issue reports are welcome!

\*README generated using Codex.

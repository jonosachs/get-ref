## Get Ref AI

Get Ref AI is a Chrome extension plus local proxy server that converts the metadata of the current page into an EndNote-compatible citation using Google’s Gemini API. The extension reads `<head>` metadata, sends it to the local Node.js server, and the server forwards the prompt to Gemini, sanitises the response, and returns JSON the popup can paste or download.

### Architecture

- `extensions/` – Vite-powered Chrome extension (popup UI, content scripts, download helpers).
- `server/` – Express proxy (bootstrapped via `main.js` + `express.js`) that accepts metadata, calls Gemini, and returns cleaned JSON.
- `screen-shot.png` – quick preview of the popup state.

### Prerequisites

- Node.js 18+ (the server uses ES modules and `node-fetch` v3).
- A Google Gemini API key with access to the `gemini-2.0-flash` model.
- Chrome/Chromium for loading the unpacked extension.

### Initial Setup

1. **Install dependencies**
   ```bash
   cd server && npm install
   cd ../extensions && npm install
   ```
2. **Configure environment variables**
   - Create `server/.env` (not committed):
     ```bash
     GEMINI_API_KEY=your_api_key_here
     PORT=3000 # optional; defaults to 3000
     ```

### Running the local proxy

```bash
cd server
node main.js
```

`main.js` loads `server/.env`, constructs a fresh Express app, and starts listening on `http://localhost:3000/gemini`. Keep this process running whenever the extension is active.

### Developing the extension

1. In a new terminal:
   ```bash
   cd extensions
   npm run dev
   ```
   Vite serves build artifacts into `dist/` and rebuilds on file change.
2. Open Chrome → `chrome://extensions` → enable _Developer mode_ → **Load unpacked** → select the `extensions/dist` folder.
3. Pin the “Get Ref AI” extension, open it, and click **Get Citation** while the proxy server is running.

### Production build

```bash
cd extensions
npm run build
```

This emits the packed extension into `extensions/dist`. You can zip `dist/` for the Chrome Web Store or use `vite-plugin-zip-pack` if configured.

### Troubleshooting

- **`require is not defined`**: ensure you’re using Node 18+ and run files via `node main.js`; the server uses ES modules.
- **`Failed to fetch data from LLM API`**: confirm `GEMINI_API_KEY` is valid and hasn’t exceeded quota. Logs print in the server terminal.
- **Popup stuck on “Attempting…”**: verify the server is running and Chrome can reach `http://localhost:3000/gemini`. CORS is enabled by default.

### Next Steps

Useful next steps include adding unit tests for `server/sanitise-response.js`, improving popup error messaging, and formalising a packaging script for releases.

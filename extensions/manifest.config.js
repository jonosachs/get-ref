import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "./package.json";

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  description: "Download current webpage citation as .enw (EndNote Import) file",
  icons: {
    48: "icon-01.png",
  },
  action: {
    default_icon: {
      48: "icon-01.png",
    },
    default_popup: "src/popup/index.html",
  },
  // content_scripts: [
  //   {
  //     js: ["src/popup/popup.js"],
  //     matches: ["https://*/*"],
  //   },
  // ],
  permissions: ["scripting", "tabs", "activeTab"],
  host_permissions: ["<all_urls>", "https://generativelanguage.googleapis.com/*"],
});

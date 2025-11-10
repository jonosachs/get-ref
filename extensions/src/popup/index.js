import { getUrlMetaData } from "../content/get-url-metadata";
import { postMetaData } from "./post-metadata";
import { populateHtmlForm } from "./populate-html-form";
import { packageForDownload } from "./package-for-download";

window.addEventListener("DOMContentLoaded", async () => {
  const errorBar = document.getElementById("errorBar");
  const infoBar = document.getElementById("infoBar");
  const getCitationButton = document.getElementById("getCitationBtn");
  const form = document.getElementById("refForm");
  const downloadButton = document.getElementById("downloadBtn");

  // Get current tab and inject getUrlMetaData function
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const [{ result: urlMetaData }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getUrlMetaData,
  });

  if (!urlMetaData) {
    errorBar.innerText = "Failed to get URL metadata from current webpage";
    return;
  }

  // Get citation button logic
  getCitationButton.addEventListener("click", async () => {
    noteBar.innerText = "Attempting to fetch citation..";
    errorBar.innerText = "";

    // Fetch citation from local server
    const citation = await postMetaData(urlMetaData);
    noteBar.innerText = "";

    if (citation) {
      populateHtmlForm(citation);
      packageForDownload(citation);
    } else {
      errorBar.innerText = "Failed to fetch citation";
    }
  });
});

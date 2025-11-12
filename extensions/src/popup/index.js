import { getUrlMetaData } from "../content/get-url-metadata";
import { getCitationFromServer } from "./get-citation";
import { populateHtmlForm } from "./populate-html-form";
import { packageForDownload } from "./package-for-download";

window.addEventListener("DOMContentLoaded", async () => {
  const errorBar = document.getElementById("errorBar");
  const infoBar = document.getElementById("infoBar");
  const getCitationButton = document.getElementById("getCitationBtn");

  const urlMetaData = await injectFunction(getUrlMetaData);

  if (!urlMetaData) {
    errorBar.innerText = "Failed to get URL metadata from current webpage";
    return;
  }

  // Get citation button logic
  getCitationButton.addEventListener("click", async () => {
    infoBar.innerText = "Attempting to fetch citation..";
    errorBar.innerText = "";

    // Fetch citation from local server
    const apiPath = "http://localhost:3000/citation";
    const citation = await getCitationFromServer(apiPath, urlMetaData);
    infoBar.innerText = "";

    if (citation.error) {
      errorBar.innerText = citation.error;
      return;
    }

    populateHtmlForm(citation);
    packageForDownload(citation);
  });
});

async function injectFunction(func) {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  const [{ result: data }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: func,
  });

  return data;
}

import { getUrlMetaData } from "../content/get-url-metadata";
import { getCitationFromServer } from "./get-citation";
import { populateHtmlForm } from "./populate-html-form";
import { download } from "./download";

window.addEventListener("DOMContentLoaded", async () => {
  const errorBar = document.getElementById("errorBar");
  const infoBar = document.getElementById("infoBar");
  const getCitationButton = document.getElementById("getCitationBtn");
  const form = document.getElementById("refForm");
  const downloadBtn = document.getElementById("downloadBtn");

  getCitationButton.addEventListener("click", async () => {
    form.innerHTML = "";
    downloadBtn.style.display = "none";

    const urlMetaData = await injectFunction(getUrlMetaData);

    if (!urlMetaData) {
      errorBar.innerText = "Unable to get URL meta data. Please try again.";
      return;
    }

    console.log("urlMetaData", urlMetaData);

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

    populateHtmlForm(form, citation);

    // Show download button and add click event listener
    downloadBtn.style.display = "inline-block";
    downloadBtn.style.backgroundImage = `url(${chrome.runtime.getURL("icon-02.png")})`;
    downloadBtn.addEventListener("click", (e) => {
      e.preventDefault();
      download(citation);
    });
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

import { postMetaData } from "./post-metadata";
import { populateHtmlForm } from "./populate-html-form";
import { packageForDownload } from "./package-for-download";

export function setupGetCitationButton(noteBar, errorBar, urlMetaData) {
  const button = document.getElementById("getCitation");

  if (!button) {
    console.error("Failed to get citation button");
    return;
  }

  button.addEventListener("click", async () => {
    noteBar.innerText = "Attempting to get AI citation..";
    errorBar.innerText = "";

    // Initiate local server call to access Gemini API
    const citation = await postMetaData(urlMetaData);
    noteBar.innerText = "";

    if (citation) {
      populateHtmlForm(citation);
      packageForDownload(citation);
    } else {
      errorBar.innerText = "Failed to get citation";
    }
  });
}

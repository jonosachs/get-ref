// Get URL meta data and return as combined String for processing
function getUrlMetaData() {
  const tags = [...document.querySelectorAll("title, meta, time")];
  const meta = [...document.querySelectorAll('[class*="meta"]')];
  const authorName = [
    ...document.querySelectorAll('[class*="author"], [class*="name"]'),
  ];
  const cdata = [
    ...document.querySelectorAll(
      'script[type="application/ld+json"], script[type="application/json"]'
    ),
  ];
  const url = window.location.href;
  const combinedMetaData = [url, ...tags, ...meta, ...authorName, ...cdata];
  const formattedMetaData = combinedMetaData
    .map((tag) => tag.outerHTML)
    .join("\n");
  const today = new Date().toISOString().slice(0, 10);

  return `Access date:${today}\n${formattedMetaData}`;
}

// Endnote .enw tags for importing
let tagDict = {
  "%A": "Author",
  "%B": "Secondary Title",
  "%C": "Place Published",
  "%D": "Year / Date",
  "%E": "Editor",
  "%F": "Label",
  "%G": "Language",
  "%H": "Translated Author",
  "%I": "Publisher",
  "%J": "Journal / Periodical Name",
  "%K": "Keywords",
  "%L": "Call Number",
  "%M": "Notes",
  "%N": "Issue Number",
  "%P": "Pages",
  "%Q": "Translated Title",
  "%R": "DOI / Electronic Resource",
  "%S": "Series Title",
  "%T": "Title",
  "%U": "URL",
  "%V": "Volume",
  "%X": "Abstract",
  "%Y": "Tertiary Author",
  "%Z": "Custom Field / Notes",
  "%0": "Reference Type",
  "%6": "Number of Volumes",
  "%7": "Edition",
  "%8": "Access Date",
  "%9": "Type of Work",
  "%?": "Subsidiary Author",
  "%@": "ISBN / ISSN",
  "%(": "Original Publication",
  "%>": "Link to PDF",
  "%[": "Access Date",
};

window.addEventListener("DOMContentLoaded", async () => {
  const errorBar = document.getElementById("errorBar");
  const noteBar = document.getElementById("noteBar");

  // Get current tab and inject getUrlMetaData function
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const [{ result: urlMetaData }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getUrlMetaData,
  });

  // Get citation button logic
  document.getElementById("getCitation").addEventListener("click", async () => {
    noteBar.innerText = "Attempting to get AI citation..";
    errorBar.innerText = "";

    // Initiate local server call to access Gemini API
    aiResponseJson = await getAiCitationJson(urlMetaData);
    noteBar.innerText = "";

    if (aiResponseJson) {
      populateHtml(aiResponseJson);
      packageForDownload(aiResponseJson);
    }
  });
});

// Enable download button and package citation for downloading
function packageForDownload(aiResponseJson) {
  const downloadBtn = document.getElementById("download");
  let entry = "";

  if (aiResponseJson) {
    downloadBtn.style.display = "inline-block";
    downloadBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Get live data from HTML fields allowing user editing
      Object.entries(aiResponseJson).forEach(([key, _]) => {
        const liveValue = document.getElementById(key).value;
        entry += `${key} ${liveValue} \n`;
      });

      // Create Blob for downloading
      const blob = new Blob([entry], { type: "text/plain" });
      const urlBlob = URL.createObjectURL(blob);

      // Use citation title for filename
      const title = aiResponseJson["%T"];
      const a = document.createElement("a");
      a.href = urlBlob;
      a.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.enw`;
      a.click();
      URL.revokeObjectURL(urlBlob);
    });
  } else {
    console.error("Could not package contents for download");
  }
}

// Create (if not existing) and populate HTML fields with citation data
function populateHtml(aiReponseJson) {
  const form = document.getElementById("form");
  let textArea;

  Object.entries(aiReponseJson).forEach(([key, value]) => {
    try {
      textArea = document.getElementById(key);
      textArea.value = value ? value : null;
    } catch {
      const label = document.createElement("label");
      label.innerHTML = tagDict[key];

      textArea = document.createElement("textarea");
      textArea.id = key;
      textArea.value = value ? value : null;

      const br1 = document.createElement("br");
      const br2 = document.createElement("br");

      form.appendChild(label);
      form.appendChild(textArea);
      form.appendChild(br1);
      form.appendChild(br2);
    }
  });
}

// Make POST request to local back-end server with url meta data
async function getAiCitationJson(urlMetaData) {
  const errorBar = document.getElementById("errorBar");
  const proxyUrl = "http://localhost:3000/gemini";

  try {
    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urlMetaData: urlMetaData }),
    });

    if (!response.ok) {
      errorBar.innerText = `ERROR: ${response.status} ${response.statusText}`;
      throw new Error(response.statusText);
    }

    // Get response from local server and return result
    const result = await response.json();

    try {
      return result;
    } catch (err) {
      let errorMsg = "Failed to parse cleaned Gemini JSON:";
      console.error(errorMsg, err);
      errorBar.innerText = `ERROR: ${errorMsg} ${err}`;
      return {};
    }
  } catch (err) {
    let errorMsg = "Failed to fetch data from local server.";
    console.error(errorMsg, err);
    errorBar.innerText = `ERROR: ${errorMsg} ${err}`;
    return {};
  }
}

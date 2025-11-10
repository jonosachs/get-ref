// Enable download button and package citation for downloading
export function packageForDownload(citation) {
  const downloadBtn = document.getElementById("download");
  let entry = "";

  if (citation) {
    downloadBtn.style.display = "inline-block";
    downloadBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Get live data from HTML fields allowing user editing
      Object.entries(citation).forEach(([key, _]) => {
        const liveValue = document.getElementById(key).value;
        entry += `${key} ${liveValue} \n`;
      });

      // Create Blob for downloading
      const blob = new Blob([entry], { type: "text/plain" });
      const urlBlob = URL.createObjectURL(blob);

      // Use citation title for filename
      const title = citation["%T"];
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

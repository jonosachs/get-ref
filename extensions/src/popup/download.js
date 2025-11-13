// Package citation and download it as .enw file
export function download(citation) {
  let entry = "";

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
}

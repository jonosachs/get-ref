import { enwTags } from "./enw-tags";

// Create (if not existing) and populate HTML fields with citation data
export function populateHtmlForm(citation) {
  const form = document.getElementById("refForm");
  let textArea;

  Object.entries(citation).forEach(([key, value]) => {
    try {
      textArea = document.getElementById(key);
      textArea.value = value ? value : null;
    } catch (error) {
      console.error(`Failed to populate HTML form for key: ${key}`);
      console.error(error);

      // label.innerHTML = enwTags[key];

      // textArea = document.createElement("textarea");
      // textArea.id = key;
      // textArea.value = value ? value : null;

      // const br1 = document.createElement("br");
      // const br2 = document.createElement("br");

      // form.appendChild(label);
      // form.appendChild(textArea);
      // form.appendChild(br1);
      // form.appendChild(br2);
    }
  });
}

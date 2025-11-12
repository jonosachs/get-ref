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
      addFieldToForm(key, value, form);
    }
  });
}

function addFieldToForm(key, value, form) {
  const label = document.createElement("label");
  label.innerHTML = enwTags[key];
  form.appendChild(label);

  const textArea = document.createElement("textarea");
  textArea.id = key;
  textArea.value = value ? value : null;
  form.appendChild(textArea);
}

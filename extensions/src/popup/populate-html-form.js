import { enwTags } from "./enw-tags";

// Create form fields and populate with citation data
export function populateHtmlForm(form, citation) {
  form.innerHTML = "";

  Object.entries(citation).forEach(([key, value]) => {
    createField(key, value, form);
  });
}

function createField(key, value, form) {
  const label = document.createElement("label");
  // Get human-readable name from enwTags object
  const humanReadableName = enwTags[key] || key;
  label.innerHTML = humanReadableName;
  form.appendChild(label);

  const textArea = document.createElement("textarea");
  textArea.id = key;
  textArea.value = value ? value : null;
  form.appendChild(textArea);
}

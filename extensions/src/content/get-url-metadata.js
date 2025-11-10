// Get URL meta data and return as combined String for processing
export function getUrlMetaData() {
  const accessDate = `Access date: ${new Date().toISOString().slice(0, 10)}`;
  const url = `URL: ${window.location.href}`;

  const metaData =
    [...document.querySelectorAll("title, meta, time")].map((tag) => tag.outerHTML).join("\n") +
    [...document.querySelectorAll('[class*="meta"]')].map((tag) => tag.outerHTML).join("\n") +
    [...document.querySelectorAll('[class*="author"], [class*="name"]')]
      .map((tag) => tag.outerHTML)
      .join("\n") +
    [
      ...document.querySelectorAll(
        'script[type="application/ld+json"], script[type="application/json"]'
      ),
    ]
      .map((tag) => tag.outerHTML)
      .join("\n");

  return `${accessDate}\n${url}\n${metaData}`;
}

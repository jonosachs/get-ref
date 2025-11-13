// Get URL meta data and return as combined String for processing
export function getUrlMetaData() {
  const accessDate = `Access date: ${new Date().toISOString().slice(0, 10)}`;
  const url = `URL: ${window.location.href}`;

  const selectors = [
    // Highest-value: machine-readable metadata
    'script[type="application/ld+json"]',
    'meta[name^="citation_"], meta[property^="citation_"]', // Highwire Press tags
    'meta[name^="dc."], meta[name^="DC."], meta[property^="dc:"], meta[property^="DC:"]', // Dublin Core
    'meta[name^="prism."], meta[property^="prism:"]', // PRISM
    'meta[property^="og:"], meta[name^="og:"]', // OpenGraph
    'meta[name^="twitter:"], meta[property^="twitter:"]', // Twitter Cards

    // Common explicit fields
    'meta[name="author"], meta[property="article:author"]',
    'meta[name="article:published_time"], meta[property="article:published_time"]',
    'meta[name="date"], meta[property="article:modified_time"]',
    'meta[name="publisher"], meta[property="article:publisher"]',
    'link[rel="canonical"]',

    // Page title
    "title",

    // Structured microdata/microformats
    '[itemscope][itemtype*="schema.org/Article"]',
    '[itemscope][itemtype*="schema.org/NewsArticle"]',
    '[itemscope][itemtype*="schema.org/ScholarlyArticle"]',
    '[itemprop="headline"], [itemprop="name"], [itemprop="author"], [itemprop="datePublished"]',
    '[rel="author"]',

    // Visible fallbacks (keep fairly specific to avoid noise)
    "time[datetime], time[pubdate]",
    '[class*="byline" i], [class*="author" i], [class*="posted" i], [class*="dateline" i]',
    'header [class*="meta" i], article [class*="meta" i]',

    // Last-resort hints (use sparingly downstream)
    "meta", // in case uncommon names appear
  ];

  const queryDump = document.querySelectorAll(selectors.join(","));
  const chunks = [];

  queryDump.forEach((tag) => {
    if (tag.matches('script[type="application/json"]')) {
      chunks.push(tag.textContent.trim());
    } else chunks.push(tag.outerHTML);
  });

  return `${accessDate}\n${url}\n${chunks.join("\n").replace(/\s+/g, " ", "").trim()}`;
}

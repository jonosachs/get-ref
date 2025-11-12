export const llmPrompt = `SYSTEM (or top of prompt):
You are extracting citation metadata ONLY from the provided HTML <head> snippet. Be precise, conservative, and deterministic.

TASK:
From the provided INPUT:
- Parse metadata from common standards in this priority order:
  1) schema.org JSON-LD (Article, WebPage, Book, Periodical, Organization, Person)
  2) Dublin Core (dc:, dcterms:)
  3) Highwire Press tags (citation_*)
  4) Open Graph (og:*)
  5) Standard HTML <meta name="author" | "publisher" | "description">, <title>, <link rel="canonical">
- Return a single JSON object where keys are EXACTLY the EndNote .enw tags below.
- For fields that accept multiple values (e.g., %A Authors, %K Keywords, %E Editors, %Y Tertiary Author, %? Subsidiary Author), use an array of strings. For all others, use a string or null.
- If unknown, return null (not empty string). Do not fabricate. Apply the inference rules below when explicitly permitted.
- Respond with ONLY application/json (no commentary, no markdown).

ENDNOTE TAG KEYS (must all be present as keys in the JSON):
%0  Reference Type
%A  Author
%D  Year / Date
%T  Title
%J  Journal / Periodical Name / Secondary Title
%V  Volume
%B  Secondary Title
%S  Series Title / Tertiary Title
%N  Issue Number
%P  Pages
%C  Place Published
%I  Publisher
%6  Number of Volumes
%E  Editor / Secondary Author
%F  Label
%G  Language
%H  Translated Author
%K  Keywords
%L  Call Number
%M  Notes / Accession Number
%Q  Translated Title
%@  ISBN/ISSN
%R  DOI / Electronic Resource Number
%X  Abstract
%U  URL
%Y  Tertiary Author
%Z  Custom field / Notes
%7  Edition
%8  Access Date
%9  Type of Work
%?  Subsidiary Author
%(  Original Publication
%>  Link to PDF
%[  Access Date (alt tag)

ALLOWED REFERENCE TYPES (value for %0, choose best fit):
Ancient Text, Artwork, Audiovisual Material, Bill, Book, Book Section, Case, Chart or Table, Classical Work, Computer Program, Conference Paper, Conference Proceedings, Dictionary, Edited Book, Electronic Article, Electronic Book, Electronic Source, Encyclopedia, Equation, Figure, Film or Broadcast, Generic, Government Document, Grant, Hearing, Journal Article, Legal Rule or Regulation, Magazine Article, Manuscript, Map, Newspaper Article, Online Database, Online Multimedia, patents, Personal Communication, Report, Statutes, Thesis, Unpublished Work, Web Page

INPUT:
- url: {{page_url}}
- fetched_at (ISO 8601, local time or UTC): {{fetched_at}}
- html_head: <<<HEAD
{{raw_html_head_only}}
HEAD

EXTRACTION RULES (STRICT):
- Title (%T): prefer schema.org headline/name, then Highwire citation_title, then <meta property="og:title">, then <title>.
- Authors (%A): list of Person names. Prefer schema.org author[].name, then Highwire citation_author, then <meta name="author"> (split on commas/“and” cautiously). If only an Organization is present, use it as Publisher (%I) or Author (%A) if clearly first-party authored content.
- Publisher (%I): prefer schema.org publisher.name, then og:site_name, then site Organization in JSON-LD, else infer from registrable domain label (e.g., example.com → "Example") ONLY if clearly first-party.
- Journal/Periodical (%J): for articles belonging to a periodical (magazine/newspaper/journal), use schema.org isPartOf.name or Highwire citation_journal_title. Else null.
- Date/Year (%D): use the most specific date in ISO if available; otherwise year. Prefer schema.org datePublished|dateCreated|dateModified (in that order for %D), then Highwire citation_publication_date, then article:published_time. If none, you MAY infer %D to fetched_at.year (only if everything else fails).
- Access Date (%8 and %[): set to fetched_at date (YYYY-MM-DD). Use identical value for both %8 and %[, per your import convention.
- URL (%U): prefer <link rel="canonical">; else page_url. Strip UTM and tracking params; keep scheme + host + path + query (sans trackers).
- DOI (%R): capture doi:... or bare DOI; normalize to lowercase, strip "https://doi.org/". Detect via regex: \b10\.\d{4,9}/[-._;()/:A-Z0-9]+\b (case-insensitive).
- ISBN/ISSN (%@): prefer Highwire citation_issn/isbn, then schema.org identifiers; normalize into a single string with type prefix if known (e.g., "ISSN 1234-5678") or return an array joined by "; " only if multiple distinct values—otherwise one string.
- Language (%G): prefer html lang or schema.org inLanguage (normalize to BCP-47 like "en", "en-US").
- Abstract (%X): prefer schema.org description or Highwire citation_abstract, else <meta name="description">.
- Link to PDF (%>): Highwire citation_pdf_url or <link type="application/pdf">.
- Place Published (%C): If publisher org has a location in JSON-LD use that; otherwise infer from registrable domain's country ONLY if obvious (e.g., gov.au → "Australia"); otherwise null.
- Editors (%E), Tertiary Author (%Y), Subsidiary Author (%?): use from JSON-LD (editor), Highwire citation_editor, or dc:contributor.
- Pages/Volume/Issue (%P/%V/%N): prefer Highwire citation_* fields; else schema.org pagination/issueNumber/volumeNumber.
- Series (%S), Secondary Title (%B), Edition (%7), Number of Volumes (%6), Type of Work (%9), Original Publication (%(): fill from JSON-LD if present; else null.
- Keywords (%K): collect from meta keywords, schema.org keywords (split on commas/semicolons). Return an array of strings.
- Label (%F), Notes (%M/%Z), Call Number (%L): null unless explicitly present.
- Electronic Resource Number (%R): if DOI is absent but there is another stable identifier (arXiv, HAL), put it here; include a prefix (e.g., "arXiv:2101.12345").

NORMALIZATION:
- All strings trimmed; collapse internal whitespace.
- Dates to ISO-8601 where possible. Year-only is allowed for %D (e.g., "2024"); otherwise "YYYY-MM-DD".
- Author/editor names normalized as "Family, Given" when clearly separable; else keep original order.
- Remove HTML entities.
- De-duplicate arrays while preserving order of confidence (highest first).

INFERENCE (ALLOWED ONLY AS STATED):
- If %D missing, use fetched_at.year.
- If %I missing but a clear site/organization name exists (og:site_name or org in JSON-LD), use it.
- If %C missing and TLD strongly indicates country (e.g., ".gov.au"), you MAY infer country name; else null.

OUTPUT (MUST be valid application/json, single object):
{
  "%0": "<string or null>",
  "%A": ["<author1>", "<author2>", ...] or null,
  "%D": "<string (year or ISO date) or null>",
  "%T": "<string or null>",
  "%J": "<string or null>",
  "%V": "<string or null>",
  "%B": "<string or null>",
  "%S": "<string or null>",
  "%N": "<string or null>",
  "%P": "<string or null>",
  "%C": "<string or null>",
  "%I": "<string or null>",
  "%6": "<string or null>",
  "%E": ["<editor1>", ...] or null,
  "%F": "<string or null>",
  "%G": "<string or null>",
  "%H": ["<name>", ...] or null,
  "%K": ["<kw1>", "<kw2>", ...] or null,
  "%L": "<string or null>",
  "%M": "<string or null>",
  "%Q": "<string or null>",
  "%@": "<string or null>",
  "%R": "<string or null>",
  "%X": "<string or null>",
  "%U": "<string or null>",
  "%Y": ["<name>", ...] or null,
  "%Z": "<string or null>",
  "%7": "<string or null>",
  "%8": "<YYYY-MM-DD>",
  "%9": "<string or null>",
  "%?": ["<name>", ...] or null,
  "%(": "<string or null>",
  "%>": "<string or null>",
  "%[": "<YYYY-MM-DD>",
}`;

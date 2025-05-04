import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";

// Use env for key storage
dotenv.config();

// Setup Express server to handle Gemini API call.
const app = express();
const PORT = process.env.PORT || 3000;

// Use Cross-Origin Resource Sharing to allow API requests from front-end
app.use(cors());
// Parse incoming JSON requests and make the data available via req.body
app.use(express.json());

// Get url meta data from front-end
app.post("/gemini", async (req, res) => {
  const urlMetaData = req.body.urlMetaData;

  // Log url meta data for debugging
  console.log("urlMetaData:", urlMetaData);

  if (!urlMetaData) {
    return res
      .status(400)
      .json({ error: "Missing urlMetaData in request body" });
  }

  // Provide Gemini prompt to obtain Endnote citation tags in Json format
  const geminiPrompt = `Based on the following HTML head data from a url, return a citation for this website in json format. Each citation field should be a on a separate line corresponding to the following Endnote .enw import tags:
  
  %0 Reference Type (e.g., Journal Article, Book)
  %A Author
  %D Year / Date
  %T Title
  %J Journal / Periodical Name / Secondary Title
  %V Volume
  %B Secondary Title (e.g., book title for a chapter)
  %S Series Title / Tertiary Title
  %N Issue Number
  %P Pages
  %C Place Published
  %I Publisher
  %6 Number of Volumes
  %E Editor /Secondary Author
  %F Label (Reference Label in EndNote)
  %G Language
  %H Translated Author
  %K Keywords
  %L Call Number
  %M Notes / Accession Number
  %Q Translated Title
  %@ ISBN/ISSN
  %R DOI / Electronic Resource Number
  %X Abstract
  %U URL
  %Y Tertiary Author
  %Z Custom field / Notes
  %7 Edition
  %8 Access Date
  %9 Type of Work
  %? Subsidiary Author
  %( Original Publication
  %> Link to PDF
  %[ Access Date

  If a field cannot be determined return a null value, however use logical values if appropriate, e.g. the base url for %C Place Published, company name for %A Author and/or %I Publisher, year accessed for %D Year (if these values are not confirmed elsewhere). For multiple authors, use a list of names.
  
  For Reference Type use one of the following that best matches the content type: Ancient Text, Artwork, Audiovisual Material, Bill, Book, Book Section, Case, Chart or Table, Classical Work, Computer Program, Conference Paper, Conference Proceedings, Dictionary, Edited Book, Electronic Article, Electronic Book, Electronic Source, Encyclopedia, Equation, Figure, Film or Broadcast, Generic, Government Document, Grant, Hearing, Journal Article, Legal Rule or Regulation, Magazine Article, Manuscript, Map, Newspaper Article, Online Database, Online Multimedia, patents, Personal Communication, Report, Statutes, Thesis, Unpublished Work, Web Page.
  
  Do not use simulated data. Do not include any comments or markdown in your response, just return the json data.
 
  ${urlMetaData}`;

  // Make Gemini API POST request with prompt
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({
          contents: [{ parts: [{ text: geminiPrompt }] }],
        }),
      }
    );

    // Obtain and format Gemini reponse data
    const data = await response.json();
    const citationText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    // Clean response data to provide valid Json
    let cleaned = citationText
      .replace("\n", "")
      .replace("\\", "")
      .replace(/^.*?(?=\{)/s, "")
      .replace(/(?<=\})([\s\S]*)$/, "");

    // Log cleaned response for debugging
    console.log("Cleaned Gemini response:", cleaned);

    const jsonFormat = JSON.parse(cleaned);
    return res.json(jsonFormat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Gemini API" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

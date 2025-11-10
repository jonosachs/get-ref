export const llmPrompt = `Based on the following HTML head data from a url, return a citation for this website in json format. Each citation field should be a on a separate line corresponding to the following Endnote .enw import tags:
  
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
  
  Do not use simulated data. Do not include any comments or markdown in your response, just return the json data.`;

// Make POST request to local back-end server with url meta data
export async function postMetaData(urlMetaData) {
  const errorBar = document.getElementById("errorBar");
  const proxyUrl = "http://localhost:3000/gemini";

  try {
    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urlMetaData: urlMetaData }),
    });

    if (!response.ok) {
      return response
        .status(response.status)
        .json({ error: "Failed to fetch data from local server." });
    }

    return await response.status(200).json();
  } catch (err) {
    return response.status(500).json({ error: "Failed to fetch data from local server." });
  }
}

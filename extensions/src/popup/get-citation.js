// Make POST request to local back-end server with url meta data
export async function getCitationFromServer(apiPath, urlMetaData) {
  try {
    const response = await fetch(apiPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urlMetaData: urlMetaData }),
    });

    return await response.json();
  } catch (err) {
    throw new Error(`Failed to fetch data from local server. ${err.message}`);
  }
}

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

    if (!response.ok) {
      throw new Error(`Failed to fetch data from local server. ${response.statusText}`);
    }

    return await response.status(200).json();
  } catch (err) {
    throw new Error(`Failed to fetch data from local server. ${err.message}`);
  }
}

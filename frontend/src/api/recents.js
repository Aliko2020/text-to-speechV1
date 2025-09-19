export async function fetchRecentAudio(token, apiUrl) {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch recent audio");
    }
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

const BASE_URL = "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(response, defaultMessage) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error("API Error:", data);

    if (typeof data.detail === "string") {
      throw new Error(data.detail);
    }

    if (data.detail?.message) {
      throw new Error(data.detail.message);
    }

    throw new Error(defaultMessage);
  }

  return data;
}

export async function generateRecommendations(payload) {
  const response = await fetch(
    `${BASE_URL}/recommend-resources-llm`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }
  );

  return handleResponse(response, "Failed to generate recommendations");
}
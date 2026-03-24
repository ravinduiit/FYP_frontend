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
    console.error("API Error Response:", data);

    if (typeof data.detail === "string") {
      throw new Error(data.detail);
    }

    if (data.detail?.message) {
      throw new Error(data.detail.message);
    }

    if (typeof data.message === "string") {
      throw new Error(data.message);
    }

    throw new Error(defaultMessage);
  }

  return data;
}

export async function generateCommentQA(payload) {
  const response = await fetch(`${BASE_URL}/api/v1/comment-qa`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse(response, "Failed to generate comment Q&A");
}
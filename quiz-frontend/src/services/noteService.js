const BASE_URL = "http://127.0.0.1:8000";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("You must be logged in first");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
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

export async function generateNotes(payload) {
  console.log("hhiiiiiii ")
  const response = await fetch(`${BASE_URL}/api/v1/generate_notes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await response.json();

  console.log("Full response data:", data);
  return handleResponse(response, "Failed to generate notes");
}

export async function getPdfPreviewBlobUrl(videoId, userLevel) {
  console.log("byeeeeee ");
  const response = await fetch(`${BASE_URL}/api/v1/download-pdf`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      video_id: videoId,
      user_level: userLevel,
    }),
  });
  
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    if (typeof data.detail === "string") {
      throw new Error(data.detail);
    }

    if (data.detail?.message) {
      throw new Error(data.detail.message);
    }

    throw new Error("Failed to load PDF preview");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
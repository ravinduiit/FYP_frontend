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

export async function generateQuiz(url) {
  const response = await fetch(`${BASE_URL}/transcript/process`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ url }),
  });

  return handleResponse(
    response,
    "Failed to extract the transcript from that YouTube link"
  );
}

export async function generateQuizByVideo(videoId) {
  const response = await fetch(`${BASE_URL}/quiz/generate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      video_id: videoId,
      difficulty: "hard",
      count: 10,
    }),
  });

  return handleResponse(response, "Failed to generate quiz");
}

export async function predictUserLevel(score, timeSpentSeconds) {
  const response = await fetch(`${BASE_URL}/api/v1/predict-level`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      score: score,
      time_spent: timeSpentSeconds,
    }),
  });

  return handleResponse(response, "Failed to predict level");
}
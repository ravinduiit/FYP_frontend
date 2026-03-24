const BASE_URL = "http://127.0.0.1:8000/api/v1/auth";

async function handleResponse(res, defaultMessage) {
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.detail || defaultMessage);
  }

  return data;
}

export async function registerUser(data) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res, "Registration failed");
}

export async function loginUser(data) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res, "Login failed");
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse(res, "Failed to fetch current user");
}
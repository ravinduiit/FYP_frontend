export function saveAuthData(data) {
  localStorage.setItem("token", data.access_token);
  localStorage.setItem(
    "user",
    JSON.stringify({
      username: data.username,
      role: data.role,
    })
  );
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}
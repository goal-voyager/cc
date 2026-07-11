// Works out where the backend API lives, without needing manual URL edits.
// 1. Plain localhost -> http://localhost:5000
// 2. GitHub Codespaces (*.app.github.dev / *.github.dev) -> same hostname
//    as the frontend, with the port swapped for 5000 (where the backend
//    runs). The backend's port MUST be set to "Public" in the Ports tab.
// 3. Anywhere else (your live Netlify/Vercel site) -> the deployed Render
//    URL below. Update this after finishing the deployment steps in README.
const RENDER_API_URL = "https://your-app.onrender.com/api";

function computeApiBase() {
  const { hostname, protocol } = window.location;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5000/api";
  }

  if (hostname.endsWith(".app.github.dev") || hostname.endsWith(".github.dev")) {
    const backendHost = hostname.replace(/\d+(?=\.(app\.)?github\.dev$)/, "5000");
    return `${protocol}//${backendHost}/api`;
  }

  return RENDER_API_URL;
}

export const API_BASE = computeApiBase();

function authHeaders() {
  const token = localStorage.getItem("cc_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Something went wrong");
  return body;
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers: { ...authHeaders() } });
  return handle(res);
}

export async function apiPost(path, data) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data)
  });
  return handle(res);
}

export async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: { ...authHeaders() }
  });
  return handle(res);
}

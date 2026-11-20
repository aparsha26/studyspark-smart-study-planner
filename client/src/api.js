const API = "http://localhost:5001/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("studyToken");

  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("studyToken");
      localStorage.removeItem("studyUser");
      if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
        window.location.href = "/login";
      }
    }
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export default apiRequest;

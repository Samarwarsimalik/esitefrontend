const API = "https://esitebackend.onrender.com/api";

export const apiFetch = (url, options = {}) => {
  return fetch(`${API}${url}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
};
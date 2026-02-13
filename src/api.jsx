const API = "http://localhost:5000/api";


export const apiFetch = (url, options = {}) =>
fetch(`${API}${url}`, {
credentials: "include",
headers: { "Content-Type": "application/json" },
...options,
});
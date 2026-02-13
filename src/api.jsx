const API = "https://esitebackend.onrender.com/api";


export const apiFetch = (url, options = {}) =>
fetch(`${API}${url}`, {
credentials: "include",
headers: { "Content-Type": "application/json" },
...options,
});
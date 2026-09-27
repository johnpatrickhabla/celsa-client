import axios from "axios";

// Points at the separate Express backend (see /server).
// Set NEXT_PUBLIC_API_URL in .env.local, e.g. http://localhost:5000/api
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
  withCredentials: true, // needed for the httpOnly refresh-token cookie
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("celsa_access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

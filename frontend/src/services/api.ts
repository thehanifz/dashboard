import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "https://8000.thehanifz.fun",
  timeout: 15000,
});

export default api;

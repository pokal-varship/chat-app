import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL || "https://chat-app-79n0.onrender.com",
  withCredentials: true, // send cookies with the request
});

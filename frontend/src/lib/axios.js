import axios from "axios";
import { getStoredToken } from "./utils";

const BASE_URL = import.meta.env.MODE === "development" 
  ? "http://localhost:5001/api" 
  : "https://chat-app-79n0.onrender.com/api";

// Create a single Axios instance
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // withCredentials: true, // send cookies with the request
 headers:  {Authorization: `Bearer ${getStoredToken()}` }
});

// Add a request interceptor to set the token
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = getStoredToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );


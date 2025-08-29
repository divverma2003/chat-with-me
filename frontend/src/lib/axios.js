import axios from "axios";

// file to link our frontend with the backend
export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true, // send cookies with every request
});

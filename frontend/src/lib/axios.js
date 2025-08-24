import axios from "axios";

// file to link our frontend with the backend
export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true, // send cookies with every request
});

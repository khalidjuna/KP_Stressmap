import axios from "axios";

import { hostname } from "../consts.jsx";

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = hostname;

axiosInstance.interceptors.request.use(async (request) => {
  const token = localStorage.getItem("token");
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});
axiosInstance.interceptors.response.use(
  async (response) => {
    // 100 - 200 - 300
    return {
      success: true,
      data: response?.data,
      headers: response?.headers || {},
      status: response?.status || null,
      message: "OK",
    };
  },
  async (error) => {
    // 400 - 500
    const message = error?.message;
    const response = error.response;
    const data = error?.response?.data;
    return {
      success: false,
      data,
      headers: response?.headers || {},
      status: response?.status || null,
      message: message || response?.statusText || null,
    };
  }
);

export default axiosInstance;

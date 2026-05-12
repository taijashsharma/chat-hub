import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN SENT:", token); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("AUTH HEADER:", config.headers.Authorization);

  return config;
});

// response interceptor (AUTO LOGOUT ON 403)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("API ERROR:", err.response?.status);

    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }

    if (err.response?.status === 403) {
      console.warn("Forbidden - check backend logic" + err.response.data);
    }

    return Promise.reject(err);
  }
);

export default API;
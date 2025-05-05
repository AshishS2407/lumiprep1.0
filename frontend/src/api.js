// src/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/", // Replace with your backend URL
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api`
    : "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

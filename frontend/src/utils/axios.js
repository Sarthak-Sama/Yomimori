import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  // baseURL: "https://yomimori.onrender.com",
  headers: {
    accept: "application/json",
  },
  withCredentials: true, // Ensures cookies are sent with the request
});

export default instance;

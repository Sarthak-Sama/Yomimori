import axios from "axios";

const instance = axios.create({
  //   baseURL: "https://codetracker-backend-fc9r.onrender.com/",
  baseURL: "https://yomimori.onrender.com",
  headers: {
    accept: "application/json",
  },
  withCredentials: true, // Ensures cookies are sent with the request
});

export default instance;

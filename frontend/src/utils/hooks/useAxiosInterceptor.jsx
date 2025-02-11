import { useEffect } from "react";
import axios from "../axios";
import { useAuth } from "@clerk/clerk-react";

const useAxiosInterceptor = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      async (config) => {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [getToken]);
};

export default useAxiosInterceptor;

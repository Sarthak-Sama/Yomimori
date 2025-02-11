// components/AdminRoute.js
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "../utils/axios";

const AdminRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const response = await axios.get("/api/check-admin", {
          withCredentials: true, // ensures cookies are sent with the request
        });
        // Assuming your endpoint returns an object with { isAdmin: true/false }
        setIsAdmin(response.data.isAdmin);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminStatus();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If the user is not an admin, redirect to the homepage
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;

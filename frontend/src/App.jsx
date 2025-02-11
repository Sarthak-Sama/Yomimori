import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import AdminPanel from "./pages/AdminPanel";
import AdminRoute from "./components/AdminRoute";
import ReadingPage from "./pages/ReadingPage";
import { SignIn } from "@clerk/clerk-react";
import useAxiosInterceptor from "./utils/hooks/useAxiosInterceptor";
function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginBoxVisible, setIsLoginBoxVisible] = useState(false);

  // Set up Axios interceptor
  useAxiosInterceptor();

  return (
    <div className="w-screen h-screen bg-[#fcf4e7] text-[#2D2E26] relative">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
        <Route path="/read/:id" element={<ReadingPage />} />
      </Routes>

      {/* Navbar overlay to close menu */}
      <div
        onClick={() => setIsOpen(false)}
        className={`${
          isOpen ? "block" : "hidden"
        } absolute top-0 left-0 w-screen h-screen bg-black/20`}
      />

      <Navbar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setIsLoginBoxVisible={setIsLoginBoxVisible}
      />

      {/* Login modal */}
      {isLoginBoxVisible && (
        <div
          onClick={() => setIsLoginBoxVisible(false)}
          className="absolute top-0 left-0 w-screen h-screen bg-black/20 flex items-center justify-center"
        >
          <div onClick={(e) => e.stopPropagation()}>
            <SignIn withSignUp={true} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

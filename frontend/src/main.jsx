import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";
import Context from "./Context/Context.jsx";
import App from "./App.jsx";
import { SkeletonTheme } from "react-loading-skeleton";

// Import Clerk's Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <Context>
      <Router>
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
          <App />
        </SkeletonTheme>
      </Router>
    </Context>
  </ClerkProvider>
);

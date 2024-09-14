import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./Router";
import "./index.css";

import { RouterProvider } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Toaster position="top-right" reverseOrder={false} /> // Toaster
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

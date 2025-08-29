import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

// Custom components
import Navbar from "./components/Navbar";

// Pages
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import BeforeVerifyPage from "./pages/BeforeVerifyPage";

// External components
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsersArray } =
    useAuthStore();

  const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });
  // Show loader if checking auth (while we verify if user is authenticated)
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-8 animate-spin" />
      </div>
    );
  }
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              authUser.isVerified ? (
                <HomePage />
              ) : (
                <BeforeVerifyPage />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/register"
          element={
            !authUser ? (
              <RegisterPage />
            ) : authUser.isVerified ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/before-verify" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            !authUser ? (
              <LoginPage />
            ) : authUser.isVerified ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/before-verify" replace />
            )
          }
        />
        <Route
          path="/before-verify"
          element={
            authUser && authUser.isVerified ? (
              <Navigate to="/" replace />
            ) : (
              <BeforeVerifyPage />
            )
          }
        />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={
            authUser && authUser.isVerified ? (
              <ProfilePage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}
export default App;

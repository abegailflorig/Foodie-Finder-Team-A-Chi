import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { supabase } from "./lib/supabaseClient";
import { useEffect, useState } from "react";
import LoadingPage from "./pages/LoadingPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import DetailsPage from "./pages/DetailsPage";
import FeedbackPage from "./pages/FeedbackPage";
import ResFeedback from "./pages/ResFeedback";
import CategoriesPage from "./pages/CategoriesPage";
import LocationPage from "./pages/LocationPage";
import Cupsilog from "./restaurant/Cupsilog";
import FavoritePage from "./pages/FavoritePage";
import ProfilePage from "./pages/ProfilePage";

// Protected Route Component
function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <LoadingPage />;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

// Public Route Component for Login/Signup
function PublicRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <LoadingPage />;

  // If already logged in, redirect to homepage
  if (user) return <Navigate to="/homepage" replace />;

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Initial Loading */}
        <Route
          path="/"
          element={
            <LoadingPage />
          }
        />

        {/* Landing Page */}
        <Route
          path="/landing"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        {/* Login / Signup */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/homepage"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detailspage"
          element={
            <ProtectedRoute>
              <DetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedbackpage"
          element={
            <ProtectedRoute>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resfeedback"
          element={
            <ProtectedRoute>
              <ResFeedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categoriespage"
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/locationpage"
          element={
            <ProtectedRoute>
              <LocationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cupsilog"
          element={
            <ProtectedRoute>
              <Cupsilog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favoritepage"
          element={
            <ProtectedRoute>
              <FavoritePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profilepage"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

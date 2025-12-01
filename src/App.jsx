import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { supabase } from "./lib/supabaseClient";
import { useEffect, useState } from "react";

// Pages
import LoadingPage from "./pages/LoadingPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import DetailsPage from "./pages/DetailsPage";
import CategoriesPage from "./pages/CategoriesPage";
import LocationPage from "./pages/LocationPage";
import RestaurantPage from "./pages/RestaurantPage"; // Formerly Cupsilog
import FeedbackPage from "./pages/FeedbackPage"; // Reviews
import FavoritePage from "./pages/FavoritePage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./admin/AdminPage";

// 🔒 USER Protected Route
function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) return <LoadingPage />;
  if (!user) return <Navigate to="/landing" replace />;

  return children;
}

// 🔒 ADMIN Protected Route
function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();
      setProfile(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <LoadingPage />;
  if (!profile) return <Navigate to="/landing" replace />;
  if (profile.role !== "admin") return <Navigate to="/homepage" replace />;

  return children;
}

// 👤 Public Route (Login/Signup)
function PublicRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) return <LoadingPage />;
  if (user) return <Navigate to="/homepage" replace />;

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Public */}
        <Route path="/" element={<LoadingPage />} />
        <Route path="/landing" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

        {/* User Protected Routes */}
        <Route path="/homepage" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/details/:id" element={<ProtectedRoute><DetailsPage /></ProtectedRoute>} />
        <Route path="/categoriespage" element={<ProtectedRoute><CategoriesPage /></ProtectedRoute>} />
        <Route path="/locationpage" element={<ProtectedRoute><LocationPage /></ProtectedRoute>} />
        <Route path="/restaurant/:id" element={<ProtectedRoute><RestaurantPage /></ProtectedRoute>} />
        <Route path="/restaurant/:id/feedback" element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
        <Route path="/favoritepage" element={<ProtectedRoute><FavoritePage /></ProtectedRoute>} />
        <Route path="/profilepage" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/adminpage" element={<AdminRoute><AdminPage /></AdminRoute>} />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

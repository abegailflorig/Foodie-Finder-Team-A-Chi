import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { supabase } from "../lib/supabaseClient";
import LoadingPage from "../pages/LoadingPage";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || !data) {
        setUserRole(null);
      } else {
        setUserRole(data.role);
      }

      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return <LoadingPage />; // Show loading until role is confirmed
  if (!userRole) return <Navigate to="/landing" replace />;

  // Only allow 'user' role
  if (userRole !== "user") return <Navigate to="/adminpage" replace />;

  return <>{children}</>; // Render children only if user role = 'user'
}

export default ProtectedRoute;

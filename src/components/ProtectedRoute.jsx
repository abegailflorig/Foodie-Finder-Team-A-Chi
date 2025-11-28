import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { supabase } from "../lib/supabaseClient";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession(); // v2 method
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    fetchUser();

    // Listen for auth changes (login/logout)
    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>; // show while checking session
  if (!user) return <Navigate to="/login" replace />; // redirect if not logged in

  return children;
}

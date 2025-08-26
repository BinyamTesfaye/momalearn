// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async (uid) => {
    if (!uid) {
      setProfile(null);
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name, email, role, profile_image")
        .eq("id", uid)
        .maybeSingle(); // safer than .single()

      if (error) {
        console.error("fetchProfile error:", error);
        setProfile(null);
        return null;
      }
      setProfile(data ?? null);
      return data ?? null;
    } catch (err) {
      console.error("Error in fetchProfile:", err);
      setProfile(null);
      return null;
    }
  };

  useEffect(() => {
  let mounted = true;
  let uiTimeoutId = null;

  const initAuth = async () => {
    const start = performance.now?.() ?? Date.now();
    console.log("[initAuth] start:", start);

    // Start the real getSession promise
    const getSessionPromise = supabase.auth.getSession();

    // Start a UI-only timeout (won't cancel getSession)
    uiTimeoutId = setTimeout(() => {
      if (!mounted) return;
      const now = performance.now?.() ?? Date.now();
      console.warn(`[initAuth] UI timeout after ${Math.round((now - start)/1000)}s — not cancelling auth request.`);
      // Important: DON'T set user/profile to null or throw here.
      // Just let the UI know we stopped waiting and keep listening for auth events.
      setLoading(false);
      // Optionally set a non-fatal warning (not an error)
      setError("Still checking auth status — continuing in background");
    }, 15000);

    try {
      // Await the session, but this can come later than the UI timeout.
      const sessionRes = await getSessionPromise;
      console.log("[initAuth] getSession resolved:", sessionRes);

      const sessionUser = sessionRes?.data?.session?.user ?? null;
      if (!mounted) return;

      setUser(sessionUser);
      if (sessionUser) {
        await fetchProfile(sessionUser.id);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("[initAuth] getSession error:", err);
      if (mounted) {
        setError(err?.message ?? String(err));
        setUser(null);
        setProfile(null);
      }
    } finally {
      if (mounted) {
        clearTimeout(uiTimeoutId);
        setLoading(false);
        // If we previously set a non-fatal error on timeout, consider clearing it now
        // setError(null);
      }
    }
  };

  initAuth();

  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    console.log("[onAuthStateChange]", event, session);
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    if (currentUser) fetchProfile(currentUser.id).catch(e => console.error('fetchProfile after auth event', e));
    else setProfile(null);
  });

  const subscription = data?.subscription;
  return () => {
    mounted = false;
    clearTimeout(uiTimeoutId);
    subscription?.unsubscribe();
  };
}, []);

  // Signup: don't assume immediate sign-in (email confirm flows)
  const signup = async ({ email, password, full_name, role = "student" }) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp(
        { email, password },
        { data: { role, full_name } }
      );

      if (error) throw error;

      // Some projects require email confirmation; user might not be signed in yet.
      const newUser = data?.user ?? null;

      if (newUser) {
        const { error: profileError } = await supabase
          .from("users")
          .insert([
            {
              id: newUser.id,
              email,
              full_name,
              role,
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) throw profileError;

        await fetchProfile(newUser.id);
      } else {
        // No immediate user (confirmation required). Don't fail — inform caller.
        console.warn("Signup did not return immediate user; confirmation may be required.");
      }

      return newUser;
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message ?? String(err));
      throw err;
    }
  };

  const login = async ({ email, password }) => {
    try {
      setError(null);
      // DON'T add timeout wrapper here (race conditions). Let supabase handle the response.
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error from supabase:", error);
        setError(error.message ?? String(error));
        throw error;
      }

      if (data?.user) {
        await fetchProfile(data.user.id);
      }

      return data?.user ?? null;
    } catch (err) {
      console.error("Login error (caught):", err);
      setError(err.message ?? String(err));
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      // avoid timeout wrapper here as well
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error from supabase:", error);
        setError(error.message ?? String(error));
        throw error;
      }
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error("Logout error (caught):", err);
      setError(err.message ?? String(err));
      throw err;
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    profile,
    loading,
    error,
    signup,
    login,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

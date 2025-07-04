import express from "express";
import { createClient } from "@supabase/supabase-js";

// ✅ Debug log to verify environment variables are loaded
console.log("🔍 ENV CHECK:", {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 8) + "..."
});

// ✅ Create router
const router = express.Router();

// ✅ Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ Route: GET /api/stats/users
router.get("/users", async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    res.json({ totalUsers: count });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ error: "Failed to fetch user count" });
  }
});

// ✅ Route: GET /api/stats/forms
router.get("/forms", async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("forms")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    res.json({ activeForms: count });
  } catch (err) {
    console.error("Error fetching forms:", err.message);
    res.status(500).json({ error: "Failed to fetch form count" });
  }
});

// ✅ Route: GET /api/stats/entries
router.get("/entries", async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("entries")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    res.json({ submissions: count });
  } catch (err) {
    console.error("Error fetching submissions:", err.message);
    res.status(500).json({ error: "Failed to fetch submission count" });
  }
});

// ✅ Route: GET /api/stats/pending-reviews
router.get("/pending-reviews", async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("entries")
      .select("*", { count: "exact", head: true })
      .eq("reported", true);

    if (error) throw error;
    res.json({ pendingReviews: count });
  } catch (err) {
    console.error("Error fetching reviews:", err.message);
    res.status(500).json({ error: "Failed to fetch pending reviews" });
  }
});

export default router;

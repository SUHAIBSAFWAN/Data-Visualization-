import express from "express";
import { createClient } from "@supabase/supabase-js";

console.log("📥 users.mjs loaded");

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ GET /api/users — Fetch all users
router.get("/", async (req, res) => {
  console.log("📤 GET /api/users");

  const { data, error } = await supabase.from("users").select("id, name, email, role");

  if (error) {
    console.error("❌ Error fetching users:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }

  console.log(`✅ Retrieved ${data.length} user(s)`);
  res.json({ users: data });
});

export default router;

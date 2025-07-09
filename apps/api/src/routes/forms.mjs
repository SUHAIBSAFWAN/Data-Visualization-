import express from "express";
import { createClient } from "@supabase/supabase-js";

console.log("📥 forms.mjs loaded");

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ POST /api/forms/create — create a new form
router.post("/create", async (req, res) => {
  console.log("📨 Received POST /create with body:", req.body);
  console.log("🧠 x-user-id:", req.headers["x-user-id"]);

  const { name, fields } = req.body;
  const created_by = req.headers["x-user-id"];

  if (!name || !Array.isArray(fields) || !created_by) {
    console.warn("⚠️ Missing data in request");
    return res.status(400).json({ error: "Missing data" });
  }

  const { error } = await supabase.from("forms").insert([{ name, fields, created_by }]);

  if (error) {
    console.error("❌ Insert error:", error);
    return res.status(500).json({ error: "Failed to create form" });
  }

  console.log("✅ Form inserted successfully!");
  res.json({ message: "Form created successfully!" });
});

// ✅ GET /api/forms — fetch all forms
router.get("/", async (req, res) => {
  console.log("📤 Received GET /api/forms");

  const { data, error } = await supabase.from("forms").select("*");

  if (error) {
    console.error("❌ Error fetching forms:", error);
    return res.status(500).json({ error: "Failed to fetch forms" });
  }

  console.log(`✅ Retrieved ${data.length} form(s)`);
  res.json({ forms: data });
});

// ✅ NEW: GET /api/forms/entries — fetch all submitted entries
router.get("/entries", async (req, res) => {
  console.log("📤 Received GET /api/forms/entries");

  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error fetching entries:", error.message);
    return res.status(500).json({ error: "Failed to fetch entries" });
  }

  console.log(`✅ Retrieved ${data.length} entries`);
  res.json({ entries: data });
});

export default router;

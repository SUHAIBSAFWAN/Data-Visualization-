import express from "express";
import { createClient } from "@supabase/supabase-js";

console.log("📥 forms.mjs loaded"); // ✅ Confirm file is loaded

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ POST /api/forms/create
router.post("/create", async (req, res) => {
  console.log("📨 Received POST /create with body:", req.body); // ✅ Log incoming data
  console.log("🧠 x-user-id:", req.headers["x-user-id"]); // ✅ Confirm header

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

export default router;

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, fields } = req.body;

  const userId = req.headers["x-user-id"] || "admin-id"; // Replace this in real app

  const { error } = await supabase.from("forms").insert([
    {
      name,
      fields,
      created_by: userId,
    },
  ]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ message: "Form created" });
}

// ✅ MUST BE AT THE TOP
import 'dotenv/config'; // no need to use fileURLToPath or path anymore

import express from "express";
import cors from "cors";
import statsRoutes from "./routes/stats.mjs";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

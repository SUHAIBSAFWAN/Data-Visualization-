// ✅ MUST BE AT THE TOP
import 'dotenv/config';

import express from "express";
import cors from "cors";
import statsRoutes from "./routes/stats.mjs";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Enable CORS
app.use(cors());

// ✅ Body parser
app.use(express.json());

// ✅ API Routes
app.use("/api/stats", statsRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

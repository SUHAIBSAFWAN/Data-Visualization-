import "dotenv/config";
import express from "express";
import cors from "cors";
import statsRoutes from "./routes/stats.mjs";
import formsRoutes from "./routes/forms.mjs"; // ✅ New import

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/stats", statsRoutes);
app.use("/api/forms", formsRoutes); // ✅ Mount route

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

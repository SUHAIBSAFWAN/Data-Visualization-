import "dotenv/config";
import express from "express";
import cors from "cors";

// ✅ Define app BEFORE importing routes
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Now import routes AFTER app is defined
import statsRoutes from "./routes/stats.mjs";
import formsRoutes from "./routes/forms.mjs";
import usersRoutes from "./routes/users.mjs"; // ✅ Added for Manage Users

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/api/stats", statsRoutes);
app.use("/api/forms", formsRoutes);
app.use("/api/users", usersRoutes); // ✅ Mounting here works now

// ✅ Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

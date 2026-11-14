
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL
}));

app.use(express.json());

app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300
}));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    app: "StudySpark API"
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Task routes
app.use("/api/tasks", taskRoutes);

// Not found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

export default app;

//Express application configure karta hai, middleware aur API routes handle karta hai.
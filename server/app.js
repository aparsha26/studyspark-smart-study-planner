import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: false
}));

app.use(cors({
  origin: [process.env.CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"].filter(Boolean)
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

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;

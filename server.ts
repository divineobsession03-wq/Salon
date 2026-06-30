import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import { createServer as createViteServer } from "vite";

// Import Routes Statically
import { authRoutes } from "./src/server/routes/authRoutes";
import { serviceRoutes } from "./src/server/routes/serviceRoutes";
import { bookingRoutes } from "./src/server/routes/bookingRoutes";
import { notificationRoutes } from "./src/server/routes/notificationRoutes";

// Initialize Environment Variables manually or via dotenv if needed
// Note: AI Studio injects process.env variables from secrets automatically.

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // Connect to MongoDB
  const MONGO_URI = process.env.MONGO_URI;
  if (MONGO_URI) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
    }
  } else {
    console.warn("MONGO_URI not found in environment variables. Running in mock/disconnected mode.");
  }

  // --- API Routes ---
  const apiRouter = express.Router();
  
  apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Heenuvanshii Salon Studio API is running." });
  });

  apiRouter.use("/auth", authRoutes);
  apiRouter.use("/services", serviceRoutes);
  apiRouter.use("/bookings", bookingRoutes);
  apiRouter.use("/notifications", notificationRoutes);

  app.use("/api", apiRouter);

  // --- Vite Middleware (Development) or Static Serve (Production) ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

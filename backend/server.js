import "dotenv/config";

import express from "express";
import cors from "cors";
import multer from "multer";

import db from "./config/db.js";
import projectRoutes from "./routes/projectroute.js";
import walkthroughRoutes from "./routes/walkthroughroute.js";
import newsRoutes from "./routes/newsroute.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {}; // You can add options here if needed
app.use(cors(corsOptions));      
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('🚀 Server is running');
});

// 👉 Project routes
app.use('/adrien/projects', projectRoutes);
app.use('/adrien/walkthrough', walkthroughRoutes);
app.use('/adrien/news/', newsRoutes);

// Upload / request error handler (must be after routes)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message: "Upload too large. Please reduce file size.",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(413).json({
        message: "Too many files selected. Please reduce the number of files.",
      });
    }
    return res.status(400).json({
      message: "Invalid upload. Please check file type/limits and try again.",
    });
  }

  if (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }

  return next();
});

// Connect DB and start the server
const startServer = db()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT} ✅`);
    });
  })
  .catch((error) => {
    console.error('❌ Server failed to start:', error.message);
    process.exit(1);
  });

import "dotenv/config";

import express from "express";
import cors from "cors";

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

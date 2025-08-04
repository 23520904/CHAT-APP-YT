import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import path from "path";
import { app, server } from "./socket/socket.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Parse incoming request with JSON payload
app.use(cookieParser()); // Parse cookies from request header
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist"))); // Serve static files from frontend/dist
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html")); //Route catch-all (*) để hỗ trợ client-side routing (SPA)
});

server.listen(PORT, () => {
    
  console.log(`Server is running on PORT: ${PORT}`);
  connectToMongoDB();
});

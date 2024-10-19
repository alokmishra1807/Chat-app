import path from "path";
import express from "express";
import dotenv from "dotenv";

import authRoutes from './routes/auth.routes.js'; 
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js';

import connectToMongoose from "./db/connectToMongoose.js";
import cookieparser from 'cookie-parser';

import { app, server } from "./Soket/soket.js";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Resolve __dirname for ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 5001;

// Set up middlewares
app.use(express.json());
app.use(cookieparser());

// Route middlewares
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);

// Serve static files from the frontend folder (adjusted path)
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// For all other routes, serve the frontend index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

// Start the server
server.listen(PORT, () => {
    connectToMongoose();
    console.log(`Server running on port ${PORT}`);
});

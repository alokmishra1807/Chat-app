import express from "express";
import dotenv from "dotenv";

import authRoutes from './routes/auth.routes.js'; 
import messageRoutes from './routes/message.routes.js';
import userRoutes from './routes/user.routes.js'

import connectToMongoose from "./db/connectToMongoose.js";
import cookieparser from 'cookie-parser'
const app = express();

dotenv.config();

const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieparser());

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);

connectToMongoose();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

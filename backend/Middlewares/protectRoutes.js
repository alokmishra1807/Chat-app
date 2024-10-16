import jwt from "jsonwebtoken";
import User from "../Models/user.modal.js";

const protectRoutes = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unautherized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unautherized" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Invalid User" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in middlewares controller:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectRoutes
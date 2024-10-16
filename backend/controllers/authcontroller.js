import { error } from "console";
import { response } from "express";
import User from "../Models/user.modal.js";
import bcrypt from "bcrypt";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmedPassword, gender } = req.body;

    if (password !== confirmedPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 10);

    const boyProfile = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfile = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "Male" ? boyProfile : girlProfile,
    });

    if (newUser) {
 generateTokenAndSetCookie(newUser._id,res)

      await newUser.save();
      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilepic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ error: "Invalid User Data" });
    }
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
 try {
    const {username,password}  = req.body;
const user = await User.findOne({username});
const IscorrectPassword = await bcrypt.compare(password,user?.password || "")
if(!user || !IscorrectPassword){
    return res.status(400).json({ error: "Invalid Username/Password" });
}

generateTokenAndSetCookie(user._id,res)


return res.status(201).json({
  _id: user._id,
  fullName: user.fullName,
  username: user.username,
  profilepic: user.profilePic,
});

 } catch (error) {
    console.log("Error in signin controller:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
 }
};

export const logout = async (req, res) => {
 try {
res.cookie("jwt","",{maxAge:0});
res.status(200).json({message:"Logged Out successfully"})
    
 } catch (error) {
    console.log("Error in logout controller:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
 }
}; 

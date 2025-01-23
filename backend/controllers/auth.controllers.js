import User from "../models/user.models.js";
import bcrypt from 'bcryptjs';
import { generateTokenAndSetCookie } from "../utils/generate.auth.token.js";

export const register = async (req, res) => {
  const { fullName, email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if(existingUser){
      return res.status(400).json({ message: 'User already exists' });
    };
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ fullName, email, username, password : hashedPassword });
    await user.save();
    return res.status(200).json({ message : 'User created successfully' });
  } catch (error) {
    console.error(error.messsage);
    return res.status(500).json({ message : 'Server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } =req.body;
  try {
    const user = await User.findOne({ email });
    if(!user){
      return res.status(404).json({ message : "User not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
      return res.status(403).json({ message : "Incorrect password" });
    };
    generateTokenAndSetCookie(res, user._id);
    return res.status(200).json({ message : "Login successful" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message : "Server error" });
  } 
}
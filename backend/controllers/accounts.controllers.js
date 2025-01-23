import User from "../models/user.models.js";
import { Wallet } from '../models/account.models.js'
import bcrypt from 'bcryptjs';
import { generateWalletAddress } from "../utils/generate.wallet.address.js";
import { generateWalletName } from "../utils/generate.wallet.name.js";

export const createWallet = async (req, res) => {
  const { walletName, walletPIN } = req.body;
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if(!user) return res.status(404).json({ message : "User not found" });
    if(!walletName){
      walletName === generateWalletName();
    };
    const existingWallet = await Wallet.findOne({ user : userId });
    if(existingWallet) return res.status(400).json({ message : "Wallet already exists" });
    const walletAddress = generateWalletAddress();
    const hashedPIN = await bcrypt.hash(walletPIN, 20)
    const wallet = new Wallet({ walletName, walletPIN : hashedPIN, address : walletAddress, user : user._id });
    await wallet.save();
    return res.status(200).json({ message : "Wallet saved successfully", wallet });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message : "Server error" });
  }
};

export const getWallet = async (req, res) => {
  const userId = req.userId;
  const { walletPIN } = req.body;
  try {
    const wallet = await Wallet.findOne({ user : userId });
    if(!wallet){
      return res.status(404).json({ message : "Wallet not found" });
    };
    const isPINValid = bcrypt.compare(walletPIN, wallet.walletPIN);
    if(!isPINValid){
      return res.status(403).json({ message : "Incorrect PIN" })
    }
    return res.status(200).json({ wallet })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message : "Server error" })
  }
};
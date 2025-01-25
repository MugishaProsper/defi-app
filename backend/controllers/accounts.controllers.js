import User from "../models/user.models.js";
import { Wallet, Account } from '../models/account.models.js'
import { generateWalletAddress } from "../utils/generate.wallet.address.js";
import { generateWalletName } from "../utils/generate.wallet.name.js";
import {compareEncryptedStrings, encryptPassword} from "../plugins/encrypt.wallet.password.js";

export const getAccount = async (req, res) => {
  const userId = req.userId;
  try {
    const account = await Account.findOne({ user : userId });
    if(!account){
      return res.status(404).json({ message : "Account not found" });
    }
    return res.status(200).json({ account });
  }catch (error){
    console.error(error)
    return res.status(500).json({ message : "Server error" });
  }
}

export const createWallet = async (req, res) => {
  const { walletName, walletPassword, currency } = req.body;
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let finalWalletName = walletName || generateWalletName();

    const existingWallet = await Wallet.findOne({ user: userId, currency });
    if (existingWallet) return res.status(400).json({ message: `${currency} wallet already exists` });

    const walletAddress = generateWalletAddress();
    const secretKey = "qwertyisdkey";
    const encryptedPassword = encryptPassword(walletPassword, secretKey);

    function assignWalletTypes(currency) {
      if (currency === "USD") {
        return "fiat";
      }
      return "crypto";
    }

    const walletType = assignWalletTypes(currency);
    const wallet = new Wallet({
      walletName: finalWalletName,
      user: user._id,
      address: walletAddress,
      type: walletType,
      currency,
      walletPassword: encryptedPassword
    });

    let account = await Account.findOne({ user: userId });
    if (!account) {
      account = new Account({ user: userId, name: `${user.username}'s account`, wallets: [] });
    }

    account.wallets.push(wallet);
    await Promise.all([wallet.save(), account.save()]);

    return res.status(200).json({ message: "Wallet saved successfully", wallet });
  } catch (error) {
    console.error("Error creating wallet:", error.message); // Improved error logging
    return res.status(500).json({ message: error.message });
  }
};



export const getWallets = async (req, res) => {
  const userId = req.userId;
  try {
    const wallets = await Wallet.find({ user : userId });
    if(!wallets){
      return res.status(404).json({ message : "Wallet not found" });
    }
    return res.status(200).json({ wallets })
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message : "Server error" })
  }
}

export const getWallet = async (req, res) => {
  const userId = req.userId;
  const { walletPassword } = req.body;
  const { walletId } = req.params;

  console.log("User ID:", userId); // Log user ID for debugging
  console.log("Wallet ID:", walletId); // Log wallet ID for debugging

  if (!walletId) {
    return res.status(404).json({ message: "Wallet Id not provided" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const wallet = await Wallet.findOne({ _id: walletId, user: userId }); // Ensure wallet belongs to user
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    const secretKey = "qwertyisdkey";
    const isPasswordValid = compareEncryptedStrings(walletPassword, wallet.walletPassword, secretKey);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    return res.status(200).json({ wallet });
  } catch (error) {
    console.error("Error retrieving wallet:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

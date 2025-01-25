import { Wallet } from '../models/account.models.js';
import Transaction from '../models/transaction.models.js';
import { compareEncryptedStrings } from "../plugins/encrypt.wallet.password.js";

export const sendAmount = async (req, res) => {
    const userId = req.userId;
    const { walletAddress, amount, walletPassword } = req.body;
    const { senderWalletId } = req.params;

    try {
        const senderWallet = await Wallet.findOne({ user : userId, _id: senderWalletId });
        if (!senderWallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        const receiverWallet = await Wallet.findOne({ address : walletAddress, currency : senderWallet.currency });
        if (!receiverWallet) {
            return res.status(404).json({ message: "This wallet does not exist" });
        }

        if (senderWallet.balance < amount || amount <= 0) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const secretKey = "qwertyisdkey";
        const isPasswordValid = compareEncryptedStrings(walletPassword, senderWallet.walletPassword, secretKey);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        senderWallet.balance -= amount;
        receiverWallet.balance += amount;
        await Promise.all([senderWallet.save(), receiverWallet.save()]);

        const transaction = new Transaction({
            senderWalletAddress: `${senderWallet.address}`,
            receiverWalletAddress: `${receiverWallet.address}`,
            amount: amount,
        });

        await transaction.save();
        return res.status(200).json({ message: "Transaction through", transaction });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}


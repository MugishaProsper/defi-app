import {Wallet} from "../models/account.models.js";
import Transaction from "../models/transaction.models.js";

export const sendAmount = async (senderId, receiverId, amount, res) => {
    try{
        const senderWallet = await Wallet.findOne({ user : senderId });
        const receiverWallet = await Wallet.findOne({ user : receiverId })
        if (!senderWallet || !receiverWallet) {
            return res.status(400).json({ message : 'Wallet address is invalid' });
        }
        if(amount <= 0){
            return res.status(400).json({ message : "Amount must be greater than 0" });
        }
        if(amount > senderWallet.balance){
            return res.status(400).json({ message : "Insufficient balance"});
        }
        senderWallet.balance -= amount;
        receiverWallet.balance += amount;
        await Promise.all([senderWallet.save(), receiverWallet.save()]);
        const transaction = new Transaction(senderWallet.address, receiverWallet.address, amount);
        await transaction.save();
        return res.status(200).json({ message : "Transaction through", transaction })
    }catch (e) {
        console.error(e.message);
        return res.status(500).json({ message : "Server error" });
    }
}
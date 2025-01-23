import User, { Wallet } from '../models/account.models.js';
import Transaction from '../models/transaction.models.js';

export const sendFiatToWallet = async (req, res) => {
  const userId = req.userId;
  const { recieverWalletAddress, amount, walletPIN } = req.body;
  try {
    const wallet = await Wallet.findOne({ user : userId });
    if(!wallet){
      return res.status(404).json({ message : "Your wallet is not found" })
    };
    const isPINValid = await bcrypt.compare(walletPIN, wallet.walletPIN);
    if(!isPINValid){
      return res.status(403).json({ message : "Incorrect PIN" });
    };
    const receiver = await Wallet.findOne({ address : recieverWalletAddress });
    if(!receiver){
      return res.status(404).json({ message : "Receiver wallet address not found" })
    };
    if(wallet.balance <= 0 || wallet.balance < amount){
      return res.status(403).json({ message : "Insuffient balance" });
    };
    //wallet.balance -= amount;
    //receiver.balance += amount;

    await Promise.all([wallet.balance -= amount, receiver.balance += amount]);
    await Promise.all([wallet.save(), receiver.save()]);
    const walletAddress = wallet.address;
    const transaction = new Transaction({ walletAddress, recieverWalletAddress, amount });
    await transaction.save();
    return res.status(200).json({ message : "Transaction through", transaction })
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message : "Server error" });
  }
}
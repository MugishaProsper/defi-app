import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
  senderWalletAddress : { type : String, required : true },
  receiverWalletAddress : { type : String, required : true },
  amount : { type : Number, required : true }
}, { timestamps : true });

export const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
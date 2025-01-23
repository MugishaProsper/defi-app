import mongoose from 'mongoose';

const walletSchema = mongoose.Schema({
  walletName : { type : String },
  user : { type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true },
  address : { type : String, required : true, unique : true },
  balance : { type : Number, required : true, default : 0.000 },
  walletPIN : { type : String, required : true }
});

const cryptoWalletSchema = mongoose.Schema({
  walletName : { type : String },
  user : { type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true },
  address : { type : String, required : true, unique : true },
  coin : { type : String, enum : ['ETH', 'BTC', 'PI'], required : true },
  balance : { type : Number, required : true, default : 0.0 },
  walletPIN : { type : String, required : true }
}, { timestamps : true })

export const Wallet = mongoose.model('wallets', walletSchema);
export const CryptoWallet = mongoose.model('cryptoWallets', cryptoWalletSchema);

export default { Wallet, CryptoWallet };
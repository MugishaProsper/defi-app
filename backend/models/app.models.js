import mongoose from "mongoose";

export const appWalletSchema = mongoose.Schema({
  name : { type : String, default : 'DeFi Base Fiat Account' },
  balance : { type : Number, default : 0.0 },
  password : { type : String, required : true }
}, { timestamps : true });

export const appCryptoWalletSchema = mongoose.Schema({
  name : { type : String, default : 'DeFi Base Crypto Wallet'},
  coin : { type : String, required : true, unique : true },
  balance : { type : Number, default : 0.0 },
}, { timstamps : true });

export const baseAppAccount = mongoose.Schema({
  name : { type : String, required : true, default : "Main Account" },
  wallets : [{ type : mongoose.Schema.Types.ObjectId, ref : 'Wallets', default : [] }],
  password : { type : String, required : true }
})

export const AppWallet = mongoose.model('app-fiat-wallet', appWalletSchema);
export const AppCryptoWallet = mongoose.model('app-crypto-wallet', appCryptoWalletSchema);

export default { AppCryptoWallet, AppWallet}
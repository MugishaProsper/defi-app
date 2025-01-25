import mongoose from 'mongoose';

const accountSchema = mongoose.Schema({
  user : { type : mongoose.Schema.Types.ObjectId, ref : "User", required : true },
  wallets : [{ type : mongoose.Schema.Types.ObjectId, ref : "Wallet", default : [] }]
}, { timestamps : true });

const walletSchema = mongoose.Schema({
  walletName : { type : String },
  user : { type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true },
  address : { type : String, required : true, unique : true },
  type : { type : String, enum : ['crypto', 'fiat'], required : true },
  currency : { type : String, enum : ['BTC', 'ETH', 'USD'], required : true },
  balance : { type : Number, default : 0.0 },
  walletPassword : { type : String, required : true }
}, { timestamps : true });

export const Account = mongoose.model('accounts', accountSchema);
export const Wallet = mongoose.model('wallets', walletSchema);

export default { Wallet, Account };
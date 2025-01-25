import express from 'express';
import { authorize } from '../middlewares/auth.middleware.js';
import { createWallet, getAccount, getWallet, getWallets } from '../controllers/accounts.controllers.js';
import { sendAmount } from "../controllers/transactions.controllers.js";

const wallet_router = express.Router();
wallet_router.get('/', authorize, getAccount);
wallet_router.post('/wallets/create', authorize, createWallet);
wallet_router.get('/wallets/:walletId', authorize, getWallet);
wallet_router.get("/wallets/", authorize, getWallets);
wallet_router.post('/wallets/:senderWalletId/send', authorize, sendAmount);

export default wallet_router;
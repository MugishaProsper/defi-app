import express from 'express';
import { authorize } from '../middlewares/auth.middleware.js';
import { createWallet, getWallet } from '../controllers/accounts.controllers.js';

const wallet_router = express.Router();

wallet_router.post('/wallets/create', authorize, createWallet);
wallet_router.get('/wallets/', authorize, getWallet);

export default wallet_router;
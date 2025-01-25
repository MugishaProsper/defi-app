import express from 'express';
import { connectToDatabase } from './config/db.config.js';
import auth_router from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import wallet_router from './routes/wallets.routes.js';

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth/', auth_router);
app.use('/api/account/', wallet_router);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  connectToDatabase();
});
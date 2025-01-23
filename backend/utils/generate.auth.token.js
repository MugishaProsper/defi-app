import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv();

export const generateTokenAndSetCookie = (res, userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '15d' });
    return res.cookie('auth_token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: 'Server error' });
  }
}

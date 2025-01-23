import jwt from 'jsonwebtoken';

export const authorize = async (req, res, next) => {
  const token = req.cookies.auth_token;
  if(!token) return res.status(401).json({ message : "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({ message : "Unauthorized" });
  }
}

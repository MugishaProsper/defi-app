import crypto from 'crypto';

export const encryptPassword = (password, secretKey) => {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(secretKey, 'salt', 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export const decryptPassword = (encryptedPassword, secretKey) => {
  const [ivHex, encrypted] = encryptedPassword.split(':');
  const key = crypto.scryptSync(secretKey, 'salt', 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(ivHex, 'hex'));
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
export const compareEncryptedStrings = (rawString, encryptedString, secretKey) => {
  const decryptedString = decryptPassword(encryptedString, secretKey);
  return decryptedString === rawString;
}
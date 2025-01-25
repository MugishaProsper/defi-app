import { encryptPassword, decryptPassword } from "../plugins/encrypt.wallet.password.js";

export const compareEncryptedStrings = (rawString, encryptedString, secretKey) => {
    const decryptedString = decryptPassword(encryptedString, secretKey);
    return decryptedString === rawString;
}

// Example usage
const secretKey = "qwertyisdkey";
const password = "password";
const encryptedPassword = encryptPassword(password, secretKey);
const isPasswordValid = compareEncryptedStrings(password, encryptedPassword, secretKey);
console.log(isPasswordValid);


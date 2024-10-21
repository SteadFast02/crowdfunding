import crypto from 'crypto';
import { configDotenv } from 'dotenv';
configDotenv();

const secretKey = process.env.CRYPTO_SECRET_KEY; 
const iv = Buffer.from(process.env.CRYPTO_IV, 'hex'); 

const encrypt = (data) => {
    const text = JSON.stringify(data);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted
};

const decrypt = (hash) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    try {
        let decrypted = decipher.update(hash, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        const data = JSON.parse(decrypted);
        return data;
    } catch (error) {
        console.error('Decryption error:', error.message);
        throw error; 
    }
};

export default {encrypt,decrypt}
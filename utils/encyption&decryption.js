const crypto = require('crypto');

const secretKey = '12345678901234567890123456789012'; // Must be 32 characters for aes-256
const algorithm = 'aes-256-cbc';

function encrypt(text) {
    if (!text || typeof text !== 'string') {
        throw new Error('Invalid text to encrypt');
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text) {
    if (!text || typeof text !== 'string') {
        throw new Error('Invalid encrypted data');
    }

    const parts = text.split(':');
    if (parts.length !== 2) {
        throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];

    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const decryptPayload = (payload) => {
    const decrypted = {};
  
    for (const key in payload) {
      try {
        if (typeof payload[key] === 'string' && payload[key].includes(':')) {
          decrypted[key] = decrypt(payload[key]);
        } else {
          decrypted[key] = payload[key]; 
        }
      } catch (err) {
        console.warn(`Failed to decrypt key "${key}", using raw value.`);
        decrypted[key] = payload[key]; 
      }
    }
  
    return decrypted;
  };
  
  

module.exports = { encrypt, decrypt, decryptPayload };

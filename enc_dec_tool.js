const {encrypt,decrypt}= require("./utils/encyption&decryption")


const mode = process.argv[2]; 
const text = process.argv[3]; 
if (!mode || !text) {
  console.log('Usage: node encryptDecryptTool.js <encrypt|decrypt> <text>');
  process.exit(1);
}

if (mode === 'encrypt') {
  const encrypted = encrypt(text);
  console.log('🔐 Encrypted Text:', encrypted);
} else if (mode === 'decrypt') {
  const decrypted = decrypt(text);
  console.log('🔓 Decrypted Text:', decrypted);
} else {
  console.log('Invalid mode. Use "encrypt" or "decrypt".');
}
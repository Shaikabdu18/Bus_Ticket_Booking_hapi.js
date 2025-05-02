const {encrypt}= require("./utils/encyption&decryption")


const name = encrypt('John Doe');
const email = encrypt('john@example.com');
const password = encrypt('MyPassword123');
const role = encrypt('user');

console.log('Encrypted Name:', name);
console.log('Encrypted Email:', email);
console.log('Encrypted Password:', password);
console.log('Encrypted Role:', role);
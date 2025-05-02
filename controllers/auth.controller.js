const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { encrypt, decrypt, decryptPayload } = require("../utils/encyption&decryption");
const { userValidationSchema, loginValidationSchema } = require('../validations/auth.validation');

exports.register = async (request, h) => {
  try {
    const decryptedData = decryptPayload(request.payload);
    const { name, email, password, role } = decryptedData;

    if (!name || !email || !password || !role) {
      return h
        .response({ data: encrypt(JSON.stringify({ message: 'Missing required fields' })) })
        .code(400);
    }

    const { error } = userValidationSchema.validate(decryptedData);
    if (error) {
      return h
        .response({ data: encrypt(JSON.stringify({ message: error.details[0].message })) })
        .code(400);
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return h
        .response({ data: encrypt(JSON.stringify({ message: 'Email already in use' })) })
        .code(409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return h
      .response({ data: encrypt(JSON.stringify({ message: 'User registered successfully' })) })
      .code(201);
  } catch (error) {
    console.error('Register error:', error.message);
    return h
      .response({ data: encrypt(JSON.stringify({ message: 'Error registering user' })) })
      .code(500);
  }
};

exports.login = async (request, h) => {
  try {
    const decryptedData = decryptPayload(request.payload);
    console.log(decryptedData,"Hi");
    
    const { email, password } = decryptedData;

    const { error } = loginValidationSchema.validate(decryptedData);
    if (error) {
      return h
        .response({ data: encrypt(JSON.stringify({ message: error.details[0].message })) })
        .code(400);
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return h
        .response({ data: encrypt(JSON.stringify({ message: 'User not found' })) })
        .code(404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return h
        .response({ data: encrypt(JSON.stringify({ message: 'Invalid password' })) })
        .code(400);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    return h
      .response({
        data: encrypt(JSON.stringify({
          message: 'Login successful',
          token,
        })),
      })
      .code(200);
  } catch (error) {
    console.error('Login error:', error.message);
    return h
      .response({ data: encrypt(JSON.stringify({ message: 'Internal server error' })) })
      .code(500);
  }
};

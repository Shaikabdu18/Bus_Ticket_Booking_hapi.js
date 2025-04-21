const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.register = async (request, h) => {
    const { name, email, password, role } = request.payload;
    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
      return h.response({ message: 'Email already in use' }).code(409);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });
      return h.response({ message: 'User created successfully',}).code(201);
    } catch (error) {
        console.log(error.message);
        
      return h.response({ message: 'Error registering user' }).code(500);
    }
  };

  exports.login = async (request, h) => {
    const { email, password } = request.payload;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return h.response({ message: 'User not found' }).code(400);
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return h.response({ message: 'Invalid password' }).code(400);
      }
  
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });
  
      return h.response({ message: 'Login successful', token }).code(200);
    } catch (error) {
      return h.response({ message: 'Error logging in', error }).code(500);
    }
  };
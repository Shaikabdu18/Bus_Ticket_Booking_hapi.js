const jwt = require('jsonwebtoken');

exports.verifyToken = (request, h) => {
  const token = request.headers.authorization?.split(' ')[1]; 
  if (!token) {
    return h.response({ message: 'No token provided' }).code(403).takeover();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    request.user = decoded;
    return h.continue;
  } catch (err) {
    return h.response({ message: 'Invalid token' }).code(401).takeover();
  }
};

exports.isAdmin = (request, h) => {
  if (!request.user || request.user.role !== 'admin') {
    return h.response({ message: 'Admin access required' }).code(403).takeover();
  }
  return h.continue;
};

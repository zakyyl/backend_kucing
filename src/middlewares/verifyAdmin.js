const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyAdmin = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Cek apakah role admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Akses hanya untuk admin' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

module.exports = verifyAdmin;

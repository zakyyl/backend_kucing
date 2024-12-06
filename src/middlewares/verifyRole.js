// verifyRole.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware untuk memverifikasi token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Mengambil token dari header Authorization

  if (!token) {
    return res.status(403).json({ message: 'Token diperlukan' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Menyimpan info user pada request
    next();  // Lanjutkan ke rute berikutnya
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

// Middleware untuk memverifikasi jika pengguna adalah admin
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses hanya untuk admin' });
  }
  next();  // Lanjutkan jika role adalah admin
};

module.exports = { verifyToken, verifyAdmin };

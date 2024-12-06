const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../../models').Admin;  // Sesuaikan dengan model admin Anda
require('dotenv').config();

const router = express.Router();

// Registrasi untuk Admin
router.post('/register', async (req, res) => {
  const { nama, email, password } = req.body;

  // Validasi input
  if (!nama || !email || !password) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  // Cek apakah email sudah terdaftar
  const existingAdmin = await Admin.findOne({ where: { email } });
  if (existingAdmin) {
    return res.status(400).json({ message: 'Email sudah terdaftar' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Simpan data admin ke database
    const admin = await Admin.create({
      nama,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'Admin berhasil didaftarkan', admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat registrasi', error });
  }
});

// Login untuk Admin
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ where: { email } });

  if (!admin) {
    return res.status(404).json({ message: 'Admin tidak ditemukan' });
  }

  // Periksa password
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Password salah' });
  }

  // Jika valid, buat token JWT
  const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ message: 'Login berhasil', token });
});

module.exports = router;

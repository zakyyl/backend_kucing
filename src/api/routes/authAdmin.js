const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../../models').Admin;
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
  const { nama, email, password } = req.body;
  if (!nama || !email || !password) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }

  const existingAdmin = await Admin.findOne({ where: { email } });
  if (existingAdmin) {
    return res.status(400).json({ message: 'Email sudah terdaftar' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
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

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ where: { email } });

  if (!admin) {
    return res.status(404).json({ message: 'Akun tidak ditemukan' });
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Password salah' });
  }

  const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.status(200).json({ message: 'Login berhasil', token });
});

module.exports = router;

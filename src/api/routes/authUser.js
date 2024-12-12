const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerSchema} = require('../../validations/authValidation');
const Pengguna = require('../../models').Pengguna;
const router = express.Router();

require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET

router.post('/register', async (req, res) => {
  const { nama, email, password, no_telepon, alamat } = req.body;
  const { error } = registerSchema.validate({ nama, email, password, no_telepon, alamat });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const existingUser = await Pengguna.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Pengguna.create({
      nama,
      email,
      password: hashedPassword,
      no_telepon,
      alamat
    });
    res.status(201).json({ message: 'Pengguna berhasil didaftarkan', pengguna: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const pengguna = await Pengguna.findOne({ where: { email } });
  if (!pengguna) {
    return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
  }
  const isPasswordValid = await bcrypt.compare(password, pengguna.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Password salah' });
  }
  const token = jwt.sign(
    { id: pengguna.id, role: 'user' },
    SECRET_KEY,
    { expiresIn: '1h' }
  )
  res.status(200).json({ message: 'Login berhasil', token });
});



module.exports = router;

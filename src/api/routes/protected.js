const express = require('express');
const authenticate = require('../../middlewares/authenticate');
const router = express.Router();

router.get('/profile', authenticate, async (req, res) => {
  try {
    const pengguna = await Pengguna.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    if (!pengguna) return res.status(404).json({ message: 'Pengguna tidak ditemukan' });

    res.status(200).json({ message: 'Profil pengguna', pengguna });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan', error });
  }
});

module.exports = router;

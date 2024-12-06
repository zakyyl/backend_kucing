const { Kucing } = require("../models");
const multer = require('multer');
const path = require('path');


// Konfigurasi Multer untuk penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/kucing/'); // Menyimpan file di folder 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Menambahkan nama unik pada file
  }
});

const upload = multer({ storage: storage });

// Fungsi untuk mengambil semua data kucing
exports.getKucing = async (req, res) => {
  try {
    const kucing = await Kucing.findAll();
    res.json({ status: "OK", data: kucing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fungsi untuk mengambil data kucing berdasarkan ID
exports.getKucingById = async (req, res) => {
  const { id } = req.params;

  try {
    const kucing = await Kucing.findByPk(id);

    if (!kucing) {
      return res.status(404).json({ message: "Kucing tidak ditemukan" });
    }

    res.json({ status: "OK", data: kucing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fungsi untuk membuat data kucing baru dengan foto
// Fungsi untuk membuat data kucing baru dengan foto
exports.createKucing = async (req, res) => {
  try {
    // Pastikan file foto ada, jika tidak null
    const { nama, umur, ras, jk, kondisi, deskripsi } = req.body;
    const foto = req.file ? req.file.filename : null; // Menyimpan nama file foto yang di-upload

    const kucing = await Kucing.create({
      nama,
      umur,
      ras,
      jk,
      kondisi,
      deskripsi,
      foto, // Menyimpan nama file foto di database
    });

    res.status(201).json({ status: "Created", data: kucing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fungsi untuk memperbarui data kucing
exports.updateKucing = async (req, res) => {
  const { id } = req.params;
  const { nama, umur, ras, jk, kondisi, deskripsi, foto } = req.body;

  try {
    const kucing = await Kucing.findByPk(id);

    if (!kucing) {
      return res.status(404).json({ message: "Kucing tidak ditemukan" });
    }

    // Update field yang tersedia
    kucing.nama = nama || kucing.nama;
    kucing.umur = umur || kucing.umur;
    kucing.ras = ras || kucing.ras;
    kucing.jk = jk || kucing.jk;
    kucing.kondisi = kondisi || kucing.kondisi;
    kucing.deskripsi = deskripsi || kucing.deskripsi;
    kucing.foto = foto || kucing.foto;

    await kucing.save();

    res.json({ status: "Updated", data: kucing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fungsi untuk menghapus data kucing
exports.deleteKucing = async (req, res) => {
  const { id } = req.params;

  try {
    const kucing = await Kucing.findByPk(id);

    if (!kucing) {
      return res.status(404).json({ message: "Kucing tidak ditemukan" });
    }

    await kucing.destroy();

    res.json({ status: "Deleted", message: "Kucing berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

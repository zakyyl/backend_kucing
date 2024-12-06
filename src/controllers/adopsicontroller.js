const { Adopsi, Pengajuan, Kucing, Pengguna } = require("../models");

// Mendapatkan semua data adopsi
exports.getAllAdopsi = async (req, res) => {
  try {
    const adopsi = await Adopsi.findAll({
      include: [
        { model: Kucing, attributes: ['id', 'nama'] },
        { model: Pengguna, attributes: ['id', 'nama'] }
      ]
    });
    res.json({ status: "OK", data: adopsi });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Membuat data adopsi baru berdasarkan pengajuan yang diterima
exports.createAdopsi = async (req, res) => {
  try {
    const { id_pengajuan } = req.body;

    // Cari data pengajuan
    const pengajuan = await Pengajuan.findByPk(id_pengajuan, {
      include: [
        { model: Kucing, attributes: ['id', 'nama'] },
        { model: Pengguna, attributes: ['id', 'nama'] }
      ]
    });

    if (!pengajuan) {
      return res.status(404).json({ error: "Pengajuan tidak ditemukan" });
    }

    // Buat entri di tabel Adopsi
    const adopsi = await Adopsi.create({
      id_pengajuan: pengajuan.id_pengajuan,
      id_kucing: pengajuan.Kucing.id,
      nama_kucing: pengajuan.Kucing.nama,
      id_pengguna: pengajuan.Pengguna.id,
      nama_pengguna: pengajuan.Pengguna.nama
    });

    res.status(201).json({ status: "Created", data: adopsi });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mendapatkan detail adopsi berdasarkan id_adopsi
exports.getAdopsiById = async (req, res) => {
  try {
    const { id } = req.params;
    const adopsi = await Adopsi.findByPk(id, {
      include: [
        { model: Kucing, attributes: ['id', 'nama'] },
        { model: Pengguna, attributes: ['id', 'nama'] }
      ]
    });

    if (!adopsi) {
      return res.status(404).json({ error: "Adopsi tidak ditemukan" });
    }

    res.json({ status: "OK", data: adopsi });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Memperbarui data adopsi berdasarkan id_adopsi
exports.updateAdopsi = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_pengajuan, id_kucing, id_pengguna, nama_kucing, nama_pengguna } = req.body;

    // Cari data adopsi berdasarkan ID
    const adopsi = await Adopsi.findByPk(id);

    if (!adopsi) {
      return res.status(404).json({ error: "Adopsi tidak ditemukan" });
    }

    // Perbarui data
    adopsi.id_pengajuan = id_pengajuan || adopsi.id_pengajuan;
    adopsi.id_kucing = id_kucing || adopsi.id_kucing;
    adopsi.id_pengguna = id_pengguna || adopsi.id_pengguna;
    adopsi.nama_kucing = nama_kucing || adopsi.nama_kucing;
    adopsi.nama_pengguna = nama_pengguna || adopsi.nama_pengguna;

    await adopsi.save();

    res.json({ status: "Updated", data: adopsi });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Menghapus data adopsi berdasarkan id_adopsi
exports.deleteAdopsi = async (req, res) => {
  try {
    const { id } = req.params;
    const adopsi = await Adopsi.findByPk(id);

    if (!adopsi) {
      return res.status(404).json({ error: "Adopsi tidak ditemukan" });
    }

    await adopsi.destroy();
    res.json({ status: "Deleted", message: `Adopsi dengan ID ${id} berhasil dihapus` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

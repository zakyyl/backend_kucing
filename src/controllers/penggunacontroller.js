const { Pengguna } = require("../models");

exports.getAllPengguna = async (req, res) => {
  try {
    const pengguna = await Pengguna.findAll();
    res.json({ status: "OK", data: pengguna });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPenggunaById = async (req, res) => {
  const { id } = req.params; 

  try {
    const pengguna = await Pengguna.findByPk(id);

    if (!pengguna) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    res.json({ status: "OK", data: pengguna });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPengguna = async (req, res) => {
  try {
    const { nama, alamat, email, no_telepon } = req.body;
    const pengguna = await Pengguna.create({ nama, alamat, email, no_telepon });
    res.status(201).json({ status: "Created", data: pengguna });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePengguna = async (req, res) => {
  const { id } = req.params;
  const { nama, alamat, email, no_telepon } = req.body;

  try {
    const pengguna = await Pengguna.findByPk(id);
    if (!pengguna) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    pengguna.nama = nama || pengguna.nama;
    pengguna.alamat = alamat || pengguna.alamat;
    pengguna.email = email || pengguna.email;
    pengguna.no_telepon = no_telepon || pengguna.no_telepon;

    await pengguna.save();
    res.json({ status: "Updated", data: pengguna });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePengguna = async (req, res) => {
  const { id } = req.params;

  try {
    const pengguna = await Pengguna.findByPk(id);
    if (!pengguna) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    await pengguna.destroy();
    res.json({ status: "Deleted", message: "Pengguna berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

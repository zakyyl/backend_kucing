const { Pengajuan, Kucing, Pengguna, Adopsi } = require("../models");

// Fungsi untuk mengambil semua pengajuan
exports.getPengajuan = async (req, res) => {
  try {
    const pengajuanData = await Pengajuan.findAll({
      include: [
        { model: Kucing, attributes: ["nama"] },
        { model: Pengguna, attributes: ["nama"] },
      ],
    });
    res.json({ status: "OK", data: pengajuanData });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pengajuan data" });
  }
};

// Fungsi untuk mengambil pengajuan berdasarkan ID
exports.getPengajuanById = async (req, res) => {
  const { id } = req.params;

  try {
    const pengajuan = await Pengajuan.findByPk(id, {
      include: [
        { model: Kucing, attributes: ["nama"] },
        { model: Pengguna, attributes: ["nama"] },
      ],
    });

    if (!pengajuan) {
      return res.status(404).json({ message: "Pengajuan tidak ditemukan" });
    }

    res.json({ status: "OK", data: pengajuan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fungsi untuk membuat pengajuan baru
exports.createPengajuan = async (req, res) => {
  try {
    const {
      id_kucing,
      id_pengguna,
      status_pengajuan,
      motivasi,
      kondisi_rumah,
      pengalaman_peliharaan,
    } = req.body;

    const pengajuan = await Pengajuan.create({
      id_kucing,
      id_pengguna,
      status_pengajuan,
      motivasi,
      kondisi_rumah,
      pengalaman_peliharaan,
    });

    res.status(201).json({ status: "Created", data: pengajuan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fungsi untuk memperbarui pengajuan dan mengirimkan ke tabel Adopsi jika statusnya "berhasil"
// Fungsi untuk memperbarui pengajuan dan mengirimkan ke tabel Adopsi jika statusnya "berhasil"
exports.updatePengajuan = async (req, res) => {
  const { id } = req.params;
  const {
    id_kucing,
    id_pengguna,
    status_pengajuan,
    motivasi,
    kondisi_rumah,
    pengalaman_peliharaan,
  } = req.body;

  try {
    // Cari pengajuan berdasarkan ID
    const pengajuan = await Pengajuan.findByPk(id, {
      include: [
        { model: Kucing, attributes: ["id", "nama"] },
        { model: Pengguna, attributes: ["id", "nama"] },
      ],
    });

    if (!pengajuan) {
      return res.status(404).json({ message: "Pengajuan tidak ditemukan" });
    }

    // Simpan status sebelumnya untuk validasi
    const previousStatus = pengajuan.status_pengajuan;

    // Update data pengajuan
    pengajuan.id_kucing = id_kucing || pengajuan.id_kucing;
    pengajuan.id_pengguna = id_pengguna || pengajuan.id_pengguna;
    pengajuan.status_pengajuan = status_pengajuan || pengajuan.status_pengajuan;
    pengajuan.motivasi = motivasi || pengajuan.motivasi;
    pengajuan.kondisi_rumah = kondisi_rumah || pengajuan.kondisi_rumah;
    pengajuan.pengalaman_peliharaan = pengalaman_peliharaan || pengajuan.pengalaman_peliharaan;

    await pengajuan.save();

    // Jika status_pengajuan berubah menjadi "berhasil", buat entri di tabel Adopsi
    if (previousStatus !== "berhasil" && status_pengajuan === "berhasil") {
      // Periksa apakah data adopsi sudah ada
      const existingAdopsi = await Adopsi.findOne({ where: { id_pengajuan: pengajuan.id_pengajuan } });

      if (!existingAdopsi) {
        // Buat data di tabel Adopsi
        const adopsi = await Adopsi.create({
          id_pengajuan: pengajuan.id_pengajuan,
          id_kucing: pengajuan.id_kucing,
          nama_kucing: pengajuan.Kucing.nama,
          id_pengguna: pengajuan.id_pengguna,
          nama_pengguna: pengajuan.Pengguna.nama,
          status: "berhasil",
        });

        return res.status(201).json({
          status: "Adopsi Created",
          data: adopsi,
          message: "Pengajuan berhasil dan adopsi dibuat",
        });
      }
    }

    res.json({ status: "Updated", data: pengajuan });
  } catch (error) {
    console.error("Error in updatePengajuan: ", error); // Debugging log
    res.status(500).json({ error: error.message });
  }
};


// Fungsi untuk menghapus pengajuan
exports.deletePengajuan = async (req, res) => {
  const { id } = req.params;

  try {
    const pengajuan = await Pengajuan.findByPk(id);

    if (!pengajuan) {
      return res.status(404).json({ message: "Pengajuan tidak ditemukan" });
    }

    await pengajuan.destroy();

    res.json({ status: "Deleted", message: "Pengajuan berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

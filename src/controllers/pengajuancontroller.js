const { Pengajuan, Kucing, Pengguna, Adopsi } = require("../models");
const { validatePengajuan } = require('../validations/pengajuanValidation');

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

exports.getPengajuanByUserId = async (req, res) => {
  const { id } = req.params;

  try {
    const pengajuan = await Pengajuan.findAll({
      where: { id_pengguna: id },
      include: [
        {
          model: Kucing, 
          attributes: ["nama", "foto"], // Tambahkan 'foto' ke dalam attributes
        },
        { model: Pengguna, attributes: ["nama"] },
      ],
    });

    if (pengajuan.length === 0) {
      return res.status(404).json({ message: "Pengajuan tidak ditemukan untuk pengguna ini" });
    }

    // Format data yang akan dikirim, menambahkan path foto yang lengkap
    const responseData = pengajuan.map((item) => ({
      ...item.toJSON(),
      Kucing: {
        ...item.Kucing,
        foto: `uploads/${item.Kucing.foto}`, // Ubah 'path/to/images' ke path tempat Anda menyimpan gambar
      },
    }));

    res.json({ status: "OK", data: responseData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Fungsi untuk membuat pengajuan baru
exports.createPengajuan = async (req, res) => {
  try {
    // Destructuring data dari request body
    const {
      id_kucing,
      id_pengguna,
      status_pengajuan,
      motivasi,
      kondisi_rumah,
      pengalaman_peliharaan,
    } = req.body;

    // Validasi data
    const validationResult = validatePengajuan(req.body);

    // Jika validasi gagal
    if (!validationResult.isValid) {
      return res.status(400).json({
        status: 'Validation Error',
        errors: validationResult.errors
      });
    }

    // Buat pengajuan dengan data yang sudah divalidasi
    const pengajuan = await Pengajuan.create({
      id_kucing,
      id_pengguna,
      status_pengajuan,
      motivasi,
      kondisi_rumah,
      pengalaman_peliharaan,
    });

    // Kirim respons sukses
    return res.status(201).json({ 
      status: "Created", 
      data: pengajuan 
    });

  } catch (error) {
    // Log error untuk debugging
    console.error('Error creating pengajuan:', error);

    // Kirim respons error
    return res.status(500).json({ 
      status: 'Error',
      message: error.message 
    });
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

  // Validasi status pengajuan
  const validStatuses = ['Pending', 'Berhasil', 'Rejected'];
  if (status_pengajuan && !validStatuses.includes(status_pengajuan)) {
    return res.status(400).json({ 
      message: "Status pengajuan tidak valid", 
      validStatuses 
    });
  }

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

    // Modifikasi kondisi cek status berhasil
    if (previousStatus !== "Berhasil" && status_pengajuan === "Berhasil") {
      // Periksa apakah data adopsi sudah ada
      const existingAdopsi = await Adopsi.findOne({ 
        where: { id_pengajuan: pengajuan.id_pengajuan } 
      });

      if (!existingAdopsi) {
        // Buat data di tabel Adopsi
        const adopsi = await Adopsi.create({
          id_pengajuan: pengajuan.id_pengajuan,
          id_kucing: pengajuan.id_kucing,
          nama_kucing: pengajuan.Kucing.nama,
          id_pengguna: pengajuan.id_pengguna,
          nama_pengguna: pengajuan.Pengguna.nama,
          tanggal_adopsi: new Date(), // Tambahkan tanggal adopsi
          status: "Berhasil",
        });

        // Update status kucing menjadi tidak tersedia
        await Kucing.update(
          { status: 'Tidak Tersedia' }, 
          { where: { id: pengajuan.id_kucing } }
        );

        return res.status(201).json({
          status: "Adopsi Created",
          data: {
            pengajuan,
            adopsi
          },
          message: "Pengajuan berhasil dan adopsi dibuat",
        });
      }
    }

    res.json({ 
      status: "Updated", 
      data: pengajuan,
      message: "Pengajuan berhasil diperbarui" 
    });

  } catch (error) {
    console.error("Error in updatePengajuan: ", error);
    res.status(500).json({ 
      error: "Gagal memperbarui pengajuan",
      details: error.message 
    });
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


const { Kucing, Adopsi, Pengajuan } = require("../models");
const multer = require('multer');
const path = require('path');
const {Op} = require('sequelize')
const fs = require('fs');


// Konfigurasi storage untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/kucing/'); // Pastikan folder ini ada
  },
  filename: (req, file, cb) => {
    cb(null, `kucing-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipe file tidak diizinkan. Hanya JPEG, PNG, dan GIF yang diperbolehkan.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Fungsi untuk mengambil semua data kucing
exports.getKucing = async (req, res) => {
  try {
    const kucing = await Kucing.findAll();
    res.json({ status: "OK", data: kucing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAvailableKucing = async (req, res) => {
  try {
    const kucings = await Kucing.findAll({
      include: [
        {
          model: Pengajuan,
          as: 'pengajuans', // Sesuaikan dengan alias di model
          where: {
            status_pengajuan: {
              [Op.ne]: 'berhasil'
            }
          },
          required: false
        },
        {
          model: Adopsi,
          as: 'adopsis', // Sesuaikan dengan alias di model
          required: false
        }
      ],
      where: {
        '$adopsis.id_adopsi$': null
      }
    });

    res.json({
      status: 'success',
      data: kucings
    });
  } catch (error) {
    console.error('Error fetching available kucing:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      stack: error.stack
    });
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
  const { nama, umur, ras, jk, kondisi, deskripsi } = req.body;

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

    // Handling foto upload
    if (req.file) {
      // Hapus foto lama jika ada
      if (kucing.foto && fs.existsSync(path.join('uploads/kucing', kucing.foto))) {
        fs.unlinkSync(path.join('uploads/kucing', kucing.foto));
      }

      // Simpan nama file baru
      kucing.foto = req.file.filename;
    }

    await kucing.save();

    res.json({ 
      status: "Updated", 
      data: {
        ...kucing.toJSON(),
        foto: kucing.foto ? `/uploads/kucing/${kucing.foto}` : null
      }
    });
  } catch (error) {
    console.error('Update Kucing Error:', error);
    res.status(500).json({ 
      error: 'Gagal memperbarui data kucing', 
      details: error.message 
    });
  }
};


// Fungsi untuk menghapus data kucing
exports.deleteKucing = async (req, res) => {
  const { id } = req.params;

  try {
    console.log('Received delete request for kucing ID:', id);

    // Cari kucing terlebih dahulu
    const kucing = await Kucing.findByPk(id);

    if (!kucing) {
      console.log('Kucing not found with ID:', id);
      return res.status(404).json({ 
        status: 'error',
        message: "Kucing tidak ditemukan" 
      });
    }

    // Hapus file foto jika ada
    if (kucing.foto) {
      const fotoPath = path.join(__dirname, '../uploads/kucing', kucing.foto);
      
      try {
        if (fs.existsSync(fotoPath)) {
          fs.unlinkSync(fotoPath);
          console.log('Foto berhasil dihapus:', fotoPath);
        }
      } catch (fileError) {
        console.error('Gagal menghapus foto:', fileError);
        // Lanjutkan proses meskipun gagal menghapus foto
      }
    }

    // Hapus data kucing dari database
    await kucing.destroy();

    console.log('Kucing berhasil dihapus dengan ID:', id);

    res.status(200).json({ 
      status: "Deleted", 
      message: "Kucing berhasil dihapus" 
    });

  } catch (error) {
    console.error('Error saat menghapus kucing:', error);
    
    res.status(500).json({ 
      status: 'error',
      message: 'Gagal menghapus kucing',
      details: error.message 
    });
  }
};
const { Kucing, Adopsi, Pengajuan } = require("../models");
const multer = require('multer');
const path = require('path');
const {Op} = require('sequelize')
const fs = require('fs');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/kucing/'); 
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
    fileSize: 5 * 1024 * 1024 
  }
});


exports.getKucing = async (req, res) => {
  try {
    const kucing = await Kucing.findAll();
    res.json({ status: "OK", data: kucing });
  } catch (error) { // Error Handling
    res.status(500).json({ error: error.message });
  }
};

exports.getAvailableKucing = async (req, res) => {
  try {
    const kucings = await Kucing.findAll({
      include: [
        {
          model: Pengajuan,
          as: 'pengajuans', 
          where: {
            status_pengajuan: {
              [Op.ne]: 'berhasil'
            }
          },
          required: false
        },
        {
          model: Adopsi,
          as: 'adopsis', 
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
    console.error('Error fetching available kucing:', error); // Error handling 
    res.status(500).json({
      status: 'error',
      message: error.message,
      stack: error.stack
    });
  }
};


exports.getKucingById = async (req, res) => {
  const { id } = req.params;

  try {
    const kucing = await Kucing.findByPk(id);

    if (!kucing) { // Error handling 
      return res.status(404).json({ message: "Kucing tidak ditemukan" });
    }

    res.json({ status: "OK", data: kucing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.createKucing = async (req, res) => {
  try {
    const { nama, umur, ras, jk, kondisi, deskripsi } = req.body;
    const foto = req.file ? req.file.filename : null; 

    const kucing = await Kucing.create({
      nama,
      umur,
      ras,
      jk,
      kondisi,
      deskripsi,
      foto, 
    });

    res.status(201).json({ status: "Created", data: kucing });
  } catch (error) { // Error handling 
    res.status(500).json({ error: error.message });
  }
};


exports.updateKucing = async (req, res) => {
  const { id } = req.params;
  const { nama, umur, ras, jk, kondisi, deskripsi } = req.body;

  try {
    const kucing = await Kucing.findByPk(id);

    if (!kucing) { // Error handling 
      return res.status(404).json({ message: "Kucing tidak ditemukan" });
    }
    kucing.nama = nama || kucing.nama;
    kucing.umur = umur || kucing.umur;
    kucing.ras = ras || kucing.ras;
    kucing.jk = jk || kucing.jk;
    kucing.kondisi = kondisi || kucing.kondisi;
    kucing.deskripsi = deskripsi || kucing.deskripsi;

    if (req.file) {
      if (kucing.foto && fs.existsSync(path.join('uploads/kucing', kucing.foto))) {
        fs.unlinkSync(path.join('uploads/kucing', kucing.foto));
      }

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
  } catch (error) {  // Error handling 
    console.error('Update Kucing Error:', error);
    res.status(500).json({ 
      error: 'Gagal memperbarui data kucing', 
      details: error.message 
    });
  }
};

exports.deleteKucing = async (req, res) => {
  const { id } = req.params;

  try {
    console.log('Received delete request for kucing ID:', id); //Logger

    
    const kucing = await Kucing.findByPk(id);

    if (!kucing) {  // Error handling 
      console.log('Kucing not found with ID:', id);
      return res.status(404).json({ 
        status: 'error',
        message: "Kucing tidak ditemukan" 
      });
    }

    
    if (kucing.foto) {
      const fotoPath = path.join(__dirname, '../uploads/kucing', kucing.foto);
      
      try {
        if (fs.existsSync(fotoPath)) {
          fs.unlinkSync(fotoPath);
          console.log('Foto berhasil dihapus:', fotoPath); //Logger
        }
      } catch (fileError) {
        console.error('Gagal menghapus foto:', fileError); //Logger
        
      }
    }

    await kucing.destroy();

    console.log('Kucing berhasil dihapus dengan ID:', id); //Logger

    res.status(200).json({ 
      status: "Deleted", 
      message: "Kucing berhasil dihapus" 
    });

  } catch (error) {
    console.error('Error saat menghapus kucing:', error); //Logger
    
    res.status(500).json({ 
      status: 'error',
      message: 'Gagal menghapus kucing',
      details: error.message 
    });
  }
};
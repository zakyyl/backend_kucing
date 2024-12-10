const express = require("express");
const app = express();
const cors = require('cors');
require('dotenv').config();  // Pastikan ini ada di bagian paling atas
const authAdminRoutes = require('./src/api/routes/authadmin');  // Mengimpor rute untuk admin
const authUserRoutes = require('./src/api/routes/authUser'); 
const protectedRoutes = require('./src/api/routes/protected');
const { verifyToken, verifyAdmin } = require('./src/middlewares/verifyRole');  // Pastikan middleware ada di sini
console.log(process.env.JWT_SECRET);  // Ini akan menampilkan nilai JWT_SECRET

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3001;

// Import controllers
const kucingController = require("./src/controllers/kucingcontroller");
const adminController = require("./src/controllers/admincontroller");
const penggunaController = require("./src/controllers/penggunacontroller");
const pengajuanController = require("./src/controllers/pengajuancontroller");
const adopsiController = require("./src/controllers/adopsicontroller");
const multer = require('multer');
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// Konfigurasi penyimpanan file menggunakan Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Pastikan hanya 'uploads/' tanpa path tambahan
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Menambahkan nama unik pada file
  }
});


// Menggunakan multer untuk menangani file upload
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

// Route untuk membuat data kucing dengan foto
app.post('/api/v1/kucing', upload.single('foto'), kucingController.createKucing);

// Route untuk Kucing (akses terbuka)
app.get("/api/v1/kucing/available",verifyToken,kucingController.getAvailableKucing)
app.get("/api/v1/kucing",verifyToken, kucingController.getKucing);
app.get("/api/v1/kucing/:id", verifyToken,kucingController.getKucingById);
app.post("/api/v1/kucing",verifyToken, verifyAdmin, kucingController.createKucing);
app.put("/api/v1/kucing/:id",verifyToken, verifyAdmin,upload.single('foto'), kucingController.updateKucing);
app.delete("/api/v1/kucing/:id",verifyToken, verifyAdmin, kucingController.deleteKucing);

// Route untuk Admin (akses terbatas hanya untuk admin)
app.get("/api/v1/admin", verifyToken, verifyAdmin, adminController.getAdmin);  // Hanya admin yang bisa akses
app.post("/api/v1/admin", verifyToken, verifyAdmin, adminController.createAdmin);  // Hanya admin yang bisa akses

// Route untuk Pengguna (akses terbuka)
app.get("/api/v1/pengguna", penggunaController.getAllPengguna);  // Ambil semua pengguna
app.get('/api/v1/pengguna/:id', penggunaController.getPenggunaById);  // Ambil pengguna berdasarkan ID
app.post("/api/v1/pengguna", penggunaController.createPengguna);
app.put("/api/v1/pengguna/:id", penggunaController.updatePengguna);
app.delete("/api/v1/pengguna/:id", penggunaController.deletePengguna);

// Route untuk Pengajuan (akses terbuka)
app.get("/api/v1/pengajuan", verifyToken,pengajuanController.getPengajuan);
app.get("/api/v1/pengajuan/:id", verifyToken,pengajuanController.getPengajuanById);
app.post("/api/v1/pengajuan", pengajuanController.createPengajuan);
app.put("/api/v1/pengajuan/:id", pengajuanController.updatePengajuan);
app.delete("/api/v1/pengajuan/:id", pengajuanController.deletePengajuan);
app.get("/api/v1/pengajuan/user/:id",verifyToken, pengajuanController.getPengajuanByUserId);

// Route untuk Adopsi (akses terbuka)
app.get("/api/v1/adopsi",verifyToken, adopsiController.getAllAdopsi); 
app.post("/api/v1/adopsi", adopsiController.createAdopsi); 
app.get("/api/v1/adopsi/:id", adopsiController.getAdopsiById);
app.put("/api/v1/adopsi/:id", adopsiController.updateAdopsi); 
app.delete("/api/v1/adopsi/:id", adopsiController.deleteAdopsi);

// Endpoint default
app.get("/", (req, res) => {
  res.send({
    message: "Hallo 👋",
    status: "Server ready 🚀",
  });
});

app.use('/api/auth/admin', authAdminRoutes);  // Rute login untuk admin
app.use('/api/auth/user', authUserRoutes); 
// Protected Routes (akses terbatas dengan token)
app.use('/api/protected', verifyToken, protectedRoutes); // Semua rute di bawah ini membutuhkan token

app.listen(port, () => {
  console.log(`Server ready listening on http://localhost:${port}`);
});

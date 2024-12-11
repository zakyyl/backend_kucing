const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { verifyToken, verifyAdmin } = require("../../middlewares/verifyRole");
const kucingController = require("../../controllers/kucingcontroller");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error("Invalid file type."));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});


router.get("/available", verifyToken, kucingController.getAvailableKucing);
router.get("/", verifyToken, kucingController.getKucing);
router.get("/:id", verifyToken, kucingController.getKucingById);
router.post("/", verifyToken, verifyAdmin, upload.single("foto"), kucingController.createKucing);
router.put("/:id", verifyToken, verifyAdmin, upload.single("foto"), kucingController.updateKucing);
router.delete("/:id", verifyToken, verifyAdmin, kucingController.deleteKucing);

module.exports = router;

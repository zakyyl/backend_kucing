const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../../middlewares/verifyRole");
const pengajuanController = require("../../controllers/pengajuancontroller");

router.get("/", verifyToken, pengajuanController.getPengajuan);
router.get("/:id", verifyToken, pengajuanController.getPengajuanById);
router.get("/user/:id", verifyToken, pengajuanController.getPengajuanByUserId);
router.post("/",verifyToken, pengajuanController.createPengajuan);
router.put("/:id",   pengajuanController.updatePengajuan);
router.delete("/:id", verifyToken, verifyAdmin, pengajuanController.deletePengajuan);

module.exports = router;

const express = require("express");
const router = express.Router();
const pengajuanController = require("../../controllers/pengajuancontroller");
const { verifyToken, verifyAdmin } = require("../../middlewares/verifyRole");

router.get("/", verifyToken, pengajuanController.getPengajuan);
router.get("/:id", verifyToken, pengajuanController.getPengajuanById);
router.get("/user/:id", verifyToken, pengajuanController.getPengajuanByUserId);
router.post("/",verifyToken, pengajuanController.createPengajuan);
router.put("/:id",   pengajuanController.updatePengajuan);
router.delete("/:id", verifyToken,  pengajuanController.deletePengajuan);

module.exports = router;

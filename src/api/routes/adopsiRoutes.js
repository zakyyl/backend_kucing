const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../../middlewares/verifyRole");
const adopsiController = require("../../controllers/adopsicontroller");

router.get("/", verifyToken, adopsiController.getAllAdopsi);
router.get("/:id", verifyToken, verifyAdmin, adopsiController.getAdopsiById);
router.post("/", verifyToken, verifyAdmin, adopsiController.createAdopsi);
router.put("/:id", verifyToken, verifyAdmin,adopsiController.updateAdopsi);
router.delete("/:id", verifyToken, verifyAdmin, adopsiController.deleteAdopsi);

module.exports = router;

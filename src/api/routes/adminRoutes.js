const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../../middlewares/verifyRole");
const adminController = require("../../controllers/admincontroller");

router.get("/", verifyToken, verifyAdmin, adminController.getAdmin);
router.post("/", verifyToken, verifyAdmin, adminController.createAdmin);

module.exports = router;

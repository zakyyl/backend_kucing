const express = require("express");
const router = express.Router();
const adminController = require("../../controllers/admincontroller");
const { verifyToken, verifyAdmin } = require("../../middlewares/verifyRole");


router.get("/", verifyToken, verifyAdmin, adminController.getAdmin);
router.post("/", verifyToken, verifyAdmin, adminController.createAdmin);

module.exports = router;

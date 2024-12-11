const express = require("express");
const router = express.Router();
const penggunaController = require("../../controllers/penggunacontroller");

router.get("/", penggunaController.getAllPengguna);
router.get("/:id", penggunaController.getPenggunaById);
router.post("/", penggunaController.createPengguna);
router.put("/:id", penggunaController.updatePengguna);
router.delete("/:id", penggunaController.deletePengguna);

module.exports = router;

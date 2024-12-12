const express = require("express");
const router = express.Router();
const authAdminRoutes = require("./authAdmin");
const authUserRoutes = require("./authUser");

router.use("/admin", authAdminRoutes);
router.use("/user", authUserRoutes);

module.exports = router;

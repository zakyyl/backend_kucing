const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port = process.env.PORT || 3001;

// Routes
app.use("/api/v1/admin", require("./src/api/routes/adminRoutes"));
app.use("/api/v1/kucing", require("./src/api/routes/KucingRoutes"));
app.use("/api/v1/pengguna", require("./src/api/routes/penggunaRoutes"));
app.use("/api/v1/pengajuan", require("./src/api/routes/pengajuanRoutes"));
app.use("/api/v1/adopsi", require("./src/api/routes/adopsiRoutes"));
app.use("/api/auth", require("./src/api/routes/authRoutes"));

// Default route
app.get("/", (req, res) => {
  res.send({ message: "Hallo 👋", status: "Server ready 🚀" });
});

app.listen(port, () => console.log(`Server ready at http://localhost:${port}`));

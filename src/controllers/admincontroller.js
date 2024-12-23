const { Admin } = require("../models");

exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findAll();
    res.json({ status: "OK", data: admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = await Admin.create({ name, email, password });
    res.status(201).json({ status: "Created", data: admin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

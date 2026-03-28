const ngoModel = require("../../models/ngoModel");

const getNgo = async (req, res) => {
  try {
    const banks = await ngoModel.find();
    res.json({ success: true, data: banks });
  } catch (err) {
    console.error("Error fetching blood banks:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { getNgo };

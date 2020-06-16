const express = require("express");

const router = express.Router();

router.get("/rooms", (req, res) => {
  return res.json({ message: "ok" });
});

module.exports = router;

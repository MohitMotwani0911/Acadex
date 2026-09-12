const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getCurrentUser,
} = require("../controllers/authController");

const router = express.Router();

router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    message: "You accessed a protected route",
    userId: req.userId,
  });
});

router.get("/me", protect, getCurrentUser);

module.exports = router;
const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getAnalyticsOverview } = require("../controllers/analyticsController");

const router = express.Router();

// Get analytics overview for the logged-in user
router.get("/overview", protect, getAnalyticsOverview);

module.exports = router;
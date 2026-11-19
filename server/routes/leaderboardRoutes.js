const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', leaderboardController.getLeaderboard);
router.post('/submit', requireAuth, leaderboardController.submitScore);

module.exports = router;

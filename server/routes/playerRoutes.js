const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/me', requireAuth, authController.getProfile);
router.put('/name', requireAuth, authController.updateName);

module.exports = router;

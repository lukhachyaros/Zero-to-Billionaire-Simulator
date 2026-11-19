const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

// Guest & Sync Code endpoints
router.post('/guest', authController.createGuest);
router.post('/sync-device', authController.syncDevice);
router.post('/login', authController.login);
router.post('/set-pin', requireAuth, authController.setPin);
router.post('/logout', requireAuth, authController.logout);

// Player profile endpoints
router.get('/me', requireAuth, authController.getProfile);
router.put('/name', requireAuth, authController.updateName);

module.exports = router;

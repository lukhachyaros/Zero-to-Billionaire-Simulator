const express = require('express');
const router = express.Router();
const trafficController = require('../controllers/trafficController');
const { requireAdminAuth } = require('../middleware/adminAuth');

// Public admin authentication endpoints
router.post('/login', trafficController.login);
router.post('/logout', trafficController.logout);

// Protected administration & traffic monitoring endpoints
router.use(requireAdminAuth);

router.get('/me', trafficController.getMe);
router.get('/traffic/summary', trafficController.getSummary);
router.get('/traffic/timeseries', trafficController.getTimeseries);
router.get('/traffic/breakdown', trafficController.getBreakdown);
router.get('/traffic/live-logs', trafficController.getLiveLogs);

module.exports = router;

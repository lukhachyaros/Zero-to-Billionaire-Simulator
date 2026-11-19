const express = require('express');
const router = express.Router();
const saveController = require('../controllers/saveController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', requireAuth, saveController.getSave);
router.post('/', requireAuth, saveController.postSave);
router.get('/slots', requireAuth, saveController.listSlots);

module.exports = router;

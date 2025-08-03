const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/stats', dashboardController.getStats);
router.get('/fees-summary', dashboardController.getFeesSummary);
router.get('/fees-collected', dashboardController.getFeesCollected);
router.get('/fees-due', dashboardController.getFeesDue);

module.exports = router; 
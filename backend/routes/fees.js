const express = require('express');
const router = express.Router();
const feesController = require('../controllers/feesController');

router.get('/summary', feesController.getFeesSummary);
router.get('/students', feesController.getStudentsByFeeStatus);
router.patch('/update-fee', feesController.updateStudentFeeStatus);

module.exports = router; 
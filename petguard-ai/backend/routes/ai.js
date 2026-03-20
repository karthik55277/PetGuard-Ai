const express = require('express');
const { analyzeSymptoms } = require('../controllers/aiController');

const router = express.Router();

// POST /api/ai/analyze
router.post('/analyze', analyzeSymptoms);

module.exports = router;

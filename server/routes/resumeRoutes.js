const express = require('express');
const upload = require('../middleware/upload');
const { analyzeResume, getAnalysis, getAnalysisHistory, deleteAnalysis } = require('../controllers/resumeController');

const router = express.Router();

router.post('/analyze', upload.single('resume'), analyzeResume);
router.get('/analysis', getAnalysisHistory);
router.delete('/analysis/:id', deleteAnalysis);
router.get('/analysis/:id', getAnalysis);

module.exports = router;

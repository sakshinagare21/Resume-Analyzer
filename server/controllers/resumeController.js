const fs = require('fs');
const pool = require('../config/db');
const { extractPdfText, analyzeResumeText } = require('../services/groqService');

async function analyzeResume(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF resume.' });
    }

    const extractedText = await extractPdfText(req.file.path);
    const analysis = await analyzeResumeText(extractedText);

    const result = await pool.query(
      `INSERT INTO resume_analysis
       (original_filename, extracted_text, resume_score, ats_score, skills, strengths, weaknesses, suggestions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        req.file.originalname,
        extractedText,
        analysis.resumeScore,
        analysis.atsScore,
        JSON.stringify(analysis.skills),
        JSON.stringify(analysis.strengths),
        JSON.stringify(analysis.weaknesses),
        JSON.stringify(analysis.suggestions),
      ]
    );

    fs.unlink(req.file.path, () => {});

    return res.status(201).json({
      success: true,
      data: {
        id: result.rows[0].id,
        ...analysis,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getAnalysis(req, res, next) {
  try {
    const { id } = req.params;

    const result = await pool.query('SELECT * FROM resume_analysis WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Analysis not found.' });
    }

    const row = result.rows[0];

    return res.json({
      success: true,
      data: {
        id: row.id,
        originalFilename: row.original_filename,
        extractedText: row.extracted_text,
        resumeScore: row.resume_score,
        atsScore: row.ats_score,
        skills: Array.isArray(row.skills) ? row.skills : [],
        strengths: Array.isArray(row.strengths) ? row.strengths : [],
        weaknesses: Array.isArray(row.weaknesses) ? row.weaknesses : [],
        suggestions: Array.isArray(row.suggestions) ? row.suggestions : [],
        createdAt: row.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getAnalysisHistory(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT id, original_filename, resume_score, ats_score, created_at
       FROM resume_analysis
       ORDER BY created_at DESC
       LIMIT 100`
    );

    return res.json({
      success: true,
      data: result.rows.map((row) => ({
        id: row.id,
        originalFilename: row.original_filename,
        resumeScore: row.resume_score,
        atsScore: row.ats_score,
        createdAt: row.created_at,
      })),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  analyzeResume,
  getAnalysis,
  getAnalysisHistory,
};

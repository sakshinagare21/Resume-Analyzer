require('dotenv').config();
const express = require('express');
const cors = require('cors');
const resumeRoutes = require('./routes/resumeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok' } });
});

app.use('/api/resume', resumeRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File is too large. Maximum size is 5 MB.' });
  }

  if (err && err.message === 'Only PDF files are allowed.') {
    return res.status(400).json({ success: false, message: err.message });
  }

  return res.status(500).json({ success: false, message: 'Something went wrong while processing your resume.' });
});

app.listen(PORT, () => {
  console.log(`AI Resume Analyzer server running on http://localhost:${PORT}`);
});

module.exports = app;

const Groq = require('groq-sdk');
const pdf = require('pdf-parse');

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error('Missing GROQ_API_KEY in environment variables.');
}

const groq = new Groq({ apiKey });
const model = process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';

function parseJsonSafely(rawText) {
  if (!rawText) {
    throw new Error('Empty response from Groq.');
  }

  const cleaned = rawText
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  const candidate = start !== -1 && end !== -1 ? cleaned.slice(start, end + 1) : cleaned;

  return JSON.parse(candidate);
}

function validateAnalysis(analysis) {
  if (!analysis || typeof analysis !== 'object') {
    throw new Error('AI response is not a valid object.');
  }

  const normalized = {
    resumeScore: Number(analysis.resumeScore),
    atsScore: Number(analysis.atsScore),
    skills: Array.isArray(analysis.skills) ? analysis.skills.map((item) => String(item)) : [],
    strengths: Array.isArray(analysis.strengths) ? analysis.strengths.map((item) => String(item)) : [],
    weaknesses: Array.isArray(analysis.weaknesses) ? analysis.weaknesses.map((item) => String(item)) : [],
    suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions.map((item) => String(item)) : [],
  };

  if (!Number.isInteger(normalized.resumeScore) || normalized.resumeScore < 0 || normalized.resumeScore > 100) {
    throw new Error('resumeScore must be an integer between 0 and 100.');
  }

  if (!Number.isInteger(normalized.atsScore) || normalized.atsScore < 0 || normalized.atsScore > 100) {
    throw new Error('atsScore must be an integer between 0 and 100.');
  }

  return normalized;
}

async function extractPdfText(fileBuffer) {
  if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
    throw new Error('Invalid PDF buffer.');
  }

  console.log('PDF buffer size:', fileBuffer.length);
  const data = await pdf(fileBuffer);
  const text = (data.text || '').trim();
  console.log('Extracted PDF text length:', text.length);

  if (text.length < 20) {
    throw new Error('Could not extract meaningful text from the uploaded PDF.');
  }

  return text;
}

async function analyzeResumeText(resumeText) {
  const result = await groq.chat.completions.create({
    model,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are an expert resume reviewer and ATS specialist. Analyze the resume without inventing information. Return a JSON object with resumeScore and atsScore as integers from 0 to 100, and skills, strengths, weaknesses, and suggestions as arrays of strings.`,
      },
      {
        role: 'user',
        content: `Analyze this resume for overall quality, ATS compatibility, technical skills, strengths, weaknesses, and specific improvement suggestions.\n\nResume text:\n${resumeText.slice(0, 20000)}`,
      },
    ],
  });

  const raw = result.choices[0]?.message?.content;
  const parsed = parseJsonSafely(raw);

  return validateAnalysis(parsed);
}

module.exports = {
  analyzeResumeText,
  extractPdfText,
};
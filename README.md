# AI Resume Analyzer

A simple full-stack resume analysis app built with React + Vite on the frontend and Node.js + Express + PostgreSQL on the backend.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios
- Backend: Node.js, Express.js, PostgreSQL, pg
- Resume parsing: pdf-parse
- AI: Groq API

## Project Structure

```text
resume-analyzer/
├── client/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── .env
│   ├── app.js
│   └── package.json
├── README.md
└── .gitignore
```

## PostgreSQL Setup

1. Create a PostgreSQL database named `resume_analyzer`.
2. Run the SQL in `server/database.sql`.

```sql
CREATE DATABASE resume_analyzer;

CREATE TABLE IF NOT EXISTS resume_analysis (
    id SERIAL PRIMARY KEY,
    original_filename VARCHAR(255) NOT NULL,
    extracted_text TEXT,
    resume_score INTEGER,
    ats_score INTEGER,
    skills JSONB,
    strengths JSONB,
    weaknesses JSONB,
    suggestions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

### Server

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:5432/resume_analyzer"
GROQ_API_KEY="your-groq-api-key"
GROQ_MODEL="qwen/qwen3.8-27b"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

### Client

```env
VITE_API_URL="http://localhost:5000/api"
```

## Install and Run

### Backend

```bash
cd server
npm install
npm start
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## API

- `POST /api/resume/analyze`
- `GET /api/resume/analysis/:id`

## Notes

- PDF uploads are restricted to `.pdf` and 5 MB max.
- The backend validates AI output before saving to PostgreSQL.
- Groq API keys are kept only on the server.

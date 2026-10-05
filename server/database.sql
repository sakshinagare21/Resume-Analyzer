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

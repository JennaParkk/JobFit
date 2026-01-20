# JobFit — Semantic Job Description & Resume Matching

JobFit is a lightweight analysis tool that compares a job description with a resume to estimate how well a candidate matches a role.

Instead of relying only on keyword overlap, JobFit combines semantic similarity, skill-level matching, and structured LLM reasoning to surface meaningful strengths and gaps.

## Core Ideas & Design Decisions

### 1. Semantic similarity beyond keywords

Computes embeddings for:
- the entire job description
- the entire resume

Cosine similarity is used to measure how closely the *meaning* of the two texts align, even when exact keywords differ.

This helps capture real relevance that keyword matching often misses.

### 2. Skill matching as a separate, interpretable signal

Extracts:
- required skills
- preferred skills

from the job description and compares them against skills extracted from the resume.

This produces:
- required skill match score
- preferred skill match score
- explicit lists of missing skills

### 3. Weighted scoring instead of a single opaque number

Computes multiple signals before producing a final score:

- semantic score (embedding-based)
- skill score (weighted required + preferred)
- final match score (blend of semantic and skill scores)

This design allows future tuning and avoids hiding logic behind a single metric.

### 4. Structured LLM summaries for human-readable insight

After numeric scoring, generates a structured summary including:
- key strengths
- notable gaps
- overall fit assessment

The output is JSON-based to support future visualization and recommendation features.

## Current Features

- Semantic similarity using text embeddings
- Skill extraction from job descriptions and resumes
- Required vs preferred skill breakdown
- Weighted match score
- AI-generated summary (strengths, gaps, overall fit)
- Modular backend architecture

## Tech Stack

- Next.js (App Router)
- TypeScript
- OpenAI API
  - embeddings for semantic similarity
  - LLMs for skill extraction and summaries
- Tailwind CSS
- PDF parsing for resume ingestion

## Project Structure (Simplified)

```
src/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts        # End-to-end analysis pipeline
│   ├── analyze/                # JD + resume input UI
│   └── result/                 # Result visualization UI
├── lib/
│   ├── embeddings.ts           # Embedding utilities
│   ├── similarity.ts           # Cosine similarity helpers
│   └── weightedScore.ts        # Scoring & weighting logic
├── services/
│   ├── jdAnalyzer.ts           # JD skill extraction (LLM)
│   ├── resumeAnalyzer.ts       # Resume skill extraction (LLM)
│   └── summary.ts              # AI-generated fit summary
```

## To be Added

- Skill importance weighting from job descriptions
- Gap severity ranking
- Resume tailoring recommendations
- Interactive skill coverage visualizations
- Persisting embeddings for faster comparisons
# JobFit — Semantic Job Description & Resume Matching

**Personal project.** A semantic matching tool that helps early-career candidates see how well their resume aligns with a technical job description and what to improve.

**Live demo:** [→ Open app](https://your-deployment.vercel.app) *(replace with your Vercel URL)*

JobFit is optimized for **technical roles** (e.g. engineering, product, data) and **entry-level positions** (internships, new grad, early career). It is not designed for senior or highly experienced roles.

Instead of keyword overlap alone, JobFit combines semantic similarity (embeddings), skill-level matching, and LLM-generated summaries to surface interpretable strengths and gaps.

---

## Scope

- **For:** Technical job descriptions; entry-level applicants (interns, new grads, early career).
- **Not for:** Senior-level roles or long career timelines; non-technical JDs.

---

## Core Ideas & Design Decisions

### 1. Semantic similarity beyond keywords

- Computes embeddings (OpenAI `text-embedding-3-small`) for the full job description and resume.
- Uses cosine similarity and normalizes to a 0–100 semantic score.
- Captures conceptual alignment even when wording differs (e.g. JD: “React required” vs resume: “Built SPAs with modern frontend frameworks”).

### 2. Skill matching as a separate, interpretable signal

- LLM extracts **required** and **preferred** skills from the JD and resume.
- Compares coverage to produce required/preferred match scores and explicit **missing skills** lists.
- Skill score combines required (90% weight) and preferred (10% weight).

### 3. Importance weighting for JD skills

- Not all JD skills are equally important. JobFit assigns importance (0–1) using linguistic cues (“must”, “required”, “preferred”), position in the JD, frequency, and context.
- Prevents “nice-to-have” skills from dragging down the score.

### 4. Weighted scoring instead of a single number

- **Semantic score** (0–100): embedding-based conceptual alignment.
- **Skill score**: weighted required + preferred (and importance-weighted).
- **Final match score**: 50% semantic + 50% skill.
- Multiple signals keep the result interpretable and tunable.

### 5. Structured LLM summary

- After scoring, generates strengths, gaps, and an overall fit phrase.
- JSON-based for visualization (e.g. result page).

---

## Current Features

- Semantic similarity using OpenAI text-embedding-3-small
- Skill extraction from JD and resume (required / preferred, including “any-of” groups)
- JD skill importance weighting
- Weighted match score (semantic + skill, 90/10 required vs preferred)
- AI-generated summary (strengths, gaps, overall fit)
- PDF resume ingestion
- Modular backend (embeddings, similarity, scoring, analyzers, summary)

---

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **OpenAI API**
  - `text-embedding-3-small` for semantic similarity
  - GPT for skill extraction, importance weighting, and summaries
- **Tailwind CSS**
- **pdf-parse** for resume PDF → text

---

## Project Structure

```
src/
├── app/
│   ├── api/analyze/route.ts    # End-to-end analysis pipeline
│   ├── analyze/                # JD + resume input UI
│   ├── result/                 # Result visualization UI
│   ├── layout.tsx, page.tsx, globals.css
├── lib/
│   ├── embeddings.ts           # OpenAI embedding helpers
│   ├── similarity.ts           # Cosine similarity, 0–100 normalization
│   └── weightedScore.ts        # Scoring & required/preferred weighting
├── services/
│   ├── openaiClient.ts         # OpenAI client
│   ├── jdAnalyzer.ts           # JD skill extraction (LLM)
│   ├── jdWeighting.ts         # JD skill importance weighting (LLM)
│   ├── resumeAnalyzer.ts      # Resume skill extraction (LLM)
│   └── summary.ts              # AI-generated fit summary
```

---

## Run Locally

1. Clone and install:
   ```bash
   npm install
   ```

2. Create `.env.local` with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_key_here
   ```
   (See `.env.example` if present.)

3. Run the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

4. **Analyze:** Upload a resume (PDF) and paste a technical job description on `/analyze`; view results on `/result`. Results are kept in session only (no persistence yet).

---

## To Be Added

- Gap severity ranking
- Resume tailoring recommendations
- Interactive skill coverage visualizations
- Result persistence / shareable links (v1.5)
- (Optional) Caching embeddings for faster re-runs



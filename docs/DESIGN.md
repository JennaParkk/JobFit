# System Design & Algorithm Notes

Design document describing the reasoning, architecture, and algorithms behind JobFit (personal project).

---

## 1. Problem Statement

Early-career candidates (students, interns, recent graduates) often struggle to evaluate how well their resume matches a job description.

Many existing tools rely on:
- keyword matching
- ATS-style filtering
- opaque "match scores" with no explanation

These approaches often fail to:
- capture semantic relevance when wording differs
- explain why a candidate is a weak or strong match
- provide actionable insight for improvement

**Goal:** Design a system that helps early-career candidates understand how and why their resume aligns (or doesn’t) with a job description.

**Primary target users:**
- College students
- Internship applicants
- Recent graduates / early-career engineers

**Rationale:**
- Resumes tend to be skill-heavy and experience-light.
- Keyword coverage matters more than nuanced career trajectories for this segment.

**Non-goals (for now):**
- Senior-level role evaluation
- Recency weighting across long career timelines
- Domain-specific seniority heuristics

This scope keeps the system interpretable and avoids overfitting to senior hiring patterns.

---

## 2. Scope

JobFit is built for:
- **Technical job descriptions only** (e.g. engineering, product, data). Results are most meaningful when the JD is technical.
- **Entry-level applicants** (interns, new grads, early career). It is not tuned for senior or highly experienced roles.

Non-technical JDs or senior-level resumes are out of scope for the current design.

---

## 3. High-Level Architecture

The system intentionally separates:
- semantic similarity (embeddings),
- skill-level matching (extraction + weighting),
- and LLM reasoning (summaries),

so each signal stays interpretable and tunable.

---

## 4. Core Concepts & Features

### Semantic Similarity (Embeddings)

**Why embeddings?** They capture conceptual alignment, not just shared terms.

1. Generate embeddings for the full job description and full resume text (OpenAI `text-embedding-3-small`).
2. Compute cosine similarity between the embeddings.
3. Normalize similarity into a 0–100 score.

Example: JD says “React experience required”; resume says “Built SPAs with modern frontend frameworks.” The meaning aligns even without the word “React.”

**Limitation:** Embeddings alone don’t indicate which specific skills are missing. Hence combined with skill match score to avoid over-reliance on a single metric.

### Skill Extraction & Matching

Uses an LLM to extract:
- required skills
- preferred skills  
(and optional “any-of” groups)

from the job description and resume independently.

**Why LLM instead of regex?**
- JD phrasing varies wildly.
- Skills appear in responsibilities, qualifications, or culture sections.
- LLMs understand context (e.g. “frontend-focused role” → React/TS implied).

Skills are normalized to reduce:
- casing differences
- punctuation variation
- minor phrasing inconsistencies

### JD Importance Weighting & Skill Score

Not all skills in a JD are equally important. JobFit assigns importance (0–1) using:
- linguistic cues (“must”, “required”, “preferred”)
- position in the JD (e.g. first 20% weighted higher)
- frequency
- contextual cues (e.g. “frontend role” → React ↑)

**Why it matters:** It prevents “nice-to-have” skills from dragging down the score and highlights what truly matters.

**Implementation:** Required vs preferred skill match is combined with 90% weight on required and 10% on preferred; this is then blended with importance-weighted coverage.

### LLM-Generated Summary

**Purpose:** Numbers alone don’t explain why a candidate is or isn’t a fit.

The system produces structured output (e.g. JSON) with:
- strengths
- gaps
- overall fit (short phrase)

LLMs are used after scoring, not as the sole decision-maker.

### Scoring System

The pipeline produces multiple interpretable scores:
- **Semantic score (0–100):** embedding-based conceptual alignment.
- **Skill match score:** weighted combination of required (90%) and preferred (10%) match, with JD importance weighting.
- **Final match score:** blend of semantic and skill signals (e.g. 50% semantic, 50% skill).

---

## 5. Design Principles

### Modularity

Each step (embeddings, similarity, JD analysis, resume analysis, importance weighting, summary) is isolated so the system is easy to tune and extend.

### UI Design Goals

- Clarity over density
- Explanation over judgement
- Actionable insight over pass/fail labeling

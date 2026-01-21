# System Design & Algorithm Notes
Design document describing the reasoning, architecture, and algorithms behind JobFit.

## 1. Purpose of This Document
JobFit is more than a keyword matcher.
It is a semantic, multi-signal evaluation system designed to help early‑career candidates understand:

- how well their resume aligns with a job description
- why the match score is what it is
- what specific skills they should improve next

This document explains why certain algorithms were chosen, and how the system can evolve.

## 2. Problem Statement
Early-career candidates (students, interns, recent graduates) often struggle to evaluate how well their resume matches a job description.

More existing tools rely on
- keyword matching
- ATS-style filtering
- apaque "match scores" with no explanation

These approaches often fail to:
- captier semantic relevance when wording differs
- explain why a candidate is a week or strong match
- provide actionable insight for improvement

Goal:
Design a system that helps early-career candidates understand how and why their resume aligns (or doesn't) with a job description.

Primary target users:
- College students
- Internship applicants
- Recent graduates/early-career engineers

Rationale:
- Resume tend to be skill-heavy and experience-light
- Keyword coverage matter more than nuanced career trajectories

Non-goals (for now):
- Senior-level role evaluation
- Recency weighting across long career timelines
- Domain-specific seniority heuristics

This scope decision keeps the system interpretable and avoid overfitting to senior hiring patterns.

## 3. High-Level Architecture
Intentionally separates semantic similarity, skill-level matching, and LLM reasoning so each signal remains interpretable and tunable.

## 4. Core Concepts & Features
### Semantic Similarity (Embeddings)
Why embeddings? 
captures conceptual alignment, not just shared terms.

1. Generate embeddings for
    - full job description
    - full resume text
2. Compute cosine similarity between embeddigs
3. Normalize similarity into a 0-100 score

This captures conceptual alignment, not just shared terms.
This captures cases like:
- JD: “React experience required”
- Resume: “Built SPAs with modern frontend frameworks”
Even without the word “React,” the meaning is similar.

Limitation:
- Less interpretable without explanation
- Does not indicate which skills are missing
Therefore combited with skill match score to avoid over-reliance on single metric.

### Skill Extraction & Matching
Uses LLM to extract:
- required skills
- preferred skills
from the job description and resume independently.

Why LLM instead of regex?
- JD phrasing varies wildly
- Skills appear in responsibilities, qualifications, or even company culture sections
- LLMs understand context (“frontend-focused role” → React/TS implied)

Skills are normalized to reduce
- casing differences
- punctuation variation
- minor phrasing inconsistences

### JD Importance Weighting & Skill Score
Not all skills in a JD are equally important.
JobFit assigns importance (0–1) using:
- linguistic cues (“must”, “required”, “preferred”)
- position in JD (first 20% = more important)
- frequency
- contextual cues (e.g., “frontend role” → React ↑)

Why importance matters:  
It prevents “nice-to-have” skills from dragging down the score and highlights what truly matters.

### LLM-Generated Summary
Purpose: Numbers alone don't explain why a candidate is or isn't a fit.

The system generates structured JSON:
- strengths
- gaps
- overall fit (short phrase)
LLMs are used after scoring, not as the sole decision-maker.

### Scoring System
produces multiple interpretable scores:
- semantic score (0-100)
- skill match score (weighted combination of required skill match & preferred skill match)
- final match score (blend of semantic + skill signals)

## 5. Design Principles
### Modularity 
Each step is isolated to make the system easy to tune and extend.

### UI Design Goals
- clarity over density
- explanation over judgement
- actionable insight over pass/fail labeling





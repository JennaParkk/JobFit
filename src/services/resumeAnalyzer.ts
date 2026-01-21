import { openai } from "@/services/openaiClient";

type ResumeAnalysis = {
    tools: string[];
    concepts: string[];
};

export async function extractSkillsFromResume(resumeText: string): Promise<ResumeAnalysis> {
    const prompt = `
    You are an assistant that extracts technical skills from a software engineer resume.

    Extract TWO lists from the resume text:

    1) tools: concrete technical skills (languages, frameworks, libraries, tools, platforms)
    2) concepts: job-relevant technical concepts IMPLIED by the resume (only if strongly supported)


    RULES FOR tools:
    - Look in ALL sections (Skills, Experience, Projects, Education)
    - Prefer explicit skills listed in "Skills" section
    - Include technologies mentioned in project/work descriptions if used as implementation
    - Use industry-standard names (JavaScript not JS, PostgreSQL not Postgres)
    - Short names only (1-3 words)
    - No duplicates

    RULES FOR concepts:
    - DO NOT include vague umbrellas like "databases", "frontend frameworks", "cloud platforms"
    - Only include concepts that are commonly used as JD requirements AND are clearly supported by evidence in the resume
    - Each concept must be 1-3 words
    - Examples allowed when supported:
    - "data visualization" (if D3, Tableau, charts, dashboards, viz projects exist)
    - "frontend development" (if React/Vue/HTML/CSS/JS UI work exists)
    - "observability" (if Prometheus/Grafana/Alertmanager exists)
    - "cloud infrastructure" (if AWS/GCP/Azure + infra tooling exists)
    - If evidence is weak, omit it.


    Return ONLY valid JSON in this exact shape:
    {
    "tools": ["JavaScript", "D3", "Docker", ...],
    "concepts": ["data visualization", "observability", ...]
    }
    
    Resume:
    ${resumeText}
    `.trim();

    try {
        const res = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
        });
        const raw = res.choices[0].message.content ?? "{}";

        // Extract ```json ... ```
        const cleaned = raw
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleaned);

        return {
            tools: Array.isArray(parsed.tools) ? parsed.tools : [],
            concepts: Array.isArray(parsed.concepts) ? parsed.concepts : [],
        };
    } catch (error) {
        console.error("OpenAI resume analyzer failed, falling back:", error);

        return {
            tools: [],
            concepts: [],
        };
    }
}
import { openai } from "@/services/openaiClient";

type ResumeAnalysis = {
    skills: string[];
};

export async function extractSkillsFromResume(resumeText: string): Promise<ResumeAnalysis> {
    const prompt = `
    You are an assistant that extracts technical skills from a software engineer resume.

    From the following resume text, extract:
    - skills: a list of technical skills (languages, frameworks, tools, etc.)

    EXTRACTION RULES:
    1. Look in ALL sections (Skills, Experience, Projects, Education)
    2. Prioritize:
    - Skills explicitly listed in "Skills" or "Technical Skills" section
    - Technologies mentioned in project descriptions
    - Tools mentioned in work experience
    3. Short names only (1-3 words): "React" not "React framework"
    4. Use industry-standard names: "JavaScript" not "JS", "PostgreSQL" not "Postgres"
    5. NO vague categories: Don't include "databases", "frontend frameworks"
    6. NO soft skills: Don't include "leadership", "communication"

    EXAMPLES:
    Good: "Python", "Docker", "AWS", "React", "PostgreSQL"
    Bad: "programming languages", "cloud platforms", "teamwork"

    Return ONLY valid JSON with this exact shape:
    {
        "skills": ["skill1", "skill2", ...]
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
            skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        };
    } catch (error) {
        console.error("OpenAI resume analyzer failed, falling back:", error);

        return {
            skills: [],     
        };
    }
}
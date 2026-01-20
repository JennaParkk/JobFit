import { openai } from "@/services/openaiClient"

export type WeightedSkill = {
    name: string;
    importance: number; // 0.1 - 1.0
    reason: string;
    category: "required" | "preferred";
};

// Clamp a number between min and max
function clamp(n: number, min: number, max: number) {
    return Math.min(max, Math.max(min, n));
}

function normalizeSkillKey(name: string) {
    return name
        .toLocaleLowerCase()
        .replace(/[\(\)\[\]\{\},.]/g, "")
        .replace(/[-/]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// remove fence before JSON.parse
function removeCodeFences(raw: string): string {
    return raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/~~~json/gi, "")
        .replace(/~~~/g, "")
        .trim();
}


function safeParseJSON<T>(raw: string): T | null {
    try {
        return JSON.parse(removeCodeFences(raw));
    } catch {
        return null;
    }
}

// normalize skill names and remove duplicates, keeping the highest importance
function normalizeAndDuplicateSkills(
    skills: WeightedSkill[]
): WeightedSkill[] {
    const skillMap = new Map<string, WeightedSkill>();

    for (const skill of skills ?? []) {
        // LLM hallucination 방지
        const name = (skill?.name ?? "").trim();
        if (!name) continue;

        // nomalize key for comparison
        const normalizedKey = normalizeSkillKey(name);

        const importance = clamp(
            Number(skill.importance ?? 0.1) || 0.1,
            0.1,
            1.0
        );

        const cleanedSkill: WeightedSkill = {
            name,
            importance,
            category: skill.category === "preferred" ? "preferred" : "required",
            reason: String(skill?.reason ?? "").slice(0, 120)
        };


        const existing = skillMap.get(normalizedKey);
        // keep the skill with higher importance, if duplicate
        if (!existing || cleanedSkill.importance > existing.importance) {
            skillMap.set(normalizedKey, cleanedSkill);
        }
    }

    return Array.from(skillMap.values()).sort(
        (a, b) => b.importance - a.importance
    );
}

export async function extractWeightedSkillsFromJD(
    jdText: string
): Promise<WeightedSkill[]> {
    const prompt = `
    You are an assistant that analyzes job descriptions and assigns importance weights to each skill.

    TASK:
    1. Extract hard skills (languages, frameworks, tools, platforms, testing, cloud, etc.) mentioned in the job description.
    2. For each skill, assign:
        -  category: "required" or "preferred"
        - importance: a number between 0.1 (least important) and 1.0 (most important)
        - reason: a brief explanation (max 120 characters) for the assigned importance.
    

    IMPORTANCE HEURISTICS:
        - If described as "must", "required", "mandatory", "critical" -> +0.3
        - If mentioned in the first 20% of the JD -> +0.2
        - If mentioned more than once -> +0.1
        - If described as "preferred", "nice to have", "bonus" -> -0.2
        - Clamp importance to [0.1, 1.0]

    EXAMPLES:
    - "Must have 5+ years of React experience" 
    → name: "React", importance: 0.9, reason: "Must have + years specified"
    
    - "Nice to have: AWS experience"
    → name: "AWS", importance: 0.4, reason: "Nice to have"
    
    - "TypeScript" (mentioned once, middle of JD)
    → name: "TypeScript", importance: 0.5, reason: "Mentioned once"
    
        
    SKILL NORMALIZATION:
    - Treat "React", "ReactJS", "React.js" as the same skill
    - Use the most common name (e.g., "React" not "ReactJS")
    - If same skill appears as both required and preferred, use the higher importance


    RETURN ONLY VALID JSON EXACTLY IN THE FOLLOWING FORMAT:
    {
        "skills": [
            {
                "name": "React",
                "category": "required",
                "importance": 0.7, 
                "reason": "Required and appears early"
            },
        ]
    }
    
    JOB DESCRIPTION:
    ${jdText}
    `.trim();

    try {
        const res = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{role: "user", content: prompt}]
        });

        const raw = res.choices[0]?.message?.content ?? "";
        const parsed = safeParseJSON<{ skills: WeightedSkill[] }>(raw);

        const skills = Array.isArray(parsed?.skills) ? parsed!.skills : [];
        return normalizeAndDuplicateSkills(skills);
    } catch (error) {
        console.error("Error extracting weighted skills from JD:", error);
        return [];
    }
}
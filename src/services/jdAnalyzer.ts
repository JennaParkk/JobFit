import { openai } from "@/services/openaiClient";

type JDAnalysis = {
    requiredSkills: string[];
    preferredSkills: string[];
    level: string;
};

export async function extractSkillsFromJD(jdText: string): Promise<JDAnalysis> {
    const prompt = `
    You are an assistant that extracts structured information from job descriptions.

    Given the following job description, extract:
    - requiredSkills: list of required hard skills (short phrases)
    - preferredSkills: list of preferred hard skills (short phrases)
    - level: one of ["intern", "junior", "mid", "senior", "lead"]

    Rules:
    - Output ONLY skill names (1-3 words).
    - No duplicates (case insensitive).
    - Prefer concrete technologies over categories.
    - Do NOT include vague categories like "programming languages" or "frameworks".
    - Extract ONLY explicitly mentioned skills
    - If category appears with examples (e.g., "frameworks like React, Vue"), extract the examples only
    - Do NOT infer or assume unlisted skills

    LEVEL DETECTION RULES:
    - "intern" or "entry-level" → intern
    - "0-2 years" or "junior" → junior  
    - "2-5 years" or "mid-level" → mid
    - "5+ years" or "senior" → senior
    - "lead", "principal", "staff" → lead
    - If unclear, default to "mid"

    Return ONLY valid JSON with EXACT keys:
   {
        "requiredSkills": ["skill1", "skill2", ...],
        "preferredSkills": ["skill1", "skill2", ...],
        "level": "one of [\"intern\", \"junior\", \"mid\", \"senior\", \"lead\"]"
   }

    Job Description:

    ${jdText}
    `.trim();

    try {
        const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
    });
    const raw = res.choices[0].message.content || "{}";

    //  extract ```json ... ``` 
    const cleaned = raw
        .trim()
        .replace(/```json\s*/, "")
        .replace(/^```\s*/i, "")
        .replace(/```$/i, "")
        .trim();

    return JSON.parse(cleaned);

    } catch (error) {
        console.error("OpenAI JD analyzer failed, falling back:", error);

        return {
            requiredSkills: [],
            preferredSkills: [],
            level: "unknown",
        };
    }
}
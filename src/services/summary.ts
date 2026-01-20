import { openai } from "@/services/openaiClient";

export type aiSummaryResult = {
    strengths: string[];
    gaps: string[];
    overallFit: string;
};

export async function generateSummary (
    jdText: string,
    resumeText: string
): Promise<aiSummaryResult> {
    const prompt = `
    You are a technical recruiter analyzing candidate fit for a role. 

    Given the job description and resume, analyze:
    STRENGTHS (what makes this candidate a good fit):
    - Required skills they possess
    - Relevant experience level
    - Industry/domain match
    - Notable achievements that align with role

    GAPS (what's missing or weak):
    - Required skills they lack
    - Experience level mismatch
    - Missing qualifications
    - Areas where they're underqualified

    OVERALL FIT:
    - One sentence (max 20 words) summarizing match quality

    RULES:
    - Each bullet: max 10 words, actionable and specific
    - Prioritize REQUIRED skills over preferred
    - Be objective, not overly positive or negative
    - Focus on technical fit, not soft skills
    
    Given the job description and the resume below, return ONLY valid JSON with the following structure:
    {
        "strengths": ["specific strength 1", "specific strength 2"],
        "gaps": ["specific gap 1", "specific gap 2"],
        "overallFit": "one sentence summary"
    }

    Job Description:
    ${jdText.slice(0, 3000)}

    Resume:
    ${resumeText.slice(0, 3000)}
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
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
            gaps: Array.isArray(parsed.gaps) ? parsed.gaps : [],
            overallFit: typeof parsed.overallFit === "string" ? parsed.overallFit : "",
        };
    } catch (error) {
        console.error("OpenAI summary generation failed:", error);
        return {
            strengths: [],
            gaps: [],
            overallFit: "summary not available",
        };
    }
}

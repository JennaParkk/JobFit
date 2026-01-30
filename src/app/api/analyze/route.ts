import { extractSkillsFromJD } from "@/services/jdAnalyzer";
import { extractSkillsFromResume } from "@/services/resumeAnalyzer";
import { NextResponse } from "next/server";
import { generateSummary } from "@/services/summary";

// semantic similarity utils
import { createEmbedding } from "@/lib/embeddings";
import { cosineSimilarity, semanticToPercent } from "@/lib/similarity";

import { extractWeightedSkillsFromJD } from "@/services/jdWeighting";

import {
    normalizeSkill,
    computeMissingSkills,
    computeWeightedSkillScore,
    computeFinalMatchScore,
    computeImportanceWeightedScore,
} from "@/lib/weightedScore";
import type { SkillItem, skillGroup } from "@/lib/weightedScore";

const pdfParse = require("pdf-parse/lib/pdf-parse.js");

// Enable Node.js runtime for this route
export const runtime = "nodejs";

// clean JD skills by removing generic/junk skills
function cleanJDSkills(skills: string[]) {
    const junk = new Set([
        "programming languages",
        "programming language",
        "proficiency in programming languages",
        "front end frameworks",
        "front-end frameworks",
        "frontend frameworks",
    ]);

    // normalize and filter out junk skills
    const cleaned = skills
        .map((s) => s.replace(/^proficiency in\s+/i, "").trim())
        .map((s) => s.replace(/^experience with\s+/i, "").trim())
        .map((s) => s.replace(/^familiarity with\s+/i, "").trim())
        .map((s) => s.replace(/^knowledge of\s+/i, "").trim())
        .map((s) => s.replace(/^experience in\s+/i, "").trim())
        .filter((s) => s.length >0)
        .filter((s) => !junk.has(normalizeSkill(s)));
    
    const unique = Array.from(new Map(cleaned.map((s) => [normalizeSkill(s), s])).values());

    return unique;
    
}

type RawSkillGroup = {
    type: "any_of";
    items: string[];
};

function normalizeGroups(groups: RawSkillGroup[]): RawSkillGroup[] {
    return (groups ?? []).map((group) => ({
        type: group.type,
        items: Array.from(
            new Set((group.items ?? []).map(normalizeSkill))
        ),
    }));
}

function toSkillItem(label: string): SkillItem {
    return { label, key: normalizeSkill(label) };
}

function normalizeGroupsToSkillItems(groups: RawSkillGroup[]): skillGroup[] {
    return (groups ?? []).map((group) => ({
        type: group.type,
        items: Array.from(
            new Map(
                (group.items ?? []).map((label) => {
                    const key = normalizeSkill(label);
                    return [key, { label, key }];
                })
            ).values()
        ),
    }));
}


const MIN_JD_LENGTH = 50;

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const jdText = ((formData.get("jdText") as string) ?? "").trim();
        const resume = formData.get("resume");
        const resumeFile = resume instanceof File ? resume : null;

        if (!jdText) {
            return NextResponse.json(
                { error: "Job description is required." },
                { status: 400 }
            );
        }
        if (jdText.length < MIN_JD_LENGTH) {
            return NextResponse.json(
                { error: "Job description is too short. Please paste the full description." },
                { status: 400 }
            );
        }
        if (!resumeFile) {
            return NextResponse.json(
                { error: "No resume file uploaded." },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await resumeFile.arrayBuffer());
        const parsed = await pdfParse(buffer);
        const resumeText = (parsed.text ?? "").trim();

        if (!resumeText.trim()) {
            return NextResponse.json(
                { error: "Failed to extract text from resume PDF." },
                { status: 400 }
            );
        }

        // 1) embedding 기반 semantic similarity 계산
    const[jdEmbedding, resumeEmbedding] = await Promise.all([
        createEmbedding(jdText),
        createEmbedding(resumeText)
    ]);

    const semanticSim = cosineSimilarity(jdEmbedding, resumeEmbedding); // -1 to 1
    const semanticScore = semanticToPercent(semanticSim); // 0 to 100

    // 2) AI summary
    const aiSummary = await generateSummary(jdText, resumeText);

    // 3) Skill extraction through LLM)
    const [jdAnalysis, resumeAnalysis, weightedSkills] = await Promise.all([
        extractSkillsFromJD(jdText),
        extractSkillsFromResume(resumeText),
        extractWeightedSkillsFromJD(jdText),
    ]); 

    // 4) combine tools and concepts as resume skills + normalize
    const resumeSkillsRaw = [
        ...(resumeAnalysis.tools ?? []),
        ...(resumeAnalysis.concepts ?? []),
    ];

    const resumeSkills = Array.from(
        // key: normalized skill name, value: original skill name
        new Map(
            resumeSkillsRaw.map((s) => [normalizeSkill(s), s])
        ).values()
    );
    const resumeSkillKeys = resumeSkills.map((s) => normalizeSkill(s));

    // 5) clean JD required/preferred skills
    const jdRequiredRaw = jdAnalysis.requiredSkills ?? [];
    const jdPreferredRaw = jdAnalysis.preferredSkills ?? [];
    const jdRequiredGroupsRaw = jdAnalysis.requiredGroups ?? [];
    const jdPreferredGroupsRaw = jdAnalysis.preferredGroups ?? [];
    const jdRequired = cleanJDSkills(jdRequiredRaw);
    const jdPreferred = cleanJDSkills(jdPreferredRaw);
    const jdRequiredGroups = normalizeGroups(jdRequiredGroupsRaw);
    const jdPreferredGroups = normalizeGroups(jdPreferredGroupsRaw);

    const jdRequiredItems = jdRequired.map(toSkillItem);
    const jdPreferredItems = jdPreferred.map(toSkillItem);
    const jdRequiredGroupItems = normalizeGroupsToSkillItems(jdRequiredGroupsRaw);
    const jdPreferredGroupItems = normalizeGroupsToSkillItems(jdPreferredGroupsRaw);

    // 6) Missing Skills
    const missingRequired = computeMissingSkills(jdRequiredItems, resumeSkillKeys);
    const missingPreferred = computeMissingSkills(jdPreferredItems, resumeSkillKeys);

    // 7) Weighted Skill Score
    const weighted = computeWeightedSkillScore({
        required: jdRequiredItems,
        preferred: jdPreferredItems,
        requiredGroups: jdRequiredGroupItems,
        preferredGroups: jdPreferredGroupItems,
        resumeSkillKeys,
        requiredWeight: 0.9, // 80% weight to required skills
    });

    // compute weighted skill score 
    const importanceWeightedScore = computeImportanceWeightedScore(
        weightedSkills,
        resumeSkillKeys
    );

    // 8) Final Match Score
    //     weights: 
    //      semantic score weight: 50%
    //      skill score weight: 50%
    const matchScore = computeFinalMatchScore({
        semanticScore,
        // skillScore: weighted.finalScore,
        skillScore: Math.round(
            weighted.finalScore * 0.5 + importanceWeightedScore * 0.5
        ),
        semanticWeight: 0.5,
    });

    //////////////////////////////////
    // debug log
    console.log("analyze result:", {
        jdAnalysis,
        jdRequired,
        jdPreferred,
        jdRequiredGroups,
        jdPreferredGroups,
        resumeSkills,
        semanticScore,
        skillScore: weighted.finalScore,
        matchScore,
        missingRequired,
        missingPreferred,
        scoreBreakdown: {
            requiredScore: weighted.requiredScore,
            preferredScore: weighted.preferredScore,
        },
        aiSummary,
    });
    //////////////////////////////////

    return NextResponse.json({
        ok: true,
        __version: "route-2026-01-18-v2",
        
        jdAnalysis,
        jdRequired,
        jdPreferred,
        jdRequiredGroups: jdRequiredGroups,
        jdPreferredGroups: jdPreferredGroups,

        resumeSkills,

        semanticScore,
        skillScore: weighted.finalScore,
        matchScore,

        missingSkills: {
            required: missingRequired,
            preferred: missingPreferred,
        },
        
        scoreBreakdown: {
            requiredScore: weighted.requiredScore,
            preferredScore: weighted.preferredScore,
        },

        aiSummary: {
            strengths: aiSummary.strengths,
            gaps: aiSummary.gaps,
            overallFit: aiSummary.overallFit,
        },

        summary: `Received JD (${jdText.length} chars). Extracted resume text length: ${resumeText.length} chars.`,
    });
    } catch (err) {
        console.error("Analyze route error:", err);
        return NextResponse.json(
            { error: "Analysis failed. Please try again." },
            { status: 500 }
        );
    }
}

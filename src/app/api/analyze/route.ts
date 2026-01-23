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
    type SkillItem,
} from "@/lib/weightedScore";

const pdfParse = require("pdf-parse/lib/pdf-parse.js");

// Enable Node.js runtime for this route
export const runtime = "nodejs";

type RawSkillGroup = {
    type: "any_of";
    items: string[];
};

type SkillGroupItems = {
    type: "any_of";
    items: SkillItem[];
};

function toSkillItems(skills: string[]): SkillItem[] {
    const items: SkillItem[] = [];
    const seen = new Set<string>();

    for (const raw of skills ?? []) {
        const label = String(raw ?? "").trim();
        if (!label) continue;

        const key = normalizeSkill(label);
        if (seen.has(key)) continue;

        seen.add(key);
        items.push({ label, key });
    }

    return items;
}

function buildGroupItems(groups: RawSkillGroup[]): SkillGroupItems[] {
    return (groups ?? []).map((group) => ({
        type: group.type,
        items: toSkillItems(group.items ?? []),
    }));
}

// clean JD skills by removing generic/junk skills
function cleanJDSkills(skills: string[]): SkillItem[] {
    const junk = new Set([
        "programming languages",
        "programming language",
        "proficiency in programming languages",
        "front end frameworks",
        "front-end frameworks",
        "frontend frameworks",
    ].map(normalizeSkill));

    // normalize and filter out junk skills
    const cleaned = skills
        .map((s) => s.replace(/^proficiency in\s+/i, "").trim())
        .map((s) => s.replace(/^experience with\s+/i, "").trim())
        .map((s) => s.replace(/^familiarity with\s+/i, "").trim())
        .map((s) => s.replace(/^knowledge of\s+/i, "").trim())
        .map((s) => s.replace(/^experience in\s+/i, "").trim())
        .filter((s) => s.length >0);

    return toSkillItems(cleaned).filter((item) => !junk.has(item.key));
}


export async function POST(req: Request) {
    const formData = await req.formData();

    // FormData 에서 jdText와 resume 파일 추출
    const jdText = (formData.get("jdText") as string) ?? "";
    const resume = formData.get("resume");

    const resumeFile = resume instanceof File ? resume : null;

    if (!resumeFile) {
        return NextResponse.json({ error: "No resume file uploaded." }, { status: 400 });
    }

    // ArrayBuffer -> Node Buffer
    const buffer = Buffer.from(await resumeFile.arrayBuffer());
    // PDF -> Text 변환
    const parsed = await pdfParse(buffer);
    const resumeText = (parsed.text ?? "").trim();


    if (!resumeText.trim()) {
        return NextResponse.json({ error: "Failed to extract text from resume PDF." }, { status: 400 });
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

    const resumeSkillItems = toSkillItems(resumeSkillsRaw);
    const resumeSkills = resumeSkillItems.map((item) => item.label);
    const resumeSkillKeys = resumeSkillItems.map((item) => item.key);

    // 5) clean JD required/preferred skills
    const jdRequiredRaw = jdAnalysis.requiredSkills ?? [];
    const jdPreferredRaw = jdAnalysis.preferredSkills ?? [];
    const jdRequiredGroupsRaw = jdAnalysis.requiredGroups ?? [];
    const jdPreferredGroupsRaw = jdAnalysis.preferredGroups ?? [];
    const jdRequiredItems = cleanJDSkills(jdRequiredRaw);
    const jdPreferredItems = cleanJDSkills(jdPreferredRaw);
    const jdRequiredGroupItems = buildGroupItems(jdRequiredGroupsRaw);
    const jdPreferredGroupItems = buildGroupItems(jdPreferredGroupsRaw);
    const jdRequired = jdRequiredItems.map((item) => item.label);
    const jdPreferred = jdPreferredItems.map((item) => item.label);
    const jdRequiredGroups = jdRequiredGroupItems.map((group) => ({
        type: group.type,
        items: group.items.map((item) => item.label),
    }));
    const jdPreferredGroups = jdPreferredGroupItems.map((group) => ({
        type: group.type,
        items: group.items.map((item) => item.label),
    }));

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
        requiredWeight: 0.8, // 80% weight to required skills
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

}

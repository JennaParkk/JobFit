import type { WeightedSkill } from "@/services/jdWeighting";

export function normalizeSkill(skill: string): string {
    if (typeof skill !== "string") return "";
    const base = skill
        .toLocaleLowerCase()
        .replace(/[\(\)\[\]\{\},.]/g, "")
        .replace(/[-/]/g, " ")
        .replace(/\s+/g, " ")    
        .trim();

    const aliases: Record<string, string> = {
        "js": "javascript",
        "ts": "typescript",
        "html5": "html",
        "css3": "css",
        "nodejs": "node",
        "reactjs": "react",
        "vuejs": "vue",
        "aws": "amazon web services",
        "gcp": "google cloud platform",
        "ci/cd": "ci cd",
        "c c++": "c++",
        "c/c++": "c++",
        "devops": "dev ops",
        "no sql": "nosql",
        "mongo db": "mongodb",
        "postgre sql": "postgresql",
        "k8s": "kubernetes",
        "tf": "terraform",
        "py": "python",
        "golang": "go",
        "rest api": "rest",
        "restful": "rest",
        "ml": "machine learning",
        "ai": "artificial intelligence",
        "nlp": "natural language processing",
        "ci cd": "continuous integration continuous deployment",
        "next": "nextjs",
        "next.js": "nextjs",
        "react.js": "react",
        "gitlab": "git",
        "github": "git",
        "restful apis": "rest",
        "apis": "rest",
        "deckgl": "deck.gl",
        "kepler.gl": "kepler",
    };

    return aliases[base] ?? base;
}

export type SkillItem = { label: string; key: string };
export type skillGroup = { type: "any_of"; items: SkillItem[] };

// check if any skill from an any_of group is present in resume skills
// return true if any skill is found, false otherwise
function matchAnyOfGroup(group: skillGroup, resumeSkillsSet: Set<string>): boolean {
    return group.items.some((item) => resumeSkillsSet.has(item.key));
}

// compute skill score considering both individual skills and any_of groups
function computeSkillScoreWithGroups(
    jdSkills: SkillItem[],
    jdGroups: skillGroup[],
    resumeSkillKeys: string[]
): number {
    const resumeSet = new Set(resumeSkillKeys ?? []);
    const skillHits = jdSkills.filter((s) => resumeSet.has(s.key)).length;
    const groupHits = jdGroups.filter((g) => matchAnyOfGroup(g, resumeSet)).length;

    const totalUnits = (jdSkills?.length ?? 0) + (jdGroups?.length ?? 0);
    if (totalUnits === 0) return 0;

    return Math.round(((skillHits + groupHits) / totalUnits) * 100);
}


// compute skill score as percentage of JD skills found in resume skills
// params: 
//  jdSkills: string[] - list of job description skills
// resumeSkills: string[] - list of resume skills
// returns: number - skill score as percentage (0 - 100)
// logic:
//  - if jdSkills is empty, return 0
//  - normalize resume skills into a set for fast lookup
//  - count how many jdSkills are present in resumeSkills
//  - compute score as (hit / total JD skills) * 100 and round to nearest integer
export function computeSkillScore(jdSkills: SkillItem[], resumeSkillKeys: string[]): number {
    if (!Array.isArray(jdSkills) || jdSkills.length === 0) return 0;

    const resumeSet = new Set(resumeSkillKeys ?? []);
    const hit = jdSkills.filter((s) => resumeSet.has(s.key)).length;

    return Math.round((hit / jdSkills.length) * 100);
}

// compute missing skills from JD required skills vs resume skills
// params:
//  jdSkills: string[] - list of job description skills
//  resumeSkills: string[] - list of resume skills
// returns: string[] - list of missing skills from JD not found in resume
// logic:
//  - normalize resume skills into a set for fast lookup
//  - filter jdSkills to only those not present in resumeSkills
export function computeMissingSkills(jdSkills: SkillItem[], resumeSkillKeys: string[]): string[] {
    const resumeSet = new Set(resumeSkillKeys ?? []);
    return jdSkills.filter((s) => !resumeSet.has(s.key)).map((s) => s.label);
}

// compute weighted skill score from required and preferred skills
// params:
//  required, preferred, requiredGroups, preferredGroups: string[], resumeSkills
// requiredWeight: weight for required skills (default 0.8)
// logic: 
// 1) compute required skill score using computeSkillScoreWithGroups
// 2) compute preferred skill score using computeSkillScoreWithGroups
// 3) combine required and preferred scores using weighted average
//    default weight: required 0.8, preferred 0.2
export function computeWeightedSkillScore(params: {
    required: SkillItem[];
    preferred: SkillItem[];
    requiredGroups?: skillGroup[];
    preferredGroups?: skillGroup[];
    resumeSkillKeys: string[];
    requiredWeight?: number; // default 0.8
}): { requiredScore: number; preferredScore: number; finalScore: number } {
    
    const requiredWeight = typeof params.requiredWeight === "number" ? params.requiredWeight : 0.8;
    const preferredWeight = 1 - requiredWeight;

    const requiredScore = computeSkillScoreWithGroups(
        params.required,
        params.requiredGroups ?? [],
        params.resumeSkillKeys
    );

    const preferredScore = computeSkillScoreWithGroups(
        params.preferred,
        params.preferredGroups ?? [],
        params.resumeSkillKeys
    );

    const finalScore = Math.round(
        requiredScore * requiredWeight + preferredScore * preferredWeight
    );

    return {
        requiredScore,
        preferredScore,
        finalScore,
    };  
}

// compute final match score from semantic and skill scores
// params:
//  semanticScore: number - semantic similarity score (0 - 100)
//  skillScore: number - skill match score (0 - 100)
//  semanticWeight: number - weight for semantic score (default 0.5)
// logic:
// embedding score and skill score are combined using weighted average
// default weights are 0.5 each
export function computeFinalMatchScore(params: {
    semanticScore: number; // 0 - 100
    skillScore: number; // 0 - 100
    semanticWeight?: number; // default 0.5
}): number {
    const semanticWeight = typeof params.semanticWeight === "number" ? params.semanticWeight : 0.5;
    const skillWeight = 1 - semanticWeight;

    return Math.round(
        params.semanticScore * semanticWeight + params.skillScore * skillWeight
    );
}

export function computeImportanceWeightedScore(
    jdSkills: WeightedSkill[],
    resumeSkillKeys: string[]
): number {
    if (!Array.isArray(jdSkills) || jdSkills.length === 0) return 0;
    
    const resumeSet = new Set(resumeSkillKeys ?? []);

    let totalImportance = 0;
    let matchedImportance = 0;

    for (const skill of jdSkills) {
        const importance = typeof skill.importance === "number" ? skill.importance : 0;
        if (importance <= 0) continue;

        totalImportance += importance;

        if (skill.key && resumeSet.has(skill.key)) {
            matchedImportance += importance;
        }
    }

    if (totalImportance === 0) return 0;

    return Math.round((matchedImportance / totalImportance) * 100);
}

        



export function normalizeSkill(skill: string): string {
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
    };

    return aliases[base] ?? base;
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
export function computeSkillScore(jdSkills: string[], resumeSkills: string[]): number {
    if (!Array.isArray(jdSkills) || jdSkills.length === 0) return 0;

    const resumeSet = new Set((resumeSkills ?? []).map(normalizeSkill));
    const hit = jdSkills.filter((s) => resumeSet.has(normalizeSkill(s))).length;

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
export function computeMissingSkills(jdSkills: string[], resumeSkills: string[]): string[] {
    const resumeSet = new Set((resumeSkills ?? []).map(normalizeSkill));
    return jdSkills.filter((s) => !resumeSet.has(normalizeSkill(s)));
}

// compute weighted skill score from required and preferred skills
// params:
//  required: string[] - list of required JD skills
//  preferred: string[] - list of preferred JD skills
//  resumeSkills: string[] - list of resume skills
// required vs. preferred weight: 
// - default required weight is 0.8, preferred weight is 0.2
// logic:
// - compute required skill score
// - compute preferred skill score
// - compute final score as weighted sum of required and preferred scores
export function computeWeightedSkillScore(params: {
    required: string[];
    preferred: string[];
    resumeSkills: string[];
    requiredWeight?: number; // default 0.8
}): { requiredScore: number; preferredScore: number; finalScore: number } {
    const requiredWeight = typeof params.requiredWeight === "number" ? params.requiredWeight : 0.8;
    const preferredWeight = 1 - requiredWeight;

    const requiredScore = computeSkillScore(params.required, params.resumeSkills);
    const preferredScore = computeSkillScore(params.preferred, params.resumeSkills);

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
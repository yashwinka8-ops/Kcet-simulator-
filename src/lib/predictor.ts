import collegesUnifiedRaw from "./data/colleges_unified.json";
import { Branch, PredictorInput, College, PredictionResult } from "./types";

interface UnifiedCutoff {
    branch_id: string;
    category: string;
    r1: number | null;
    r2: number | null;
    r3: number | null;
}

interface UnifiedCollege {
    college_id: string;
    id: string;
    name: string;
    city: string;
    region: string;
    kcet_cutoffs: UnifiedCutoff[];
}

const collegesUnified = (collegesUnifiedRaw as any).colleges as UnifiedCollege[];
const branches = (collegesUnifiedRaw as any).branches as Branch[];

// Create lookups for performance
const branchLookup = new Map(branches.map(b => [b.branch_id, b]));

function calculateProbability(rank: number, cutoff: number): number {
  if (!cutoff) return 0;
  const ratio = rank / cutoff;
  if (ratio < 0.5) return 99;
  if (ratio < 0.9) return Math.round(99 - (ratio - 0.5) * 40);
  if (ratio < 1.0) return Math.round(80 - (ratio - 0.9) * 150);
  if (ratio < 1.1) return Math.round(50 - (ratio - 1.0) * 200);
  return Math.max(5, Math.round(30 - (ratio - 1.1) * 100));
}

export function predictColleges(input: PredictorInput, liveColleges: College[]) {
  // Create dynamic lookup for live colleges (for rich metadata)
  const collegeMetadataLookup = new Map(liveColleges.map(c => [c.college_id, c]));

  const safe: PredictionResult[] = [];
  const moderate: PredictionResult[] = [];
  const dream: PredictionResult[] = [];

  for (const uCollege of collegesUnified) {
    const metadata = collegeMetadataLookup.get(uCollege.college_id);
    if (!metadata) continue;

    // Filter by Region if specified
    const effectiveRegion = uCollege.region || metadata.region;
    if (input.regions.length > 0 && !input.regions.includes(effectiveRegion)) continue;
    // Filter by College if specified
    if (input.colleges.length > 0 && !input.colleges.includes(uCollege.college_id)) continue;

    for (const cutoff of uCollege.kcet_cutoffs) {
        // Filter by Branch if specified
        if (input.branches.length > 0 && !input.branches.includes(cutoff.branch_id)) continue;
        
        // Determine effective cutoff for the selected round with fallback
        let effectiveCutoff = 0;
        let isFallback = false;
        
        // Logical Match: You qualify for your specific category OR the open GM category
        const isTargetCategory = cutoff.category === input.category;
        const isGMFallback = cutoff.category === 'GM' && input.category !== 'GM';

        if (isTargetCategory || isGMFallback) {
            const r3 = cutoff.r3 || 0;
            const r2 = cutoff.r2 || 0;
            const r1 = cutoff.r1 || 0;

            if (input.round === 3) {
                effectiveCutoff = r3 || r2 || r1;
            } else if (input.round === 2) {
                effectiveCutoff = r2 || r1;
            } else {
                effectiveCutoff = r1;
            }
            
            if (isGMFallback) isFallback = true;
        } else {
            continue;
        }

        if (effectiveCutoff <= 0) continue;

        const branch = branchLookup.get(cutoff.branch_id) || {
            branch_id: cutoff.branch_id,
            branch_code: cutoff.branch_id,
            branch_name: cutoff.branch_id
        };

        const prob = calculateProbability(input.rank, effectiveCutoff);

        const result: PredictionResult = {
            college: metadata,
            branch: branch as Branch,
            closing_rank: effectiveCutoff,
            level: "dream",
            probability: prob,
            isFallback
        };

        // If we have multiple cutoffs for the same branch (Target vs GM), 
        // we should prefer the one that gives a better probability or is the specific category.
        // For now, we'll push all and handle the UI or let them see both options.
        if (prob >= 80) {
            result.level = "safe";
            safe.push(result);
        } else if (prob >= 50) {
            result.level = "moderate";
            moderate.push(result);
        } else {
            result.level = "dream";
            dream.push(result);
        }
    }
  }

  const sortByRank = (a: PredictionResult, b: PredictionResult) => a.closing_rank - b.closing_rank;
  
  return {
    safe: safe.sort(sortByRank),
    moderate: moderate.sort(sortByRank),
    dream: dream.sort(sortByRank),
  };
}

export function getRoundDetails(collegeId: string, branchId: string, category: string) {
    const college = collegesUnified.find(c => c.college_id === collegeId);
    if (!college) return [];
    
    const cutoff = college.kcet_cutoffs.find(co => co.branch_id === branchId && co.category === category);
    if (!cutoff) return [];

    return [
        { round: 1, closing_rank: cutoff.r1 },
        { round: 2, closing_rank: cutoff.r2 },
        { round: 3, closing_rank: cutoff.r3 }
    ].filter(r => r.closing_rank !== null);
}

export function getLevelColor(level: string) {
  switch (level) {
    case "safe": return "text-emerald-400";
    case "moderate": return "text-amber-400";
    default: return "text-rose-400";
  }
}

export function getLevelBg(level: string) {
  switch (level) {
    case "safe": return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    case "moderate": return "bg-amber-500/10 border-amber-500/30 text-amber-400";
    default: return "bg-rose-500/10 border-rose-500/30 text-rose-400";
  }
}

export const CATEGORIES = ["1G", "1K", "1R", "2AG", "2AK", "2AR", "2BG", "2BK", "2BR", "3AG", "3AK", "3AR", "3BG", "3BK", "3BR", "GM", "GMK", "GMR", "SCG", "SCK", "SCR", "STG", "STK", "STR"];

export const BRANCHES = branches.map(b => ({ id: b.branch_id, name: b.branch_name }));

export const CS_IT_BRANCHES = ['COMP', 'INFO', 'ARTI', 'AIML', 'DATS', 'CYBE', 'BTEC', 'CSE', 'ISE', 'AIDS', 'CSBS', 'CSEDS', 'CYBER', 'RAI', 'DS', 'IOT'];
export const CORE_BRANCHES = ['MECH', 'CIVI', 'ELEE', 'ELEC', 'CHEM', 'BIOT', 'INDU', 'EEE', 'ECE', 'CIVIL', 'EIE', 'TCE', 'ECM', 'MSE', 'AUTO', 'MEC', 'AERO', 'AS', 'MARINE', 'BT', 'BME', 'MED', 'ENV', 'POLY', 'SILK', 'CERAMIC', 'MINING', 'PETRO', 'ARCH', 'PLAN', 'TEXTILE', 'PRINT', 'INST', 'CONSTR', 'AGRI', 'FOOD'];

export const TOP_5_COLLEGES = ['E005', 'E009', 'E006', 'E003', 'E001'];
export const TOP_10_COLLEGES = ['E005', 'E009', 'E006', 'E003', 'E001', 'E007', 'E008', 'E022', 'E021', 'E103'];


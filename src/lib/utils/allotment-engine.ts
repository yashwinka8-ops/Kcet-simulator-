/**
 * KCET Allotment Engine v2
 * ─────────────────────────────────────────────────────────────────
 * Replicates the KEA (Karnataka Examinations Authority) allotment
 * logic for UGCET Engineering counselling.
 *
 * ── HOW KEA ALLOTMENT WORKS ─────────────────────────────────────
 * 1. Student submits options in order of preference (priority 1, 2 …).
 * 2. For each option the system checks ALL categories the student is
 *    eligible for and collects every category where the cutoff is
 *    non-null AND the student's rank ≤ the cutoff.
 * 3. Among all qualifying categories, the MOST COMPETITIVE one
 *    (lowest priority score, i.e., closest to GM) is selected.
 *    This ensures:
 *    • If a student clears the GM cutoff they get a merit seat.
 *    • Reserved seats are preserved for students who really need them.
 *    • A null for 3AR does NOT block the student — 3AG or GM will
 *      still be checked. e.g. rank 5000, 3AR=null, 3AG=5200 → ✅ 3AG
 * 4. The first option (lowest choice number) where the student
 *    qualifies is the allotted seat.
 * 5. Round-specific JSON is loaded dynamically (Mock / R1 / R2 / R3).
 *
 * ── CATEGORY PRIORITY ORDER ─────────────────────────────────────
 * Based on how competitive each category is (GM = most competitive,
 * STK = least competitive / most lenient cutoff):
 *
 *   GM → GMR → GMK
 *   → 3BG → 3BR → 3BK
 *   → 3AG → 3AR → 3AK
 *   → 2BG → 2BR → 2BK
 *   → 2AG → 2AR → 2AK
 *   → 1G  → 1R  → 1K
 *   → SCG → SCR → SCK
 *   → STG → STR → STK
 *
 * Within each caste group:  General (G) < Rural (R) < Kannada Medium (K)
 * meaning G is most competitive, K is least competitive.
 *
 * ── ELIGIBILITY RULES ───────────────────────────────────────────
 * Every student is eligible for: GM, GMR (if rural), GMK (if KM)
 * Reserved-category students are additionally eligible for:
 *   • Base G quota (e.g. 3AG for a 3A student)
 *   • Rural variant (3AR) if rural
 *   • KM variant    (3AK) if Kannada medium
 *
 * A student with category 3AR CANNOT use 3BG / 2AG / 1G / SCG / STG
 * seats — those belong to different caste communities.
 */

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

export type KcetRound = 0 | 1 | 2 | 3 | 4;

export interface AllotmentOption {
  /** UI priority number (1 = first preference) */
  priority: number;
  /** College ID, e.g. "E001" */
  collegeId: string;
  collegeName: string;
  /** Representative branch code used in the UI, e.g. "CSE", "ECE" */
  branchId: string;
  branchName: string;
  fees?: string;
}

export interface AllotmentResult {
  collegeId: string;
  collegeName: string;
  branchId: string;
  branchName: string;
  /** The category under which the seat was allotted, e.g. "3AG" */
  allottedCategory: string;
  /** The published cutoff rank for that category */
  cutoffRank: number;
  /** Student's choice (priority) number */
  choiceNo: number;
  collegeFees: string;
}

// ─────────────────────────────────────────────────────────────────
// Category priority scores
// Lower number = more competitive = checked first as the "best" seat
// ─────────────────────────────────────────────────────────────────

export const CATEGORY_PRIORITY: Record<string, number> = {
  // ── General / Open seats ──────────────────────────────────────
  GM:  1,
  GMR: 2,
  GMK: 3,
  // ── OBC-3B ────────────────────────────────────────────────────
  '3BG': 4,
  '3BR': 5,
  '3BK': 6,
  // ── OBC-3A ────────────────────────────────────────────────────
  '3AG': 7,
  '3AR': 8,
  '3AK': 9,
  // ── OBC-2B ────────────────────────────────────────────────────
  '2BG': 10,
  '2BR': 11,
  '2BK': 12,
  // ── OBC-2A ────────────────────────────────────────────────────
  '2AG': 13,
  '2AR': 14,
  '2AK': 15,
  // ── Category-1 ────────────────────────────────────────────────
  '1G':  16,
  '1R':  17,
  '1K':  18,
  // ── SC (S1-S4 in 2026) ────────────────────────────────────────
  S1G: 19,
  S1R: 20,
  S1K: 21,
  S2G: 22,
  S2R: 23,
  S2K: 24,
  S3G: 25,
  S3R: 26,
  S3K: 27,
  S4G: 28,
  S4R: 29,
  S4K: 30,
  // ── ST ────────────────────────────────────────────────────────
  STG: 31,
  STR: 32,
  STK: 33,
};

/** Fallback score for any unrecognised category (treated as least competitive). */
const UNKNOWN_PRIORITY = 99;

function getCategoryPriority(cat: string): number {
  return CATEGORY_PRIORITY[cat] ?? UNKNOWN_PRIORITY;
}

// ─────────────────────────────────────────────────────────────────
// Branch aliases
// Maps UI representative codes → raw codes in the cutoff JSON files
// ─────────────────────────────────────────────────────────────────

const BRANCH_ALIASES: Record<string, string[]> = {
  CSE:  ['CSE', 'CS', 'BCS', 'BTCS', 'BW', 'BQ', 'BV', 'CO', 'DL', 'DV', 'ZC', 'DK', 'DM', 'YN'],
  ISE:  ['ISE', 'IS', 'BIS', 'IE', 'IZ', 'CU', 'CX', 'BI', 'BU'],
  ECE:  ['ECE', 'EC', 'BEC', 'BB', 'YO', 'EB', 'II', 'DY', 'YV', 'YG', 'CM', 'EV', 'VL'],
  AIML: ['AIML', 'AM', 'AI', 'CA', 'CF', 'BH', 'AW', 'YD', 'YK', 'LM', 'ZW', 'ZB', 'AV', 'LE'],
  AIDS: ['AIDS', 'AD', 'BG', 'ZH', 'ZR', 'DC', 'IA'],
  EEE:  ['EEE', 'EE', 'BJ', 'YP', 'YF'],
  MECH: ['MECH', 'ME', 'DB', 'MK', 'MM', 'ZT', 'YT', 'YI'],
  CIVIL:['CIVIL', 'CE', 'BP', 'CK', 'CV', 'DU', 'DX', 'YE', 'ZL'],
  BT:   ['BT', 'BO', 'YJ', 'BA', 'EA'],
  CHEM: ['CHEM', 'CH'],
  CYBER:['CYBER', 'CY', 'BX', 'LG', 'LH', 'DW', 'ZU'],
  DS:   ['DS', 'BF', 'BZ', 'CN', 'CQ', 'LD', 'YB', 'ZQ'],
  EIE:  ['EIE', 'EI', 'EL'],
  ETE:  ['ETE', 'ET', 'TC'],
  AERO: ['AERO', 'AE', 'AN', 'BL', 'ZA', 'SE'],
  AUTO: ['AUTO', 'AU', 'AT'],
  IEM:  ['IEM', 'IM', 'IP'],
  RAI:  ['RAI', 'RI', 'RA', 'RO', 'DF', 'DH', 'DI', 'DJ', 'YA', 'BR'],
  TT:   ['TT', 'ST', 'TX'],
  VLSI: ['VLSI', 'VL', 'DN', 'CM', 'EV', 'YC'],
  ML:   ['ML', 'MD', 'YL'],
  IOT:  ['IOT', 'OT', 'IC', 'IO', 'LK'],
  CB:   ['CB', 'ZO', 'LJ'],
  CC:   ['CC', 'CL', 'ER', 'ES', 'EZ'],
  CD:   ['CD', 'ZM'],
  IT:   ['IT', 'CW', 'BI', 'ZV', 'LF', 'YW', 'BY', 'YX', 'YY', 'YU']
};

// ─────────────────────────────────────────────────────────────────
// Step 1 — Normalise the student's category
// ─────────────────────────────────────────────────────────────────

/**
 * Converts any category input to the "G" (general within caste) form.
 *   2AR → 2AG   (Rural → General quota of same caste)
 *   SCK → SCG
 *   GMR → GM
 *   2A  → 2AG   (shorthand)
 */
function toBaseG(cat: string): string {
  if (cat === 'GM' || cat === 'GMR' || cat === 'GMK') return 'GM';
  if (/^[123][AB]?[KR]$/.test(cat)) return cat.slice(0, -1) + 'G';
  if (/^S[1234][KR]$/.test(cat)) return cat.slice(0, -1) + 'G';
  if (/^ST[KR]$/.test(cat)) return 'STG';
  if (/^1[KR]$/.test(cat))  return '1G';

  const shorthand: Record<string, string> = {
    '1': '1G', '2A': '2AG', '2B': '2BG',
    '3A': '3AG', '3B': '3BG', 'S1': 'S1G', 'S2': 'S2G', 'S3': 'S3G', 'S4': 'S4G', 'ST': 'STG',
  };
  return shorthand[cat] ?? cat;
}

/**
 * Strips the trailing G from a base-G code to get the prefix.
 * 3AG → 3A,  SCG → SC,  1G → 1,  GM → GM (no change)
 */
function stripG(baseG: string): string {
  if (baseG === 'GM') return 'GM';
  return baseG.endsWith('G') ? baseG.slice(0, -1) : baseG;
}

// ─────────────────────────────────────────────────────────────────
// Step 2 — Build the student's full eligible category list
// ─────────────────────────────────────────────────────────────────

/**
 * Returns ALL categories the student may legitimately use,
 * sorted by priority score (most competitive first).
 *
 * Example — student category: 3AR (= Rural 3A), isRural: true
 *   Eligible: ['GM', 'GMR', '3AG', '3AR']
 *   (ordered by priority: GM=1, GMR=2, 3AG=7, 3AR=8)
 *
 * Example — student category: 2AG, isRural: true, isKannadaMedium: true
 *   Eligible: ['GM', 'GMR', 'GMK', '2AG', '2AR', '2AK']
 */
export function getEligibleCategories(
  rawCategory: string,
  isRural: boolean,
  isKannadaMedium: boolean,
): string[] {
  const cat = (rawCategory || 'GM').trim().toUpperCase();
  const baseG = toBaseG(cat);

  // Detect rural / KM from the category suffix itself (3AR means rural)
  const catIsRural = cat.endsWith('R') || isRural;
  const catIsKM    = cat.endsWith('K') || isKannadaMedium;

  const eligible = new Set<string>();

  // ── General / Open seats ────────────────────────────────────────
  eligible.add('GM');
  if (catIsRural) eligible.add('GMR');
  if (catIsKM)    eligible.add('GMK');

  // ── Reserved seats (only for their own caste group) ─────────────
  if (baseG !== 'GM') {
    const prefix = stripG(baseG); // e.g. "3A" from "3AG"
    eligible.add(baseG);             // e.g. 3AG
    if (catIsRural) eligible.add(prefix + 'R'); // e.g. 3AR
    if (catIsKM)    eligible.add(prefix + 'K'); // e.g. 3AK
  }

  // Sort by priority score so most-competitive is first
  return [...eligible].sort((a, b) => getCategoryPriority(a) - getCategoryPriority(b));
}

// ─────────────────────────────────────────────────────────────────
// Step 3 — Load round-specific cutoff data
// ─────────────────────────────────────────────────────────────────

export async function loadRoundCutoffs(round: KcetRound): Promise<Record<string, any>> {
  try {
    switch (round) {
      case 0: return (await import('@/lib/data/raw_cutoffs/kcet-cutoff-mock-round.json')).default as any;
      case 1: return (await import('@/lib/data/raw_cutoffs/first-round.json')).default as any;
      case 2: return (await import('@/lib/data/raw_cutoffs/kcet-round-2.json')).default as any;
      case 3:
      case 4:
        return (await import('@/lib/data/raw_cutoffs/round-3.json')).default as any;
    }
  } catch (err) {
    console.error(`[AllotmentEngine] Failed to load cutoff data for round ${round}:`, err);
  }
  return {};
}

// ─────────────────────────────────────────────────────────────────
// Step 4 — Resolve branch cutoffs (with alias fallback)
// ─────────────────────────────────────────────────────────────────

function resolveBranchCutoffs(
  cutoffsMap: Record<string, Record<string, number | null>>,
  branchId: string,
): Record<string, number | null> | null {
  if (cutoffsMap[branchId]) return cutoffsMap[branchId];

  const aliases = BRANCH_ALIASES[branchId] ?? [];
  for (const alias of aliases) {
    if (cutoffsMap[alias]) return cutoffsMap[alias];
  }

  // Reverse-alias check
  for (const [, list] of Object.entries(BRANCH_ALIASES)) {
    for (const alias of list) {
      if (alias === branchId) {
        const rep = Object.keys(BRANCH_ALIASES).find(k => BRANCH_ALIASES[k] === list)!;
        if (cutoffsMap[rep]) return cutoffsMap[rep];
      }
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────
// Step 5 — Core qualification check for one option
// ─────────────────────────────────────────────────────────────────

interface CategoryMatch {
  category: string;
  cutoffRank: number;
  priorityScore: number;
}

/**
 * Priority-based qualification check.
 *
 * Algorithm:
 *  1. Iterate through ALL eligible categories.
 *  2. Skip any category whose cutoff is null (no seats allocated).
 *  3. For each non-null cutoff, check if studentRank ≤ cutoffRank.
 *  4. Collect ALL categories where the student qualifies.
 *  5. Return the one with the LOWEST priority score (most competitive).
 *
 * Example:
 *  Student rank 5000, category 3AR (rural)
 *  Eligible (sorted): GM(1), GMR(2), 3AG(7), 3AR(8)
 *  Cutoffs: GM=4500, GMR=4800, 3AG=5200, 3AR=null
 *
 *  GM:  4500 < 5000  → doesn't qualify
 *  GMR: 4800 < 5000  → doesn't qualify
 *  3AG: 5200 ≥ 5000  → ✅ qualifies  (priority 7)
 *  3AR: null         → skip
 *
 *  Best qualifying = 3AG  →  allotted under 3AG, cutoff 5200
 *
 * Another example:
 *  Student rank 3000, category 2AG
 *  Eligible: GM(1), 2AG(13)
 *  Cutoffs: GM=5000, 2AG=8000
 *
 *  GM:  5000 ≥ 3000  → ✅ qualifies  (priority 1)
 *  2AG: 8000 ≥ 3000  → ✅ qualifies  (priority 13)
 *
 *  Best qualifying = GM  →  allotted under GM (merit seat preserved ✅)
 */
function checkOptionQualification(
  studentRank: number,
  eligibleCategories: string[],
  branchCutoffs: Record<string, number | null>,
  multiplier: number = 1.0,
): CategoryMatch | null {
  const qualifyingMatches: CategoryMatch[] = [];

  for (const cat of eligibleCategories) {
    const cutoffRank = branchCutoffs[cat];

    // null or missing → no seats in this category → skip
    if (cutoffRank === null || cutoffRank === undefined || cutoffRank <= 0) continue;

    // Apply custom multiplier dynamically (e.g. 0.9 to tighten, 1.05 to relax)
    const adjustedCutoff = Math.floor(cutoffRank * multiplier);

    // Student qualifies if their rank is ≤ the closing rank
    if (studentRank <= adjustedCutoff) {
      qualifyingMatches.push({
        category: cat,
        cutoffRank: adjustedCutoff,
        priorityScore: getCategoryPriority(cat),
      });
    }
  }

  if (qualifyingMatches.length === 0) return null;

  // Pick the most competitive (lowest priority score = closest to GM)
  qualifyingMatches.sort((a, b) => a.priorityScore - b.priorityScore);
  return qualifyingMatches[0];
}

// ─────────────────────────────────────────────────────────────────
// Step 6 — Main allotment runner
// ─────────────────────────────────────────────────────────────────

export interface RunAllotmentParams {
  options: AllotmentOption[];
  studentRank: number;
  category: string;
  isRural: boolean;
  isKannadaMedium: boolean;
  round: KcetRound;
  roundData?: Record<string, any>;
  multiplier?: number;
  topperExitSim?: boolean;
}

function isTopOption(collegeId: string, branchId: string): boolean {
  const topColleges = ['E003', 'E005', 'E006', 'E007', 'E151', 'E217'];
  const topBranches = ['CSE', 'CS', 'ISE', 'IS', 'ECE', 'EC', 'AIML', 'AI', 'AIDS', 'AD'];
  return topColleges.includes(collegeId) && topBranches.includes(branchId);
}

/**
 * Runs the complete KEA-style allotment.
 *
 * Goes through each option in priority order (1 → 2 → 3 …).
 * For each option:
 *   • Loads the college+branch cutoffs from the round-specific JSON.
 *   • Finds the best qualifying category using priority-score logic.
 *   • Returns the first option where the student qualifies.
 *
 * Returns null if no option clears the cutoff.
 */
export async function runKcetAllotment(
  params: RunAllotmentParams,
): Promise<AllotmentResult | null> {
  const { options, studentRank, category, isRural, isKannadaMedium, round, roundData: preloaded, multiplier = 1.0, topperExitSim = false } = params;

  if (!studentRank || studentRank <= 0 || isNaN(studentRank)) return null;

  const roundData = preloaded ?? (await loadRoundCutoffs(round));
  const eligibleCategories = getEligibleCategories(category, isRural, isKannadaMedium);

  // Sort options by student's priority (1 = top preference)
  const sorted = [...options].sort((a, b) => a.priority - b.priority);

  for (const opt of sorted) {
    const collegeData = roundData[opt.collegeId];
    if (!collegeData) continue;

    const cutoffsMap: Record<string, Record<string, number | null>> =
      collegeData.cutoffs ?? collegeData;

    const branchCutoffs = resolveBranchCutoffs(cutoffsMap, opt.branchId);
    if (!branchCutoffs) continue;

    let optionMultiplier = multiplier;
    if (topperExitSim && isTopOption(opt.collegeId, opt.branchId)) {
      optionMultiplier = optionMultiplier * 1.025;
    }

    const match = checkOptionQualification(studentRank, eligibleCategories, branchCutoffs, optionMultiplier);

    if (match) {
      return {
        collegeId:        opt.collegeId,
        collegeName:      opt.collegeName,
        branchId:         opt.branchId,
        branchName:       opt.branchName,
        allottedCategory: match.category,
        cutoffRank:       match.cutoffRank,
        choiceNo:         opt.priority,
        collegeFees:      opt.fees ?? 'N/A',
      };
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────
// UI Helpers
// ─────────────────────────────────────────────────────────────────

export function getRoundLabel(round: KcetRound, style: 'short' | 'long' = 'short'): string {
  const labels: Record<KcetRound, string> = {
    0: 'Mock', 1: 'Round 1', 2: 'Round 2', 3: 'Round 3', 4: 'Round 3',
  };
  
  const label = labels[round] || `Round ${round}`;
  if (style === 'long') {
    if (round === 0) return 'Mock Round';
    if (round === 1) return 'First Round';
    if (round === 2) return 'Second Round';
    if (round === 3) return 'Third Round';
    return label;
  }
  return label;
}

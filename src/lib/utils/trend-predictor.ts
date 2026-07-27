/**
 * 2026 KCET Trend Predictor Engine
 * ─────────────────────────────────────────────────────────────────
 * Generates projected cutoffs for 2026 Round 2 & Round 3 based on 
 * 2026 Round 1 actual data and historical relaxation ratios (2024-2025).
 */

export interface ProbabilityResult {
    status: 'HIGH' | 'MODERATE' | 'LOW';
    label: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    description: string;
}

/**
 * Branch Category Grouping
 * Top tech branches experience tighter movement in Round 2 & 3.
 * Core engineering & non-CS branches experience wider cutoff expansions.
 */
const HIGH_DEMAND_BRANCHES = new Set(['CSE', 'CS', 'ISE', 'IS', 'AIML', 'AI', 'AIDS', 'AD', 'ECE', 'EC', 'SE', 'CYBER', 'CY', 'DS']);
const MID_DEMAND_BRANCHES = new Set(['EEE', 'EE', 'EIE', 'EI', 'ETE', 'ET', 'VLSI', 'VL', 'RAI', 'RI', 'IOT', 'IT']);

/**
 * Returns the estimated rank shift multiplier for a given round and branch.
 * @param round 2 (Round 2) or 3 (Extended Round 3)
 * @param branchCode e.g., "CSE", "ECE", "CIVIL"
 */
export function getBranchShiftMultiplier(round: number, branchCode: string): number {
    const code = (branchCode || '').toUpperCase().trim();
    const isHighDemand = HIGH_DEMAND_BRANCHES.has(code);
    const isMidDemand = MID_DEMAND_BRANCHES.has(code);

    if (round === 2) {
        // Round 2 Cutoff Expansion Ratios
        if (isHighDemand) return 1.08;  // ~8% rank increase
        if (isMidDemand) return 1.14;   // ~14% rank increase
        return 1.20;                    // ~20% rank increase for core/civil/mech
    }
    
    if (round >= 3) {
        // Round 3 (Extended Round) Expansion Ratios
        if (isHighDemand) return 1.22;  // ~22% rank increase
        if (isMidDemand) return 1.32;   // ~32% rank increase
        return 1.45;                    // ~45% rank increase for core/civil/mech
    }

    return 1.0;
}

/**
 * Calculates projected cutoff range for R2 / R3 based on 2026 R1 cutoff.
 */
export function getProjectedCutoffRange(r1Cutoff: number | null | undefined, round: number, branchCode: string): { min: number; max: number; average: number } | null {
    if (!r1Cutoff || r1Cutoff <= 0) return null;

    if (round <= 1) {
        return { min: r1Cutoff, max: r1Cutoff, average: r1Cutoff };
    }

    const multiplier = getBranchShiftMultiplier(round, branchCode);
    const average = Math.round(r1Cutoff * multiplier);
    
    // Spread range ± 3% around the average projection
    const min = Math.round(average * 0.97);
    const max = Math.round(average * 1.03);

    return { min, max, average };
}

/**
 * Evaluates student's seat allotment probability based on rank vs projected cutoff.
 */
export function getSeatProbability(studentRank: number, projectedCutoff: number): ProbabilityResult {
    if (!studentRank || studentRank <= 0 || !projectedCutoff || projectedCutoff <= 0) {
        return {
            status: 'LOW',
            label: 'Unknown',
            badgeBg: 'bg-slate-100',
            badgeText: 'text-slate-600',
            badgeBorder: 'border-slate-300',
            description: 'Insufficient data'
        };
    }

    const diffRatio = (projectedCutoff - studentRank) / projectedCutoff;

    if (diffRatio >= 0.08 || studentRank <= projectedCutoff * 0.92) {
        // Student rank is comfortably within cutoff
        return {
            status: 'HIGH',
            label: 'Safe (High Chance)',
            badgeBg: 'bg-emerald-50',
            badgeText: 'text-emerald-700',
            badgeBorder: 'border-emerald-300',
            description: 'Very likely to get allotted in this round based on 2026 cutoff trends.'
        };
    }

    if (studentRank <= projectedCutoff * 1.05) {
        // Student rank is close (within 5%)
        return {
            status: 'MODERATE',
            label: 'Moderate Chance',
            badgeBg: 'bg-amber-50',
            badgeText: 'text-amber-800',
            badgeBorder: 'border-amber-300',
            description: 'Good chance of allotment, depends on applicant preference order.'
        };
    }

    return {
        status: 'LOW',
        label: 'Tough / Dream Seat',
        badgeBg: 'bg-rose-50',
        badgeText: 'text-rose-700',
        badgeBorder: 'border-rose-300',
        description: 'Cutoff is tight. Consider placing safer backup choices below.'
    };
}

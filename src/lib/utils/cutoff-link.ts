export type AllotmentRound = 0 | 1 | 2 | 3;

export interface LinkedCutoff {
    branch_id: string;
    category: string;
    mock: number | null;
    r1: number | null;
    r2: number | null;
    r3: number | null;
}


export const branchAliases: Record<string, string[]> = {
    CSE: ['CSE', 'CS', 'BCS', 'BTCS', 'BTCS & EAI&ML'],
    ISE: ['ISE', 'IS', 'BIS'],
    ECE: ['ECE', 'EC', 'BEC', 'BTE & CE'],
    AIML: ['AIML', 'AI', 'ML', 'BTCS & EAI&ML'],
    AIDS: ['AIDS', 'AD'],
    EEE: ['EEE', 'EE'],
    MECH: ['MECH', 'ME'],
    CIVIL: ['CIVIL', 'CE'],
    BT: ['BT'],
    CHEM: ['CHEM', 'CH'],
    CYBER: ['CYBER', 'CY'],
    DS: ['DS'],
    EIE: ['EIE', 'EI'],
    ETE: ['ETE', 'ET'],
    AERO: ['AERO', 'AN'],
    ASE: ['ASE', 'AE'],
    AUTO: ['AUTO', 'AU'],
    IEM: ['IEM', 'IM'],
    RAI: ['RAI', 'RI'],
    TT: ['TT'],
};

export function getRawBranchIds(code: string) {
    return branchAliases[code] || [code];
}

export function getRepresentativeBranchCode(rawCode: string, representativeCodes: string[]) {
    return representativeCodes.find(code => getRawBranchIds(code).includes(rawCode)) || rawCode;
}



export function getRoundRank(cutoff: LinkedCutoff, round: number) {
    if (round === 0) return cutoff.mock;
    if (round === 3) return cutoff.r3;
    if (round === 2) return cutoff.r2;
    return cutoff.r1;
}

export function getRoundLabel(round: number, style: 'short' | 'long' = 'short') {
    const labels: Record<number, string> = {
        0: 'Mock',
        1: 'First',
        2: 'Second',
        3: 'Third',
    };
    const label = labels[round] || `Round ${round}`;
    return style === 'long' && round !== 0 ? `${label} Round` : round === 0 && style === 'long' ? 'Mock Round' : label;
}

export function getEligibleCategories(category: string, isRural: boolean, isKannadaMedium: boolean) {
    const normalized = category || 'GM';
    let base = normalized;
    if (normalized === 'GMK' || normalized === 'GMR') base = 'GM';
    if (/^[123][AB]?[KR]$/.test(normalized)) base = `${normalized.slice(0, -1)}G`;
    if (normalized === 'SCK' || normalized === 'SCR') base = 'SCG';
    if (normalized === 'STK' || normalized === 'STR') base = 'STG';
    
    // Normalize raw inputs like '2A' to '2AG'
    if (['1', '2A', '2B', '3A', '3B', 'SC', 'ST'].includes(base)) {
        base = base + 'G';
    }

    const eligible = ['GM'];
    if (isRural) eligible.push('GMR');
    if (isKannadaMedium) eligible.push('GMK');
    
    if (base !== 'GM') {
        eligible.push(normalized);
        eligible.push(base);
        const prefix = base.slice(0, -1);
        if (isRural) eligible.push(prefix + 'R');
        if (isKannadaMedium) eligible.push(prefix + 'K');
    }
    
    return Array.from(new Set(eligible));
}

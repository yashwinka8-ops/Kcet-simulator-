export type AllotmentRound = 0 | 1 | 2 | 3 | 4;

export interface LinkedCutoff {
    branch_id: string;
    category: string;
    mock: number | null;
    r1: number | null;
    r2: number | null;
    r3: number | null;
}


export const branchAliases: Record<string, string[]> = {
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
    if (style === 'long') {
        if (round === 0) return 'Mock Round';
        return `${label} Round`;
    }
    return label;
}

export function getEligibleCategories(category: string, isRural: boolean, isKannadaMedium: boolean) {
    const normalized = category || 'GM';
    let base = normalized;
    if (normalized === 'GMK' || normalized === 'GMR') base = 'GM';
    if (/^[123][AB]?[KR]$/.test(normalized)) base = `${normalized.slice(0, -1)}G`;
    if (/^S[1234][KR]$/.test(normalized)) base = `${normalized.slice(0, -1)}G`;
    if (normalized === 'STK' || normalized === 'STR') base = 'STG';
    
    // Normalize raw inputs like '2A' to '2AG'
    if (['1', '2A', '2B', '3A', '3B', 'S1', 'S2', 'S3', 'S4', 'ST'].includes(base)) {
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

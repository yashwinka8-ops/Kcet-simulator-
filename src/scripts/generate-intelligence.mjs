import fs from 'fs';
import path from 'path';

const UNIFIED_DATA_PATH = './src/lib/data/colleges_unified.json';
const OUTPUT_PATH = './src/lib/data/intelligence.json';

const parseSalary = (str) => {
    if (!str) return 0;
    const matches = str.match(/[\d.]+/g);
    if (!matches) return 0;
    const nums = matches.map(Number);
    return nums.length > 1 ? (nums[0] + nums[1]) / 2 : nums[0];
};

const parseFees = (str) => {
    if (!str) return 100000;
    const s = str.toLowerCase();
    const isLakh = s.includes('lakh') || s.includes(' l');
    const matches = str.replace(/,/g, '').match(/[\d.]+/g);
    if (!matches) return 100000;
    const nums = matches.map(Number);
    let fee = nums.length > 1 ? nums[1] : nums[0];
    
    if (fee < 500) {
        if (isLakh || fee < 5) fee *= 100000; 
        else fee *= 1000; 
    }
    return fee;
};

function generateIntelligence() {
    const rawData = JSON.parse(fs.readFileSync(UNIFIED_DATA_PATH, 'utf-8'));
    const colleges = rawData.colleges;

    const gems = colleges.map(c => {
        const salaryLPA = parseSalary(c.avg_package);
        const salaryInRupees = salaryLPA * 100000;
        const annualFees = parseFees(c.fees);
        const roi = annualFees > 0 ? (salaryInRupees / annualFees) : 0;

        const computerBranches = ['CSE', 'CS', 'ISE', 'AIDS', 'AIML'];
        let bestCutoff = null;
        for (const branchId of computerBranches) {
            const cutoffs = c.kcet_cutoffs?.filter(k => k.branch_id === branchId && k.category === 'GM') || [];
            const r3 = cutoffs[0]?.r3 || cutoffs[0]?.r2 || cutoffs[0]?.r1;
            if (r3 && (!bestCutoff || r3 < bestCutoff)) bestCutoff = r3;
        }
        const cutoff = bestCutoff || 100000;

        // --- THE BALANCED "HIDDEN GEM" FILTERS ---
        // 1. Strong Salary (> 5.5 LPA)
        if (salaryLPA < 5.5) return null;

        // 2. Undervalued / Accessible (> 10,000 rank)
        if (cutoff < 10000) return null;

        // 3. Score: Salary (60%) + Accessibility (40%)
        const placementScore = (salaryLPA / 15) * 60; 
        const accessibilityBonus = Math.min(40, (cutoff / 80000) * 40); 
        const gemScore = placementScore + accessibilityBonus;

        return {
            college_id: c.college_id,
            name: c.short_name || c.name.split('(')[0].trim(),
            score: parseFloat(gemScore.toFixed(2)),
            metrics: {
                salary: salaryLPA,
                fees: annualFees,
                cutoff: cutoff,
                roi: parseFloat(roi.toFixed(1)) // Showing as "8.5x" etc
            }
        };
    }).filter(Boolean);

    const topGems = gems.sort((a, b) => b.score - a.score).slice(0, 30);

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify({
        updated_at: new Date().toISOString(),
        top_gems: topGems
    }, null, 2));

    console.log(`✅ Intelligence Restored: Found ${topGems.length} High-Value Gems with balanced logic.`);
}

generateIntelligence();

import fs from 'fs';
import path from 'path';

function buildUnifiedJson() {
    const dataDir = path.join('src', 'lib', 'data');
    
    // Read base colleges
    const rawCollegeData = JSON.parse(fs.readFileSync(path.join(dataDir, 'colleges_unified.json'), 'utf8'));
    
    // Read cutoffs
    const cutoffsMock = JSON.parse(fs.readFileSync(path.join(dataDir, 'cutoffs_mock.json'), 'utf8'));
    const cutoffsRound1 = JSON.parse(fs.readFileSync(path.join(dataDir, 'cutoffs_round1.json'), 'utf8'));
    const cutoffsRound2 = JSON.parse(fs.readFileSync(path.join(dataDir, 'cutoffs_round2.json'), 'utf8'));
    const cutoffsRound3 = JSON.parse(fs.readFileSync(path.join(dataDir, 'cutoffs_round3.json'), 'utf8'));
    
    const roundFiles = {
        0: cutoffsMock,
        1: cutoffsRound1,
        2: cutoffsRound2,
        3: cutoffsRound3,
    };
    
    const linkedColleges = rawCollegeData.colleges.map(college => {
        const linked = new Map();

        [0, 1, 2, 3].forEach(round => {
            const collegeCutoffs = roundFiles[round][college.college_id];
            if (!collegeCutoffs) return;

            Object.entries(collegeCutoffs).forEach(([branchId, ranksByCategory]) => {
                Object.entries(ranksByCategory).forEach(([category, rank]) => {
                    const key = `${branchId}:::${category}`;
                    const current = linked.get(key) || {
                        branch_id: branchId,
                        category,
                        mock: null,
                        r1: null,
                        r2: null,
                        r3: null,
                    };
                    const rankKey = round === 0 ? 'mock' : `r${round}`;
                    current[rankKey] = Math.round(rank);
                    linked.set(key, current);
                });
            });
        });

        return {
            ...college,
            kcet_cutoffs: Array.from(linked.values()),
        };
    });

    const outputData = {
        colleges: linkedColleges,
        branches: rawCollegeData.branches
    };

    fs.writeFileSync(path.join(dataDir, 'all_data.json'), JSON.stringify(outputData, null, 2));
    console.log('Successfully created all_data.json');
}

buildUnifiedJson();

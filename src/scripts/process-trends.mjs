import fs from 'fs';
import path from 'path';

const CUTOFF_DATA_PATH = './src/lib/cutoff-data.json';
const UNIFIED_DATA_PATH = './src/lib/data/colleges_unified.json';
const OUTPUT_PATH = './src/lib/data/colleges_unified.json'; // We will update the unified file carefully

async function processTrends() {
  console.log('🚀 Starting Multi-Year Trend Integration...');
  
  const cutoffData = JSON.parse(fs.readFileSync(CUTOFF_DATA_PATH, 'utf8'));
  const unifiedData = JSON.parse(fs.readFileSync(UNIFIED_DATA_PATH, 'utf8'));

  // Map to store trends: college_id -> branch_id -> category -> year -> [r1, r2, r3]
  const trendMap = {};

  console.log(`📦 Processing ${cutoffData.length} records...`);

  cutoffData.forEach(record => {
    const { college_id, branch_id, category, round, year, closing_rank } = record;
    
    if (!trendMap[college_id]) trendMap[college_id] = {};
    if (!trendMap[college_id][branch_id]) trendMap[college_id][branch_id] = {};
    if (!trendMap[college_id][branch_id][category]) trendMap[college_id][branch_id][category] = {};
    if (!trendMap[college_id][branch_id][category][year]) trendMap[college_id][branch_id][category][year] = [null, null, null];

    // Rounds are 1, 2, 3
    if (round >= 1 && round <= 3) {
      trendMap[college_id][branch_id][category][year][round - 1] = closing_rank;
    }
  });

  console.log('💎 Enriching Unified College Profiles...');

  console.log('💎 Enriching Unified College Profiles...');

  const enrichedColleges = unifiedData.colleges.map(college => {
    const trends = trendMap[college.college_id];
    if (!trends) return college;

    const historical_trends = [];

    Object.entries(trends).forEach(([branchId, categories]) => {
      Object.entries(categories).forEach(([category, years]) => {
        historical_trends.push({
          branch_id: branchId,
          category: category,
          trends: years
        });
      });
    });

    return {
      ...college,
      historical_trends
    };
  });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ ...unifiedData, colleges: enrichedColleges }, null, 2));
  console.log('✅ Multi-Year Intelligence Integrated Successfully!');
}

processTrends();

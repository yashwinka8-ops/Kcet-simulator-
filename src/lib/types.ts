export type Category = "1G" | "1K" | "1R" | "2AG" | "2AK" | "2AR" | "2BG" | "2BK" | "2BR" | "3AG" | "3AK" | "3AR" | "3BG" | "3BK" | "3BR" | "GM" | "GMK" | "GMR" | "SCG" | "SCK" | "SCR" | "STG" | "STK" | "STR";
export type Gender = "Male" | "Female";
export type Round = 1 | 2 | 3;
export type PredictionLevel = "safe" | "moderate" | "dream";

export interface College {
  college_id: string;
  short_name: string;
  full_name: string;
  city: string;
  region: string;
  college_type: string;
  naac_grade: string;
  image_url?: string;
  aliases?: string[];
  tier?: string;
  rating?: number;
  fees: number | string;
  avg_package: number | string;
  highest_package: number | string;
  placement_strength?: string;
  address?: string;
  phone?: string;
  website?: string;
  kcet_cutoffs?: any[];
}

export interface Branch {
  branch_id: string;
  branch_code: string;
  branch_name: string;
}

export interface CollegeBranch {
  id: string;
  college_id: string;
  branch_id: string;
  avg_package?: number;
  highest_package?: number;
}

export interface CutoffData {
  id: string;
  college_branch_id: string;
  category: Category;
  gender: Gender;
  round: Round;
  year: number;
  hk_quota: boolean;
  closing_rank: number;
}

export interface PredictionResult {
  college: College;
  branch: Branch;
  closing_rank: number;
  level: PredictionLevel;
  probability: number;
  isFallback?: boolean;
}

export interface PredictorInput {
  rank: number;
  category: Category;
  gender: Gender;
  hk_quota: boolean;
  branches: string[]; // Branch IDs
  colleges: string[]; // College IDs
  regions: string[];  // Region names
  round: Round;
}
export interface GroupedResult {
  college: College;
  branches: PredictionResult[];
}

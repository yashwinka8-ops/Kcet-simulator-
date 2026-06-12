import json
import os
import re

def normalize_name(name):
    name = re.sub(r'[^A-Z0-9]', '', name.upper())
    # common replacements
    name = name.replace('ENGINEERING', 'ENGG')
    name = name.replace('AND', '')
    return name

def jaccard_similarity(s1, s2):
    set1 = set(s1)
    set2 = set(s2)
    if not set1 or not set2:
        return 0
    return len(set1.intersection(set2)) / len(set1.union(set2))

def main():
    base_dir = r"y:\KCET COLLEGE PREDICTOR\kcet-simulator"
    raw_dir = os.path.join(base_dir, "src", "lib", "data", "raw_cutoffs")
    all_data_path = os.path.join(base_dir, "src", "lib", "data", "all_data.json")
    
    with open(all_data_path, 'r', encoding='utf-8') as f:
        all_data = json.load(f)
        
    rounds = [
        ("mock", "kcet-cutoff-mock round.json"),
        ("r1", "first round.json"),
        ("r2", "kcet-round-2-provisional-cutoff.json"),
        ("r3", "round 3.json")
    ]
    
    # Build branch name to id mapping
    branch_map = {}
    for b in all_data.get('branches', []):
        b_id = b.get('branch_code') or b.get('branch_id')
        name = b.get('branch_name') or b.get('name')
        if b_id and name:
            branch_map[normalize_name(name)] = b_id
            
    # Calculate mapping from PDF name to branch_id per college
    # We do this globally first
    college_course_to_branch = {}
    
    # Load all round data first to find all unique pdf courses per college
    round_data = {}
    for r_key, filename in rounds:
        filepath = os.path.join(raw_dir, filename)
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                round_data[filename] = json.load(f)
        else:
            round_data[filename] = {}

    for college in all_data['colleges']:
        cid = college['college_id']
        if 'kcet_cutoffs' not in college:
            continue
            
        college_branch_ids = set(c['branch_id'] for c in college['kcet_cutoffs'])
        
        pdf_courses = set()
        for filename in round_data.keys():
            if cid in round_data[filename]:
                pdf_courses.update(round_data[filename][cid]['courses'].keys())
                
        mapping = {}
        for pdf_c in list(pdf_courses):
            norm_pdf = normalize_name(pdf_c)
            best_match = None
            best_score = -1
            
            for norm_b, b_id in branch_map.items():
                if b_id in college_branch_ids:
                    score = jaccard_similarity(norm_pdf, norm_b)
                    if norm_pdf == norm_b or norm_pdf in norm_b or norm_b in norm_pdf:
                        score += 1.0 
                    if score > best_score:
                        best_score = score
                        best_match = b_id
                        
            if best_match and best_score > 0.3:
                mapping[pdf_c] = best_match
        
        college_course_to_branch[cid] = mapping

    # Rewrite each round file
    for filename, data in round_data.items():
        if not data:
            continue
            
        optimized_data = {}
        for cid, col_data in data.items():
            if cid not in college_course_to_branch:
                continue
            
            mapping = college_course_to_branch[cid]
            optimized_data[cid] = {}
            for pdf_c, cutoffs in col_data['courses'].items():
                b_id = mapping.get(pdf_c)
                if b_id:
                    # Clean the cutoffs: convert floats/ints, filter '--'
                    clean_cutoffs = {}
                    for cat, val in cutoffs.items():
                        if val != '--':
                            clean_cutoffs[cat] = float(val) if '.' in str(val) else int(val)
                    if clean_cutoffs:
                        optimized_data[cid][b_id] = clean_cutoffs
                        
        out_path = os.path.join(raw_dir, filename.replace('.json', '_optimized.json'))
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(optimized_data, f, separators=(',', ':'))
        print(f"Saved optimized JSON to {out_path}")

if __name__ == '__main__':
    main()

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
    all_data_path = os.path.join(base_dir, "src", "lib", "data", "all_data.json")
    
    with open(all_data_path, 'r', encoding='utf-8') as f:
        all_data = json.load(f)
        
    rounds = [
        ("mock", "kcet-cutoff-mock round.json"),
        ("r1", "first round.json"),
        ("r2", "kcet-round-2-provisional-cutoff.json"),
        ("r3", "round 3.json")
    ]
    
    round_data = {}
    for r_key, filename in rounds:
        with open(os.path.join(base_dir, filename), 'r', encoding='utf-8') as f:
            round_data[r_key] = json.load(f)
            
    # Build branch name to id mapping
    branch_map = {}
    for b in all_data.get('branches', []):
        b_id = b.get('branch_code') or b.get('branch_id')
        name = b.get('branch_name') or b.get('name')
        if b_id and name:
            branch_map[normalize_name(name)] = b_id
            
    # We will map PDF courses per college to branch_id
    total_updates = 0
    
    for college in all_data['colleges']:
        cid = college['college_id']
        # Find the set of branch_ids currently in this college
        if 'kcet_cutoffs' not in college:
            continue
            
        college_branch_ids = set(c['branch_id'] for c in college['kcet_cutoffs'])
        
        # We need a mapping from branch_id -> PDF course name for this college
        # Let's look at one round to find the course names (r1 is usually complete)
        pdf_courses = set()
        for r_key in ['r1', 'mock', 'r2', 'r3']:
            if cid in round_data[r_key]:
                pdf_courses.update(round_data[r_key][cid]['courses'].keys())
        
        # Map pdf_courses to college_branch_ids
        mapping = {}
        # Try direct or substring match first
        for pdf_c in list(pdf_courses):
            norm_pdf = normalize_name(pdf_c)
            # Find closest branch_id
            best_match = None
            best_score = -1
            
            # Use branch_map if available
            for norm_b, b_id in branch_map.items():
                if b_id in college_branch_ids:
                    # check similarity
                    score = jaccard_similarity(norm_pdf, norm_b)
                    if norm_pdf == norm_b or norm_pdf in norm_b or norm_b in norm_pdf:
                        score += 1.0 # boost exact/substring
                    if score > best_score:
                        best_score = score
                        best_match = b_id
                        
            if best_match and best_score > 0.3:
                mapping[best_match] = pdf_c
        
        # Update cutoffs
        new_cutoffs = []
        for cut in college['kcet_cutoffs']:
            b_id = cut['branch_id']
            cat = cut['category']
            
            pdf_course = mapping.get(b_id)
            if pdf_course:
                # Update mock, r1, r2, r3
                for r_key in ['mock', 'r1', 'r2', 'r3']:
                    try:
                        val = round_data[r_key][cid]['courses'][pdf_course].get(cat)
                        if val and val != '--':
                            cut[r_key] = float(val) if '.' in str(val) else int(val)
                        else:
                            cut[r_key] = None
                    except KeyError:
                        pass
                total_updates += 1
                
    with open(all_data_path, 'w', encoding='utf-8') as f:
        json.dump(all_data, f, indent=2)
        
    print(f"Merge complete! Updated {total_updates} cutoff entries.")

if __name__ == '__main__':
    main()

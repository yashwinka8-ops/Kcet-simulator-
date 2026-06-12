import json
import re
import sys
import os

files = [
    "first round.txt",
    "kcet-cutoff-mock round.txt",
    "kcet-round-2-provisional-cutoff.txt",
    "round 3.txt"
]

def is_cutoff(val):
    return re.match(r'^(--|[0-9]+(\.[0-9]*)?)$', val) is not None

def parse_file(filename):
    if not os.path.exists(filename):
        print(f"File {filename} not found.")
        return
    
    with open(filename, 'r', encoding='utf-8') as f:
        raw_lines = [line.strip() for line in f if line.strip()]
        
    lines = []
    i = 0
    # Clean up page headers/footers
    while i < len(raw_lines):
        line = raw_lines[i]
        if line.startswith("Non-Interactive") or \
           line.startswith("UGCET-") or \
           line.startswith("Seat Type:") or \
           line.startswith("KARNATAKA EXAMINATIONS AUTHORITY"):
            i += 1
            continue
        if line.startswith("Generated on:"):
            i += 3
            continue
        lines.append(line)
        i += 1

    data = {}
    current_college = None
    current_categories = []
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        if line.startswith("College:"):
            match = re.match(r"College:\s*\(?(E\d+)\)?\s*(.*)", line)
            if match:
                college_code = match.group(1)
                college_name = match.group(2).strip()
                if college_name.endswith("Course Name"):
                    college_name = college_name[:-11].strip()
                
                if college_code not in data:
                    data[college_code] = {"college_name": college_name, "courses": {}}
                current_college = college_code
            else:
                print("Failed to parse college:", line)
            
            i += 1
            # Next are the categories
            current_categories = []
            while i < len(lines):
                cat = lines[i]
                if re.match(r"^[123][AB]?[GKR]$", cat) or cat in ["GM", "GMK", "GMP", "GMR", "NRI", "OPN", "OTH", "SCG", "SCK", "SCR", "STG", "STK", "STR", "SNQ"]:
                    current_categories.append(cat)
                    i += 1
                else:
                    break
            continue
            
        if current_college and current_categories:
            # The current line should be a course name
            course_name = line
            i += 1
            
            vals = []
            while i < len(lines):
                if is_cutoff(lines[i]):
                    vals.append(lines[i])
                    i += 1
                else:
                    break
                    
            expected = len(current_categories)
            if len(vals) > expected:
                # Need to merge some split numbers
                # Let's greedily merge pairs where the first has a decimal point or the merge makes sense
                while len(vals) > expected:
                    merged = False
                    for k in range(len(vals) - 1):
                        if '.' in vals[k] and vals[k+1].isdigit():
                            vals[k] = vals[k] + vals[k+1]
                            del vals[k+1]
                            merged = True
                            break
                    if not merged:
                        # If no decimal point found to guide us, just warn and truncate
                        print(f"Warning: Could not smartly merge for {course_name} at {current_college}. Truncating.")
                        vals = vals[:expected]
                        
            if len(vals) < expected:
                print(f"Warning: Did not collect all values for {course_name} at {current_college}. Expected {expected}, got {len(vals)}.")
                
            cutoffs = {}
            for k in range(min(len(vals), expected)):
                cutoffs[current_categories[k]] = vals[k]
                
            data[current_college]["courses"][course_name] = cutoffs
            continue
            
        i += 1

    out_name = filename.replace('.txt', '.json')
    with open(out_name, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print(f"Saved {out_name}")

for f in files:
    parse_file(f)

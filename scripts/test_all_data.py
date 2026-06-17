import json

with open('src/lib/data/all_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

colleges = data['colleges']
print(f"Total colleges in all_data.json: {len(colleges)}")

# Find BMSCE and check AIML cutoffs
for col in colleges:
    if col.get('college_id') == 'E048':
        print(f"E048: {col.get('name', '')[:50]}")
        cutoffs = col.get('kcet_cutoffs', [])
        for c in cutoffs:
            if c.get('branch_id') == 'AM' and c.get('category') == 'SCK':
                print(f"  AM SCK: mock={c.get('mock')}, r1={c.get('r1')}, r2={c.get('r2')}, r3={c.get('r3')}")
            if c.get('branch_id') == 'AM' and c.get('category') == 'SCG':
                print(f"  AM SCG: mock={c.get('mock')}, r1={c.get('r1')}, r2={c.get('r2')}, r3={c.get('r3')}")
            if c.get('branch_id') == 'AM' and c.get('category') == 'GM':
                print(f"  AM GM:  mock={c.get('mock')}, r1={c.get('r1')}, r2={c.get('r2')}, r3={c.get('r3')}")
        break

for col in colleges:
    if col.get('college_id') == 'E009':
        print(f"E009: PES University")
        cutoffs = col.get('kcet_cutoffs', [])
        for c in cutoffs:
            if c.get('branch_id') == 'CS' and c.get('category') == 'GM':
                print(f"  CS GM:  mock={c.get('mock')}, r1={c.get('r1')}, r2={c.get('r2')}, r3={c.get('r3')}")
            if c.get('branch_id') == 'CS' and c.get('category') == '3AR':
                print(f"  CS 3AR: mock={c.get('mock')}, r1={c.get('r1')}, r2={c.get('r2')}, r3={c.get('r3')}")
        break

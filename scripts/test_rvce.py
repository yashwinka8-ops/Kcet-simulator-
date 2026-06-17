import json

with open('src/lib/data/all_data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for col in data['colleges']:
    if col['college_id'] == 'E005':
        for c in col['kcet_cutoffs']:
            if c['branch_id'] in ['EC', 'ET', 'EI', 'EE']:
                if c['category'] in ['GM', '3AG', '3AR']:
                    print(f"{c['branch_id']} {c['category']}: mock={c.get('mock')}, r1={c.get('r1')}, r2={c.get('r2')}, r3={c.get('r3')}")

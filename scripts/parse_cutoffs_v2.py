"""
KCET Cutoff Parser v3 - Complete Exhaustive Extraction
Reads .txt exports of each PDF round, extracts every college,
every branch, every category with no missed data.

Output format per JSON:
{
  "E001": {
    "college_name": "...",
    "cutoffs": {
      "CS": { "GM": 3473, "GMK": 4239, "1G": 6560, ... },
      "CE": { "GM": 45486, ... },
      ...
    }
  }
}
"""

import json
import re
import os

BASE_DIR = r"y:\KCET COLLEGE PREDICTOR\kcet-simulator"
OUT_DIR = os.path.join(BASE_DIR, "src", "lib", "data", "raw_cutoffs")

ROUNDS = [
    ("kcet-cutoff-mock-round.json", os.path.join(BASE_DIR, "kcet-cutoff-mock round.txt")),
    ("first-round.json",            os.path.join(BASE_DIR, "first round.txt")),
    ("kcet-round-2.json",           os.path.join(BASE_DIR, "kcet-round-2-provisional-cutoff.txt")),
    ("round-3.json",                os.path.join(BASE_DIR, "round 3.txt")),
]

CAT_PATTERN = re.compile(
    r"^(GM[KRP]?|GMP|[123][AB]?[GKR]|SC[GKR]|ST[GKR]|SNQ|NRI|OPN|OTH)$"
)

def is_value(v):
    return bool(re.match(r"^(--|[0-9]+(\.[0-9]*)?)$", v))

def to_num(v):
    if v == "--":
        return None
    try:
        f = float(v)
        return int(f) if f == int(f) else f
    except ValueError:
        return None

def normalize(s):
    """Collapse all whitespace and uppercase."""
    return " ".join(s.split()).upper()

# ----------------------------------------------------------------
# COMPLETE branch name -> branch_id mapping
# All raw PDF variants mapped to a short internal branch code.
# ----------------------------------------------------------------
RAW_MAP = {
    # ---- CS / CSE ----
    "COMPUTER SCIENCE AND ENGINEERING": "CS",
    "COMPUTERSCIENCE ANDENGINEERING": "CS",
    "COMPUTER SCIENCE & ENGINEERING": "CS",
    "COMPUTER SCIENCE AND ENGINEERING (HONOURS)": "CS",
    "B TECH INCOMPUTERSCIENCE ANDENGINEERING": "CS",
    "B TECH INCOMPUTER SCIENCE AND ENGINEERING": "CS",
    "COMPUTER SCIENCE AND ENGINEERING (EXCLUSIVELY FOR DIFFERENTLY ABLED)": "CS",
    "COMPUTERSCIENCE ANDTECHNOLOGY (EXCLUSIVELY FORDIFFERENTLYABLED)": "CS",
    "COMPUTERSCIENCE ANDTECHNOLOGY(EXCLUSIVELY FORDIFFERENTLYABLED)": "CS",
    "COMPUTERSCIENCE ANDTECHNOLOGY (EXCLUSIVELYFORDIFFERENTLYABLED)": "CS",
    "BTECH INCOMPUTERSCIENCE": "CS",
    "B TECH INCOMPUTERSCIENCE": "CS",
    "COMPUTERENGINEERING": "CS",
    "COMPUTER ANDCOMMUNICATION ENGINEERING": "CS",
    "COMPUTER ANDCOMMUNICATIONENGINEERING": "CS",
    "COMPUTERSCIENCE &TECHNOLOGY": "CS",
    "COMPUTERSCIENCE ANDTECHNOLOGY": "CS",

    # ---- AI & ML ----
    "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING": "AM",
    "ARTIFICIALINTELLIGENCE AND MACHINE LEARNING": "AM",
    "ARTIFICIALINTELLIGENCEAND MACHINE LEARNING": "AM",
    "ARTIFICIAL INTELLIGENCE & MACHINE LEARNING": "AM",
    "COMPUTER SCIENCE AND ENGINEERING (AI & ML)": "AM",
    "COMPUTERSCIENCE ANDENGG (ARTIFICIALINTELLIGENCE ANDMACHINELEARNING)": "AM",
    "COMPUTERSCIENCE ANDENGG(ARTIFICIAL INTELLIGENCEAND MACHINELEARNING)": "AM",
    "COMPUTERSCIENCE ANDENGG(ARTIFICIALINTELLIGENCE ANDMACHINELEARNING)": "AM",
    "ARTIFICIALINTELLIGENCE ANDMACHINELEARNING": "AM",
    "ARTIFICIALINTELLIGENCEAND MACHINELEARNING": "AM",
    "B TECH INARTIFICIALINTELLIGENCE ANDMACHINELEARNING": "AM",
    "B TECH INARTIFICIALINTELLIGENCEAND MACHINELEARNING": "AM",
    "B TECH INCOMPUTERSCIENCE &ENGINEERING(ARTIFICALINTELLIGENCE &MACHINELEARNING)": "AM",
    "B TECH INCOMPUTERSCIENCE \u0026ENGINEERING(ARTIFICALINTELLIGENCE \u0026MACHINELEARNING)": "AM",
    "B TECH INCOMPUTERSCIENCE \u0026 ENGG(ARTIFICIALINTELLIGENCE ANDFUTURETECHNOLOGIES)": "AM",
    "B TECH INCOMPUTERSCIENCE \u0026ENGG(ARTIFICIALINTELLIGENCEAND FUTURETECHNOLOGIES)": "AM",
    "B.TECH INCOMPUTERSCIENCE ANDARTIFICIALINTELLIGENCE": "AM",
    "ARTIFICIALINTELLIGENCE ENGG": "AM",
    "COMPUTERSCIENCE ANDENGG (ARTIFICIALINTELLIGENCE)": "AM",
    "COMPUTERSCIENCE ANDENGG(ARTIFICIALINTELLIGENCE)": "AM",
    "B TECH INCOMPUTERSCIENCE(AI \u0026ML)": "AM",
    "B TECH IN COMPUTERSCIENCE(AI \u0026ML)": "AM",
    "B TECH INCOMPUTERSCIENCE \u0026 ENGINEERING(ARTIFICALINTELLIGENCE \u0026MACHINELEARNING)": "AM",
    "B TECH INCOMPUTERSCIENCE(AI &ML)": "AM",
    "B TECH IN COMPUTERSCIENCE(AI &ML)": "AM",

    # ---- AIDS / AD ----
    "ARTIFICIAL INTELLIGENCE AND DATA SCIENCE": "AD",
    "ARTIFICIALINTELLIGENCE ANDDATA SCIENCE": "AD",
    "ARTIFICIALINTELLIGENCEAND DATASCIENCE": "AD",
    "ARTIFICIAL INTELLIGENCE & DATA SCIENCE": "AD",
    "COMPUTER SCIENCE AND ENGINEERING (AI & DS)": "AD",

    # ---- ISE / IS ----
    "INFORMATION SCIENCE AND ENGINEERING": "IS",
    "INFORMATIONSCIENCE ANDENGINEERING": "IS",
    "INFORMATION SCIENCE & ENGINEERING": "IS",
    "B TECH ININFORMATIONSCIENCEENGINEERING": "IS",
    "B TECH ININFORMATIONSCIENCE &TECHNOLOGY": "IS",
    "B TECH ININFORMATIONTECHNOLOGY": "IT",

    # ---- ECE / EC ----
    "ELECTRONICS AND COMMUNICATION ENGINEERING": "EC",
    "ELECTRONICS ANDCOMMUNICATION ENGINEERING": "EC",
    "ELECTRONICS ANDCOMMUNICATIONENGG": "EC",
    "ELECTRONICS AND COMMUNICATION ENGG": "EC",
    "ELECTRONICS & COMMUNICATION ENGINEERING": "EC",
    "ELECTRONICSANDCOMMUNICATION ENGG": "EC",
    "B TECH INELECTRONICS \u0026COMMUNICATION ENGINEERING": "EC",
    "B TECH INELECTRONICS \u0026COMMUNICATIONENGINEERING": "EC",
    "ELECTRONICSANDTELECOMMUNICATIONENGINEERING": "EC",
    "ELECTRONICS AND COMMUNICATION (ADVANCEDCOMMUNICATIONTECHNOLOGY)": "EC",
    "ELECTRONICSANDCOMMUNICATION (ADVANCEDCOMMUNICATIONTECHNOLOGY)": "EC",
    "ELECTRONICSANDCOMMUNICATION ENGG (VLSIDESIGN ANDTECHNOLOGY)": "EC",
    "ELECTRONICS \u0026COMMUNICATIONENGINEERING(INDUSTRIALINTEGTATED)": "EC",
    "B TECH INELECTRONICS \u0026COMPUTERENGINEERING": "EC",

    # ---- EEE / EE ----
    "ELECTRICAL AND ELECTRONICS ENGINEERING": "EE",
    "ELECTRICAL &ELECTRONICS ENGINEERING": "EE",
    "ELECTRICAL &ELECTRONICSENGINEERING": "EE",
    "ELECTRICAL AND ELECTRONICS ENGG": "EE",
    "ELECTRICAL \u0026COMPUTERENGINEERING": "EE",
    "B.TECH INELECTRICALENGINEERINGAND COMPUTERSCIENCE": "EE",
    "B.TECH INELECTRICALENGINEERING ANDCOMPUTERSCIENCE": "EE",

    # ---- MECH / ME ----
    "MECHANICAL ENGINEERING": "ME",
    "MECHANICALENGINEERING": "ME",
    "MECHANICALAND SMARTMANUFACTURING": "ME",
    "MECHANICAL ANDSMARTMANUFACTURING": "ME",
    "BTECH INMECHANICAL ANDSMARTMANUFACTURING": "ME",
    "BTECH INMECHANICALAND SMARTMANUFACTURING": "ME",
    "B.TECH INMECHANICAL ANDAEROSPACEENGINEERING": "ME",
    "B.TECH INMECHANICALANDAEROSPACEENGINEERING": "ME",
    "PRODUCTION ENGINEERING": "PE",
    "PRODUCTIONENGINEERING": "PE",
    "INDUSTRIAL \u0026PRODUCTIONENGINEERING": "PE",

    # ---- CIVIL / CE ----
    "CIVIL ENGINEERING": "CE",
    "CIVILENGINEERING": "CE",
    "CIVIL ENVIRONMENTAL ENGINEERING": "CE",
    "CIVILENVIRONMENTAL ENGINEERING": "CE",
    "CIVILENVIRONMENTALENGINEERING": "CE",
    "CONSTRUCTION TECHNOLOGY AND MGMT": "CE",
    "CONSTRUCTIONTECHNOLOGY ANDMGMT": "CE",
    "CONSTRUCTIONTECHNOLOGYAND MGMT": "CE",
    "B.TECH IN CIVILCONSTRUCTIONANDSUSTAINABILITYENGINEERING": "CE",
    "ENVIRONMENTAL ENGINEERING": "EN",
    "ENVIRONMENTALENGINEERING": "EN",

    # ---- BT / BioTech ----
    "BIOTECHNOLOGY": "BT",
    "BIO-TECHNOLOGY": "BT",
    "B TECH IN BIO-TECHNOLOGY": "BT",
    "B TECH IN BIO TECHNOLOGY": "BT",
    "BIO-MEDICALENGINEERING": "BM",
    "BIOMEDICAL ANDROBOTICENGINEERING": "BM",
    "BIOMEDICALAND ROBOTICENGINEERING": "BM",

    # ---- CHEM / CH ----
    "CHEMICAL ENGINEERING": "CH",
    "CHEMICALENGINEERING": "CH",
    "CERAMICS \u0026CEMENTENGINEERING": "CM",
    "POLYMER SCIENCE\u0026 TECHNOLOGY": "PL",
    "POLYMERSCIENCE \u0026TECHNOLOGY": "PL",

    # ---- Mining ----
    "MINING ENGINEERING": "MN",
    "MININGENGINEERING": "MN",

    # ---- Industrial / IM ----
    "INDUSTRIAL ENGINEERING AND MANAGEMENT": "IM",
    "INDUSTRIALENGINEERING AND MANAGEMENT": "IM",
    "INDUSTRIAL ENGINEERING & MANAGEMENT": "IM",
    "INDUSTRIALENGINEERING \u0026MANAGEMENT": "IM",

    # ---- EIE / EI ----
    "ELECTRONICS AND INSTRUMENTATION ENGINEERING": "EI",
    "ELECTRONICS ANDINSTRUMENTATION ENGINEERING": "EI",
    "ELECTRONICS & INSTRUMENTATION ENGINEERING": "EI",
    "ELECTRONICS \u0026INSTRUMENTATIONENGINEERING": "EI",
    "ELECTRONICSANDINSTRUMENTATIONENGINEERING": "EI",

    # ---- ETE / ET ----
    "ELECTRONICS AND TELECOMMUNICATION ENGINEERING": "ET",
    "ELECTRONICS ANDTELECOMMUNICATION ENGINEERING": "ET",
    "ELECTRONICS &TELECOMMUNICATION ENGINEERING": "ET",

    # ---- Cyber Security ----
    "COMPUTER SCIENCE AND ENGINEERING (CYBER SECURITY)": "CY",
    "CYBER SECURITY": "CY",
    "CYBERSECURITY": "CY",
    "B TECH INCOMPUTERSCIENCE (CYBERSECURITY)": "CY",
    "B TECH INCOMPUTERSCIENCE(CYBERSECURITY)": "CY",
    "B TECH IN COMPUTERSCIENCE (CYBERSECURITY)": "CY",

    # ---- Robotics / RI ----
    "ROBOTICS AND ARTIFICIAL INTELLIGENCE": "RI",
    "ROBOTICSAND ARTIFICIALINTELLIGENCE": "RI",
    "ROBOTICS ANDARTIFICIALINTELLIGENCE": "RI",
    "B TECH INROBOTICS ANDARTIFICIALINTELLIGENCE": "RI",
    "ROBOTICS AND AUTOMATION": "RA",
    "ROBOTICS ANDAUTOMATION": "RA",
    "AUTOMATIONAND ROBOTICS": "RA",
    "AUTOMATION ANDROBOTICS": "RA",
    "B TECH INROBOTICENGINEERING": "RI",
    "B TECH INROBOTICS ANDAUTOMATION": "RA",

    # ---- Aerospace / AE ----
    "AEROSPACE ENGINEERING": "AE",
    "AERO SPACEENGINEERING": "AE",
    "AERONAUTICALENGINEERING": "AN",
    "B TECH IN AEROSPACEENGINEERING": "AE",
    "B TECH INAERONAUTICALENGINEERING": "AN",

    # ---- Automobile / AU ----
    "AUTOMOBILE ENGINEERING": "AU",
    "AUTOMOBILEENGINEERING": "AU",
    "AUTOMOTIVE ENGINEERING": "AU",
    "AUTOMOTIVEENGINEERING": "AU",

    # ---- Data Science / DS ----
    "DATA SCIENCE": "DS",
    "COMPUTER SCIENCE AND ENGINEERING (DATA SCIENCE)": "DS",
    "B TECH INCOMPUTERSCIENCE (DATASCIENCE)": "DS",
    "B TECH INCOMPUTERSCIENCE(DATASCIENCE)": "DS",
    "B TECH IN COMPUTERSCIENCE (DATASCIENCE)": "DS",
    "BTECH ININFORMATIONTECHNOLOGYDATA ANALYTICS": "DS",
    "BTECH ININFORMATIONTECHNOLOGYDATAANALYTICS": "DS",
    "B.TECH INCOMPUTERSICENCE ANDENGG (DATAANALYTICS)": "DS",
    "COMPUTERSCIENCE ANDENGG(INTERNETOF THINGS)": "IOT",

    # ---- IoT ----
    "INTERNET OF THINGS": "IOT",
    "COMPUTER SCIENCE AND ENGINEERING (IOT)": "IOT",
    "B.TECH IN COMPUTERSCIENCE (INTERNET OFTHINGS)": "IOT",
    "B.TECH INCOMPUTER SCIENCE(INTERNET OFTHINGS)": "IOT",
    "INDUSTRIAL IOT": "IOT",
    "INDUSTRIALIOT": "IOT",

    # ---- Textile / TT ----
    "TEXTILE TECHNOLOGY": "TT",
    "TEXTILES TECHNOLOGY": "TT",
    "TEXTILESTECHNOLOGY": "TT",
    "SILKTECHNOLOGY": "TT",
    "SILK TECHNOLOGY": "TT",

    # ---- Architecture ----
    "ARCHITECTURE": "AR",
    "PLANNING": "PL2",

    # ---- Mechatronics ----
    "MECHATRONICS": "MC",

    # ---- Electronics Design Tech ----
    "ELECTRONICS DESIGN AND TECHNOLOGY": "ED",
    "ELECTRONICS DESIGN & TECHNOLOGY": "ED",
    "ELECTRONICSANDCOMMUNICATION ENGG (VLSIDESIGN ANDTECHNOLOGY)": "VL",
    "B.TECH IN VLSI": "VL",
    "B.TECH INEMBEDDEDSYSTEM AND VLSI": "VL",
    "B.TECH INEMBEDDEDSYSTEM ANDVLSI": "VL",

    # ---- Agri Engineering ----
    "AGRICULTURAL ENGINEERING": "AG",
    "AGRICULTUREENGINEERING": "AG",
    "B TECH INAGRICULTURALENGINEERING": "AG",

    # ---- CS Specializations ----
    "COMPUTER SCIENCE AND ENGINEERING (INTERNET OF THINGS AND CYBER SECURITY INCLUDING BLOCK CHAIN TECHNOLOGY)": "IOTCS",
    "COMPUTER SCIENCE AND ENGINEERING (NETWORKS)": "CN",
    "COMPUTERSCIENCE ANDDESIGN": "CD",
    "BTECH INCOMPUTERSCIENCE ANDDESIGN": "CD",
    "COMPUTERSCIENCE ANDBUSINESSSYSTEMS": "CBS",
    "BTECH INCOMPUTERSCIENCE ANDBUSINESSSYSTEMS": "CBS",
    "B TECH INCOMPUTERSCIENCE ANDINFORMATIONTECHNOLOGY": "IT",
    "B TECH INCOMPUTERSCIENCE ANDTECHNOLOGY": "CS",
    "B TECH INCOMPUTERSCIENCE ANDTECHNOLOGY(BIGDATA)": "DS",
    "B TECH INCOMPUTERSCIENCE ANDTECHNOLOGY(DEVOPS)": "CD2",
    "B.TECH INCOMPUTER SCIENCEANDENGINEERING(CLOUD COMPUTING)": "CC",
    "B TECH INCOMPUTERSCIENCE (CLOUDCOMPUTING)": "CC",
    "B TECH INCOMPUTERSCIENCE(CLOUDCOMPUTING)": "CC",
    "B.TECH INCOMPUTER SCIENCEANDENGINEERING(DEVOPS)": "CD2",
    "B.TECH INCOMPUTER SCIENCEANDENGINEERING(FULLSTACKDEVELOPMENT)": "FS",
    "B.TECH INCOMPUTERENGINEERING(SOFTWARE PRODUCTDEVELOPMENT)": "SPD",
    "B.TECH INCOMPUTERENGINEERING(SOFTWAREPRODUCTDEVELOPMENT)": "SPD",
    "B.TECH INCOMPUTERSCIENCE \u0026 ENGG(BUSINESS SYSTEMS)": "CBS",
    "B.TECH INCOMPUTERSCIENCE \u0026ENGG (BUSINESSSYSTEMS)": "CBS",
    "B.TECH INCOMPUTERSCIENCE ANDENGG (ROBOTICS)": "RA",
    "B.TECH INCOMPUTERSCIENCE ANDENGG(ROBOTICS)": "RA",
    "B TECH INCOMPUTERENGINEERING": "CS",
    "B TECH IN COMPUTERSCIENCE (INFORMATIONSECURITY)": "CY",
    "B TECH INCOMPUTER SCIENCE(INFORMATIONSECURITY)": "CY",
    "BTECH ININFORMATIONTECHNOLOGYAUGMENTEDREALITY ANDVIRUTALREALITY(AR/VR)": "AR2",

    # ---- Marine ----
    "MARINEENGINEERING": "MR",
    "MARINE ENGINEERING": "MR",

    # ---- Energy ----
    "B TECH IN ENERGYENGINEERING": "ENE",
    "B TECH INENERGYENGINEERING": "ENE",

    # ---- Petroleum ----
    "B TECH INPETROLEUMENGINEERING": "PE2",

    # ---- Maths & Computing ----
    "B TECH INMATHAMATICSAND COMPUTING": "MC2",
    "B TECH INMATHAMATICSANDCOMPUTING": "MC2",

    # ---- Pharmaceutical ----
    "BTECH INPHARMACEUTICALENGINEERING": "PH",

    # ---- Design ----
    "COMMUNICATIONDESIGN": "DES",
    "COMMUNICATION DESIGN": "DES",
    "FASHIONDESIGN": "DES",
    "FASHION DESIGN": "DES",
    "INDUSTRIALDESIGN": "DES",
    "INDUSTRIAL DESIGN": "DES",
    "LIFESTYLE ANDACCESSORYDESIGN": "DES",
    "LIFE STYLE ANDACCESSORYDESIGN": "DES",
    "BACHELOR OFDESIGN(INTERIORDESIGN )": "DES",
    "ENGINEERINGDESIGN": "DES",

    # ---- Electronics specializations ----
    "ELECTRONICS \u0026COMPUTERSCIENCE": "EC",
    "ELECTRONICS \u0026COMPUTERENGINEERING": "EC",
    "B.TECH IN COMPUTERSCIENCE AND MEDICALENGINEERING": "BM",
    "B.TECH INCOMPUTER SCIENCEAND MEDICALENGINEERING": "BM",

    # ---- Electronics & Instrumentation (remaining variants) ----
    "ELECTRONICS ANDINSTRUMENTATIONENGINEERING": "EI",
    "ELECTRONICSANDINSTRUMENTATION ENGINEERING": "EI",

    # ---- Medical Electronics ----
    "MEDICALELECTRONICSENGINEERING": "ML",
    "MEDICAL ELECTRONICSENGINEERING": "ML",
    "MEDICAL ELECTRONICS ENGINEERING": "ML",
    "MEDICALELECTRONICS ENGINEERING": "ML",

    # ---- Electronics Engineering (VLSI) ----
    "ELECTRONICSENGINEERING(VLSIDESIGN \u0026TECHNOLOGY)": "VL",
    "ELECTRONICSENGINEERING(VLSI DESIGN \u0026TECHNOLOGY)": "VL",
    "BTECH INELECTRONICSENGINEERING(VLSIDESIGN \u0026TECHNOLOGY)": "VL",
    "BTECH INELECTRONICSENGINEERING(VLSI DESIGN \u0026TECHNOLOGY)": "VL",
    "B.TECH INELECTRONICSENGINEERING(VLSI ANDEMBEDDEDSYSTEM)": "VL",

    # ---- Electronics Engineering (generic) ----
    "B.TECH INELECTRONICSENGINEERING": "EC",

    # ---- ECE Advanced Communication ----
    "ELECTRONICS ANDCOMMUNICATION(ADVANCEDCOMMUNICATIONTECHNOLOGY)": "EC",

    # ---- Robotics Engineering ----
    "B TECH INROBOTICSENGINEERING": "RI",
    "B TECH INROBOTICENGINEERING": "RI",

    # ---- B.Plan / Planning ----
    "B.PLAN": "PL2",
    "B.Plan": "PL2",

    # ---- EV Technology ----
    "B.TECH IN ELECTRICALAND  ELECTRONICSENGINEERING(ELECTRICAL VEHICLETECHNOLOGY)": "EE",
    "B.TECH IN ELECTRICAL AND ELECTRONICSENGINEERING(ELECTRICAL VEHICLETECHNOLOGY)": "EE",
    "B.TECH INELECTRICAL AND ELECTRONICSENGINEERING(ELECTRICAL VEHICLETECHNOLOGY)": "EE",
    "B.Tech inElectrical andElectronicsEngineering(Electrical VehicleTechnology)": "EE",
    "B.Tech in Electricaland  ElectronicsEngineering(Electrical VehicleTechnology)": "EE",
}


def map_branch(raw_name):
    norm = normalize(raw_name)
    # Direct lookup
    if norm in RAW_MAP:
        return RAW_MAP[norm]
    # Try matching without extra whitespace variations
    for key, bid in RAW_MAP.items():
        if normalize(key) == norm:
            return bid
    # Partial / substring match (longest key wins)
    best = None
    best_len = 0
    for key, bid in RAW_MAP.items():
        k = normalize(key)
        if k in norm or norm in k:
            if len(k) > best_len:
                best_len = len(k)
                best = bid
    return best


def parse_txt(filepath):
    if not os.path.exists(filepath):
        print(f"  [SKIP] File not found: {filepath}")
        return {}

    with open(filepath, "r", encoding="utf-8") as f:
        raw_lines = [line.strip() for line in f]

    raw_lines = [l for l in raw_lines if l]

    SKIP_PREFIXES = (
        "Non-Interactive",
        "UGCET-",
        "Seat Type:",
        "KARNATAKA EXAMINATIONS AUTHORITY",
        "Generated on:",
        "Page ",
    )
    lines = []
    for line in raw_lines:
        if not any(line.startswith(p) for p in SKIP_PREFIXES):
            lines.append(line)

    data = {}
    current_college_id = None
    current_categories = []

    i = 0
    while i < len(lines):
        line = lines[i]

        college_match = re.match(r"College:\s*\(?([A-Z]\d+)\)?\s*(.*)", line)
        if college_match:
            college_id = college_match.group(1)
            college_name = college_match.group(2).strip()
            # Strip trailing "Course Name"
            for suffix in ["Course Name", "CourseName"]:
                if college_name.endswith(suffix):
                    college_name = college_name[:-len(suffix)].strip()

            if college_id not in data:
                data[college_id] = {"college_name": college_name, "cutoffs": {}}
            current_college_id = college_id

            i += 1
            current_categories = []
            while i < len(lines) and CAT_PATTERN.match(lines[i]):
                current_categories.append(lines[i])
                i += 1
            continue

        if current_college_id and current_categories:
            course_raw = line
            i += 1

            vals = []
            while i < len(lines) and is_value(lines[i]):
                vals.append(lines[i])
                i += 1

            expected = len(current_categories)

            # Merge decimal fragments
            j = 0
            merged_vals = []
            while j < len(vals):
                v = vals[j]
                if (j + 1 < len(vals) and
                        v != "--" and
                        "." not in v and
                        re.match(r"^[0-9]+$", v) and
                        re.match(r"^[0-9]+$", vals[j+1]) and
                        len(vals) > expected):
                    merged_vals.append(v + vals[j+1])
                    j += 2
                else:
                    merged_vals.append(v)
                    j += 1
            vals = merged_vals

            while len(vals) > expected:
                merged = False
                for k in range(len(vals) - 1):
                    if "." in vals[k] and re.match(r"^[0-9]+$", vals[k+1]):
                        vals[k] = vals[k] + vals[k+1]
                        del vals[k+1]
                        merged = True
                        break
                if not merged:
                    vals = vals[:expected]
                    break

            if len(vals) < expected:
                vals += ["--"] * (expected - len(vals))

            branch_id = map_branch(course_raw)
            if branch_id is None:
                # Store unmapped with a safe key
                branch_id = "RAW:" + normalize(course_raw)[:60]
                print(f"    [STILL UNMAPPED] '{course_raw}' @ {current_college_id}")

            cat_dict = {}
            for cat, val_str in zip(current_categories, vals):
                cat_dict[cat] = to_num(val_str)

            existing = data[current_college_id]["cutoffs"].get(branch_id)
            if existing:
                for cat, v in cat_dict.items():
                    if v is not None:
                        existing[cat] = v
            else:
                data[current_college_id]["cutoffs"][branch_id] = cat_dict

            continue

        i += 1

    return data


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    # Delete all old JSON files
    for fname in os.listdir(OUT_DIR):
        if fname.endswith(".json"):
            os.remove(os.path.join(OUT_DIR, fname))
            print(f"Deleted: {fname}")

    for out_filename, txt_path in ROUNDS:
        print(f"\nParsing: {os.path.basename(txt_path)}")
        data = parse_txt(txt_path)
        colleges = len(data)
        total_branches = sum(len(v["cutoffs"]) for v in data.values())
        out_path = os.path.join(OUT_DIR, out_filename)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"  => {out_filename}: {colleges} colleges, {total_branches} branch entries")

    print("\nAll done!")


if __name__ == "__main__":
    main()

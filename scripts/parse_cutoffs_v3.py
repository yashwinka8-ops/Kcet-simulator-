"""
KCET Cutoff Parser v3 — Complete Rewrite
=========================================
Extracts college/branch/category cutoff data from KEA PDF text exports.

Key improvements over v2:
 - Pre-processes the entire file to remove page footers/headers FIRST
 - Pre-merges decimal fragments BEFORE parsing (e.g. "36311.87\n5" → "36311.875")
 - Uses strict value-count validation against known category count
 - Handles both 24-category (Mock/R1) and 28-category (R2/R3) files
 - Detailed error reporting for any remaining mismatches

Output format:
{
  "E001": {
    "college_name": "...",
    "cutoffs": {
      "CS": { "GM": 3473, "GMK": 4239, "1G": 6560, ... },
      ...
    }
  }
}
"""

import json
import re
import os
import sys

# ─────────────────────────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────────────────────────

BASE_DIR = r"y:\KCET COLLEGE PREDICTOR\kcet-simulator"
OUT_DIR = os.path.join(BASE_DIR, "src", "lib", "data", "raw_cutoffs")

ROUNDS = [
    ("kcet-cutoff-mock-round.json", os.path.join(BASE_DIR, "kcet-cutoff-mock round.txt")),
    ("first-round.json",            os.path.join(BASE_DIR, "first round.txt")),
    ("kcet-round-2.json",           os.path.join(BASE_DIR, "kcet-round-2-provisional-cutoff.txt")),
    ("round-3.json",                os.path.join(BASE_DIR, "round 3.txt")),
]

# All valid KEA category codes
VALID_CATEGORIES = {
    "GM", "GMK", "GMP", "GMR",
    "1G", "1K", "1R",
    "2AG", "2AK", "2AR",
    "2BG", "2BK", "2BR",
    "3AG", "3AK", "3AR",
    "3BG", "3BK", "3BR",
    "SCG", "SCK", "SCR",
    "STG", "STK", "STR",
    "NRI", "OPN", "OTH", "SNQ",
}

CAT_RE = re.compile(r"^(" + "|".join(sorted(VALID_CATEGORIES, key=len, reverse=True)) + r")$")

# ─────────────────────────────────────────────────────────────────
# Branch name → branch_id mapping (exhaustive)
# ─────────────────────────────────────────────────────────────────

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
    "B TECH INCOMPUTERSCIENCE ANDTECHNOLOGY": "CS",
    "B TECH INCOMPUTERENGINEERING": "CS",

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
    "B TECH INCOMPUTERSCIENCE \\u0026ENGINEERING(ARTIFICALINTELLIGENCE \\u0026MACHINELEARNING)": "AM",
    "B TECH INCOMPUTERSCIENCE \\u0026 ENGG(ARTIFICIALINTELLIGENCE ANDFUTURETECHNOLOGIES)": "AM",
    "B TECH INCOMPUTERSCIENCE \\u0026ENGG(ARTIFICIALINTELLIGENCEAND FUTURETECHNOLOGIES)": "AM",
    "B.TECH INCOMPUTERSCIENCE ANDARTIFICIALINTELLIGENCE": "AM",
    "ARTIFICIALINTELLIGENCE ENGG": "AM",
    "COMPUTERSCIENCE ANDENGG (ARTIFICIALINTELLIGENCE)": "AM",
    "COMPUTERSCIENCE ANDENGG(ARTIFICIALINTELLIGENCE)": "AM",
    "B TECH INCOMPUTERSCIENCE(AI &ML)": "AM",
    "B TECH IN COMPUTERSCIENCE(AI &ML)": "AM",
    "B TECH INCOMPUTERSCIENCE \\u0026 ENGINEERING(ARTIFICALINTELLIGENCE \\u0026MACHINELEARNING)": "AM",
    "B TECH INCOMPUTERSCIENCE(AI \\u0026ML)": "AM",
    "B TECH IN COMPUTERSCIENCE(AI \\u0026ML)": "AM",

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
    "B TECH INELECTRONICS &COMMUNICATION ENGINEERING": "EC",
    "B TECH INELECTRONICS &COMMUNICATIONENGINEERING": "EC",
    "B TECH INELECTRONICS \\u0026COMMUNICATION ENGINEERING": "EC",
    "B TECH INELECTRONICS \\u0026COMMUNICATIONENGINEERING": "EC",
    "ELECTRONICSANDTELECOMMUNICATIONENGINEERING": "ET",
    "ELECTRONICS AND COMMUNICATION (ADVANCEDCOMMUNICATIONTECHNOLOGY)": "EC",
    "ELECTRONICSANDCOMMUNICATION (ADVANCEDCOMMUNICATIONTECHNOLOGY)": "EC",
    "ELECTRONICSANDCOMMUNICATION ENGG (VLSIDESIGN ANDTECHNOLOGY)": "EC",
    "ELECTRONICS &COMMUNICATIONENGINEERING(INDUSTRIALINTEGTATED)": "EC",
    "ELECTRONICS \\u0026COMMUNICATIONENGINEERING(INDUSTRIALINTEGTATED)": "EC",
    "B TECH INELECTRONICS &COMPUTERENGINEERING": "EC",
    "B TECH INELECTRONICS \\u0026COMPUTERENGINEERING": "EC",
    "ELECTRONICS &COMPUTERSCIENCE": "EC",
    "ELECTRONICS \\u0026COMPUTERSCIENCE": "EC",
    "ELECTRONICS &COMPUTERENGINEERING": "EC",
    "ELECTRONICS \\u0026COMPUTERENGINEERING": "EC",
    "ELECTRONICS ANDCOMMUNICATION(ADVANCEDCOMMUNICATIONTECHNOLOGY)": "EC",
    "B.TECH INELECTRONICSENGINEERING": "EC",
    "ELECTRONICSANDINSTRUMENTATION ENGINEERING": "EI",
    "ELECTRONICS ANDINSTRUMENTATIONENGINEERING": "EI",

    # ---- EEE / EE ----
    "ELECTRICAL AND ELECTRONICS ENGINEERING": "EE",
    "ELECTRICAL &ELECTRONICS ENGINEERING": "EE",
    "ELECTRICAL &ELECTRONICSENGINEERING": "EE",
    "ELECTRICAL AND ELECTRONICS ENGG": "EE",
    "ELECTRICAL &COMPUTERENGINEERING": "EE",
    "ELECTRICAL \\u0026COMPUTERENGINEERING": "EE",
    "B.TECH INELECTRICALENGINEERINGAND COMPUTERSCIENCE": "EE",
    "B.TECH INELECTRICALENGINEERING ANDCOMPUTERSCIENCE": "EE",
    "B.TECH IN ELECTRICALAND  ELECTRONICSENGINEERING(ELECTRICAL VEHICLETECHNOLOGY)": "EE",
    "B.TECH IN ELECTRICAL AND ELECTRONICSENGINEERING(ELECTRICAL VEHICLETECHNOLOGY)": "EE",
    "B.TECH INELECTRICAL AND ELECTRONICSENGINEERING(ELECTRICAL VEHICLETECHNOLOGY)": "EE",
    "B.TECH INELECTRICAL ANDELECTRONICSENGINEERING(ELECTRICAL VEHICLETECHNOLOGY)": "EE",
    "B.TECH IN ELECTRICALAND ELECTRONICSENGINEERING(ELECTRICAL VEHICLETECHNOLOGY)": "EE",

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
    "INDUSTRIAL &PRODUCTIONENGINEERING": "PE",
    "INDUSTRIAL \\u0026PRODUCTIONENGINEERING": "PE",

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
    "B.TECH IN COMPUTERSCIENCE AND MEDICALENGINEERING": "BM",
    "B.TECH INCOMPUTER SCIENCEAND MEDICALENGINEERING": "BM",

    # ---- CHEM / CH ----
    "CHEMICAL ENGINEERING": "CH",
    "CHEMICALENGINEERING": "CH",
    "CERAMICS &CEMENTENGINEERING": "CM",
    "CERAMICS \\u0026CEMENTENGINEERING": "CM",
    "POLYMER SCIENCE& TECHNOLOGY": "PL",
    "POLYMER SCIENCE\\u0026 TECHNOLOGY": "PL",
    "POLYMERSCIENCE &TECHNOLOGY": "PL",
    "POLYMERSCIENCE \\u0026TECHNOLOGY": "PL",

    # ---- Mining ----
    "MINING ENGINEERING": "MN",
    "MININGENGINEERING": "MN",

    # ---- Industrial / IM ----
    "INDUSTRIAL ENGINEERING AND MANAGEMENT": "IM",
    "INDUSTRIALENGINEERING AND MANAGEMENT": "IM",
    "INDUSTRIAL ENGINEERING & MANAGEMENT": "IM",
    "INDUSTRIALENGINEERING &MANAGEMENT": "IM",
    "INDUSTRIALENGINEERING \\u0026MANAGEMENT": "IM",

    # ---- EIE / EI ----
    "ELECTRONICS AND INSTRUMENTATION ENGINEERING": "EI",
    "ELECTRONICS ANDINSTRUMENTATION ENGINEERING": "EI",
    "ELECTRONICS & INSTRUMENTATION ENGINEERING": "EI",
    "ELECTRONICS &INSTRUMENTATIONENGINEERING": "EI",
    "ELECTRONICS \\u0026INSTRUMENTATIONENGINEERING": "EI",
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
    "B TECH IN COMPUTERSCIENCE(CYBERSECURITY)": "CY",
    "B TECH IN COMPUTERSCIENCE (INFORMATIONSECURITY)": "CY",
    "B TECH INCOMPUTER SCIENCE(INFORMATIONSECURITY)": "CY",

    # ---- Robotics / RI ----
    "ROBOTICS AND ARTIFICIAL INTELLIGENCE": "RI",
    "ROBOTICSAND ARTIFICIALINTELLIGENCE": "RI",
    "ROBOTICS ANDARTIFICIALINTELLIGENCE": "RI",
    "B TECH INROBOTICS ANDARTIFICIALINTELLIGENCE": "RI",
    "B TECH INROBOTICSENGINEERING": "RI",
    "B TECH INROBOTICENGINEERING": "RI",
    "ROBOTICS AND AUTOMATION": "RA",
    "ROBOTICS ANDAUTOMATION": "RA",
    "AUTOMATIONAND ROBOTICS": "RA",
    "AUTOMATION ANDROBOTICS": "RA",
    "B TECH INROBOTICS ANDAUTOMATION": "RA",

    # ---- Aerospace / AE ----
    "AEROSPACE ENGINEERING": "AE",
    "AERO SPACEENGINEERING": "AE",
    "B TECH IN AEROSPACEENGINEERING": "AE",
    "AERONAUTICALENGINEERING": "AN",
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
    "B TECH INCOMPUTERSCIENCE ANDTECHNOLOGY(BIGDATA)": "DS",

    # ---- IoT ----
    "INTERNET OF THINGS": "IOT",
    "COMPUTER SCIENCE AND ENGINEERING (IOT)": "IOT",
    "COMPUTERSCIENCE ANDENGG(INTERNETOF THINGS)": "IOT",
    "B.TECH IN COMPUTERSCIENCE (INTERNET OFTHINGS)": "IOT",
    "B.TECH INCOMPUTER SCIENCE(INTERNET OFTHINGS)": "IOT",
    "INDUSTRIAL IOT": "IOT",
    "INDUSTRIALIOT": "IOT",

    # ---- IOTCS ----
    "COMPUTER SCIENCE AND ENGINEERING (INTERNET OF THINGS AND CYBER SECURITY INCLUDING BLOCK CHAIN TECHNOLOGY)": "IOTCS",
    "COMPUTERSCIENCE ANDENGG(INTERNETOF THINGS &CYBER SECURITYINCLUDING BLOCKCHAIN TECH)": "IOTCS",

    # ---- Textile / TT ----
    "TEXTILE TECHNOLOGY": "TT",
    "TEXTILES TECHNOLOGY": "TT",
    "TEXTILESTECHNOLOGY": "TT",
    "SILKTECHNOLOGY": "TT",
    "SILK TECHNOLOGY": "TT",

    # ---- Architecture ----
    "ARCHITECTURE": "AR",
    "PLANNING": "PL2",
    "B.PLAN": "PL2",

    # ---- Mechatronics ----
    "MECHATRONICS": "MC",

    # ---- Electronics Design Tech ----
    "ELECTRONICS DESIGN AND TECHNOLOGY": "ED",
    "ELECTRONICS DESIGN & TECHNOLOGY": "ED",
    "ELECTRONICSANDCOMMUNICATION ENGG (VLSIDESIGN ANDTECHNOLOGY)": "VL",
    "B.TECH IN VLSI": "VL",
    "B.TECH INEMBEDDEDSYSTEM AND VLSI": "VL",
    "B.TECH INEMBEDDEDSYSTEM ANDVLSI": "VL",
    "ELECTRONICSENGINEERING(VLSIDESIGN &TECHNOLOGY)": "VL",
    "ELECTRONICSENGINEERING(VLSIDESIGN \\u0026TECHNOLOGY)": "VL",
    "ELECTRONICSENGINEERING(VLSI DESIGN &TECHNOLOGY)": "VL",
    "ELECTRONICSENGINEERING(VLSI DESIGN \\u0026TECHNOLOGY)": "VL",
    "BTECH INELECTRONICSENGINEERING(VLSIDESIGN &TECHNOLOGY)": "VL",
    "BTECH INELECTRONICSENGINEERING(VLSIDESIGN \\u0026TECHNOLOGY)": "VL",
    "BTECH INELECTRONICSENGINEERING(VLSI DESIGN &TECHNOLOGY)": "VL",
    "BTECH INELECTRONICSENGINEERING(VLSI DESIGN \\u0026TECHNOLOGY)": "VL",
    "B.TECH INELECTRONICSENGINEERING(VLSI ANDEMBEDDEDSYSTEM)": "VL",

    # ---- Agri Engineering ----
    "AGRICULTURAL ENGINEERING": "AG",
    "AGRICULTUREENGINEERING": "AG",
    "B TECH INAGRICULTURALENGINEERING": "AG",

    # ---- CS Specializations ----
    "COMPUTER SCIENCE AND ENGINEERING (NETWORKS)": "CN",
    "COMPUTERSCIENCE ANDDESIGN": "CD",
    "BTECH INCOMPUTERSCIENCE ANDDESIGN": "CD",
    "COMPUTERSCIENCE ANDBUSINESSSYSTEMS": "CBS",
    "BTECH INCOMPUTERSCIENCE ANDBUSINESSSYSTEMS": "CBS",
    "B TECH INCOMPUTERSCIENCE ANDINFORMATIONTECHNOLOGY": "IT",
    "B TECH INCOMPUTERSCIENCE ANDTECHNOLOGY(DEVOPS)": "CD2",
    "B.TECH INCOMPUTER SCIENCEANDENGINEERING(CLOUD COMPUTING)": "CC",
    "B TECH INCOMPUTERSCIENCE (CLOUDCOMPUTING)": "CC",
    "B TECH INCOMPUTERSCIENCE(CLOUDCOMPUTING)": "CC",
    "B.TECH INCOMPUTER SCIENCEANDENGINEERING(DEVOPS)": "CD2",
    "B.TECH INCOMPUTER SCIENCEANDENGINEERING(FULLSTACKDEVELOPMENT)": "FS",
    "B.TECH INCOMPUTERENGINEERING(SOFTWARE PRODUCTDEVELOPMENT)": "SPD",
    "B.TECH INCOMPUTERENGINEERING(SOFTWAREPRODUCTDEVELOPMENT)": "SPD",
    "B.TECH INCOMPUTERSCIENCE & ENGG(BUSINESS SYSTEMS)": "CBS",
    "B.TECH INCOMPUTERSCIENCE &ENGG (BUSINESSSYSTEMS)": "CBS",
    "B.TECH INCOMPUTERSCIENCE \\u0026 ENGG(BUSINESS SYSTEMS)": "CBS",
    "B.TECH INCOMPUTERSCIENCE \\u0026ENGG (BUSINESSSYSTEMS)": "CBS",
    "B.TECH INCOMPUTERSCIENCE ANDENGG (ROBOTICS)": "RA",
    "B.TECH INCOMPUTERSCIENCE ANDENGG(ROBOTICS)": "RA",
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

    # ---- Medical Electronics ----
    "MEDICALELECTRONICSENGINEERING": "ML",
    "MEDICAL ELECTRONICSENGINEERING": "ML",
    "MEDICAL ELECTRONICS ENGINEERING": "ML",
    "MEDICALELECTRONICS ENGINEERING": "ML",
}

# Pre-normalize all keys
_NORM_MAP = {}
for k, v in RAW_MAP.items():
    # Use the same normalize function to strip punctuation and spaces
    nk = re.sub(r'[^A-Z0-9]', '', k.upper())
    _NORM_MAP[nk] = v


def normalize(s: str) -> str:
    """Remove all non-alphanumeric characters and uppercase."""
    import re
    return re.sub(r'[^A-Z0-9]', '', s.upper())


def map_branch(raw_name: str) -> str | None:
    norm = normalize(raw_name)
    if norm in _NORM_MAP:
        return _NORM_MAP[norm]
    # Longest substring match
    best, best_len = None, 0
    for key, bid in _NORM_MAP.items():
        if key in norm or norm in key:
            if len(key) > best_len:
                best_len = len(key)
                best = bid
    return best


def is_value_token(s: str) -> bool:
    """Check if a string is a cutoff value (number or --)."""
    return s == "--" or bool(re.match(r"^[0-9]+(\.[0-9]*)?$", s))


def to_num(s: str):
    """Convert a string cutoff value to a number or None."""
    if s == "--":
        return None
    try:
        f = float(s)
        return int(f) if f == int(f) else f
    except ValueError:
        return None


# ─────────────────────────────────────────────────────────────────
# Phase 1: Clean the raw text lines
# ─────────────────────────────────────────────────────────────────

def clean_lines(raw_text: str) -> list[str]:
    """
    Strips page footers/headers and blank lines.
    Returns a clean list of non-empty stripped lines.
    """
    lines = raw_text.split("\n")
    cleaned = []

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Skip blank lines
        if not line:
            i += 1
            continue

        # Skip "Generated on: ..." footer + "Page X of" + optional page number
        if line.startswith("Generated on:"):
            i += 1
            # Skip "Page X of"
            if i < len(lines) and lines[i].strip().startswith("Page "):
                i += 1
            # Skip standalone page number
            if i < len(lines) and re.match(r"^\d+$", lines[i].strip()):
                i += 1
            continue

        # Skip standalone "Page X of Y" that might appear without "Generated on:"
        if re.match(r"^Page \d+ of$", line):
            i += 1
            # Skip the page count number
            if i < len(lines) and re.match(r"^\d+$", lines[i].strip()):
                i += 1
            continue

        # Skip known header lines
        skip_prefixes = (
            "Non-Interactive",
            "UGCET-",
            "Seat Type:",
            "KARNATAKA EXAMINATIONS AUTHORITY",
        )
        if any(line.startswith(p) for p in skip_prefixes):
            i += 1
            continue

        # Skip standalone "Course Name"
        if line in ("Course Name", "CourseName"):
            i += 1
            continue

        cleaned.append(line)
        i += 1

    return cleaned


# ─────────────────────────────────────────────────────────────────
# Phase 2: Pre-merge decimal fragments
# ─────────────────────────────────────────────────────────────────

def merge_decimal_fragments(lines: list[str]) -> list[str]:
    """
    PDF text extraction sometimes splits a decimal number across lines.
    E.g. "36311.87" on one line and "5" on the next should be "36311.875".
    
    Rule: If line[i] is a decimal (contains '.') and line[i+1] is a short
    integer (1-3 digits), AND line[i+1] would complete the decimal portion,
    merge them.
    
    We do this BEFORE parsing so the parser always sees clean values.
    """
    merged = []
    i = 0
    while i < len(lines):
        line = lines[i]

        if (i + 1 < len(lines)
            and re.match(r"^[0-9]+\.[0-9]+$", line)  # current is a decimal
            and re.match(r"^[0-9]{1,3}$", lines[i + 1])  # next is 1-3 digit int
            and not CAT_RE.match(lines[i + 1])  # next is not a category code
        ):
            # Merge: append the fragment to the decimal
            merged_val = line + lines[i + 1]
            merged.append(merged_val)
            i += 2
        else:
            merged.append(line)
            i += 1

    return merged


# ─────────────────────────────────────────────────────────────────
# Phase 3: Parse the cleaned lines
# ─────────────────────────────────────────────────────────────────

def parse_cleaned(lines: list[str]) -> dict:
    """
    Parse the pre-processed lines into structured data.
    
    Format per college:
      College: E001 <name>
      <category1>
      <category2>
      ...
      <branch name>
      <value1>
      <value2>
      ...
      <branch name>
      ...
      College: E002 ...
    """
    data = {}
    current_college_id = None
    current_categories = []
    unmapped = []
    warnings = []

    i = 0
    while i < len(lines):
        line = lines[i]

        # ── College header ──────────────────────────────────
        college_match = re.match(r"College:\s*\(?([A-Z]\d+)\)?\s*(.*)", line)
        if college_match:
            college_id = college_match.group(1)
            college_name = college_match.group(2).strip()

            # Strip trailing "Course Name" from college name
            for suffix in ["Course Name", "CourseName"]:
                if college_name.endswith(suffix):
                    college_name = college_name[: -len(suffix)].strip()

            if college_id not in data:
                data[college_id] = {"college_name": college_name, "cutoffs": {}}
            current_college_id = college_id

            # Read category headers
            i += 1
            current_categories = []
            while i < len(lines) and CAT_RE.match(lines[i]):
                current_categories.append(lines[i])
                i += 1
            continue

        # ── Branch + values ─────────────────────────────────
        if current_college_id and current_categories:
            # This line should be a branch name
            if is_value_token(line):
                # Unexpected numeric — skip it
                warnings.append(f"  [WARN] Unexpected value '{line}' at college {current_college_id}, skipping")
                i += 1
                continue

            branch_raw = line
            i += 1

            # Collect all value tokens
            vals = []
            while i < len(lines) and is_value_token(lines[i]):
                vals.append(lines[i])
                i += 1

            expected = len(current_categories)

            # ── Value count reconciliation ──────────────────
            if len(vals) > expected:
                # Try merging adjacent values that look like split integers
                # E.g. two consecutive pure ints that together form a valid rank
                reconciled = _reconcile_extra_values(vals, expected)
                if reconciled is not None:
                    vals = reconciled
                else:
                    # If still too many, truncate with warning
                    warnings.append(
                        f"  [WARN] {current_college_id}/{branch_raw}: "
                        f"got {len(vals)} values, expected {expected}. Truncating."
                    )
                    vals = vals[:expected]

            if len(vals) < expected:
                # Pad with "--"
                vals += ["--"] * (expected - len(vals))

            # ── Map branch name ─────────────────────────────
            branch_id = map_branch(branch_raw)
            if branch_id is None:
                branch_id = "RAW:" + normalize(branch_raw)[:60]
                unmapped.append(f"  [UNMAPPED] '{branch_raw}' @ {current_college_id}")

            # ── Build category dict ─────────────────────────
            cat_dict = {}
            for cat, val_str in zip(current_categories, vals):
                cat_dict[cat] = to_num(val_str)

            # Merge into existing (in case of duplicates)
            existing = data[current_college_id]["cutoffs"].get(branch_id)
            if existing:
                for cat, v in cat_dict.items():
                    if v is not None:
                        existing[cat] = v
            else:
                data[current_college_id]["cutoffs"][branch_id] = cat_dict

            continue

        # Nothing matched, advance
        i += 1

    return data, unmapped, warnings


def _reconcile_extra_values(vals: list[str], expected: int) -> list[str] | None:
    """
    When we have more values than categories, try merging adjacent values
    that are split fragments of a single number.
    
    Strategies (applied greedily):
    1. A decimal ending + an integer fragment (leftover from phase 2 misses)
    2. Two consecutive small integers that together form a plausible rank
    """
    extra = len(vals) - expected
    if extra <= 0:
        return vals

    result = list(vals)

    # Strategy 1: Merge any remaining decimal fragments
    for _ in range(extra):
        merged = False
        for j in range(len(result) - 1):
            if ("." in result[j]
                and result[j] != "--"
                and re.match(r"^[0-9]+$", result[j + 1])
                and len(result[j + 1]) <= 4
            ):
                result[j] = result[j] + result[j + 1]
                del result[j + 1]
                merged = True
                break
        if not merged:
            break

    if len(result) == expected:
        return result

    # Strategy 2: Merge consecutive pure integers if still needed
    extra = len(result) - expected
    for _ in range(extra):
        merged = False
        for j in range(len(result) - 1):
            if (result[j] != "--"
                and result[j + 1] != "--"
                and "." not in result[j]
                and "." not in result[j + 1]
                and re.match(r"^[0-9]+$", result[j])
                and re.match(r"^[0-9]+$", result[j + 1])
            ):
                # Only merge if one of them is very short (fragment)
                if len(result[j + 1]) <= 2 or len(result[j]) <= 2:
                    result[j] = result[j] + result[j + 1]
                    del result[j + 1]
                    merged = True
                    break
        if not merged:
            break

    if len(result) == expected:
        return result

    return None  # Could not reconcile


# ─────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────

def parse_file(filepath: str) -> tuple[dict, list, list]:
    """Parse a single text file and return (data, unmapped, warnings)."""
    if not os.path.exists(filepath):
        print(f"  [SKIP] File not found: {filepath}")
        return {}, [], []

    with open(filepath, "r", encoding="utf-8") as f:
        raw_text = f.read()

    # Phase 1: Clean
    lines = clean_lines(raw_text)

    # Phase 2: Merge decimal fragments
    lines = merge_decimal_fragments(lines)

    # Phase 3: Parse
    return parse_cleaned(lines)


def validate_data(data: dict, label: str) -> int:
    """
    Post-parse validation: check for suspiciously small/large values.
    Returns number of issues found.
    """
    issues = 0
    for col_id, cdata in data.items():
        for br, cats in cdata.get("cutoffs", {}).items():
            for cat, val in cats.items():
                if val is None:
                    continue
                # Single-digit values are almost always fragments
                if isinstance(val, (int, float)) and 0 < val < 10:
                    print(f"  [SUSPICIOUS] {col_id} {br} {cat} = {val} (too small)")
                    issues += 1
    return issues


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    total_issues = 0

    for out_filename, txt_path in ROUNDS:
        label = os.path.basename(txt_path)
        print(f"\n{'='*60}")
        print(f"Parsing: {label}")
        print(f"{'='*60}")

        data, unmapped, warnings = parse_file(txt_path)

        colleges = len(data)
        total_branches = sum(len(v["cutoffs"]) for v in data.values())

        # Print warnings
        for w in warnings:
            print(w)
        for u in unmapped:
            print(u)

        # Validate
        issues = validate_data(data, label)
        total_issues += issues

        # Write output
        out_path = os.path.join(OUT_DIR, out_filename)
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"  => {out_filename}: {colleges} colleges, {total_branches} branches")
        if issues:
            print(f"  ⚠️  {issues} suspicious values detected!")
        else:
            print(f"  ✅ No suspicious values")

    print(f"\n{'='*60}")
    if total_issues:
        print(f"⚠️  Total suspicious values across all rounds: {total_issues}")
    else:
        print(f"✅ All rounds parsed cleanly!")
    print("Done!")


if __name__ == "__main__":
    main()

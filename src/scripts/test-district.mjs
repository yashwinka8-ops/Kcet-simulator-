const districts = [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru", "Bidar", "Chamarajanagar", 
    "Chikballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", 
    "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", 
    "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", 
    "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", 
    "Vijayapura", "Yadgir", "Vijayanagara"
];

const districtMapping = {
    "BANGALORE": "Bengaluru",
    "BENGALURU": "Bengaluru",
    "BELGAUM": "Belagavi",
    "BELLARY": "Ballari",
    "BIJAPUR": "Vijayapura",
    "CHIKMAGALUR": "Chikkamagaluru",
    "CHIKKABALLAPURA": "Chikballapur",
    "CHIKBALLAPUR": "Chikballapur",
    "COORG": "Kodagu",
    "GULBARGA": "Kalaburagi",
    "HAYERI": "Haveri",
    "HUBLI": "Dharwad",
    "MANGALORE": "Dakshina Kannada",
    "MYSORE": "Mysuru",
    "SHIMOGA": "Shivamogga",
    "SHIVAMOGGA": "Shivamogga",
    "TUMKUR": "Tumakuru",
    "TUMAKURU": "Tumakuru",
    "KARWAR": "Uttara Kannada",
    "DAVANGERE": "Davanagere",
    "MANDYA": "Mandya",
    "HASSAN": "Hassan",
    "KOLAR": "Kolar",
    "BIDAR": "Bidar"
};

function getDistrict(collegeName) {
    const upperName = collegeName.toUpperCase();
    for (const [key, value] of Object.entries(districtMapping)) {
        if (upperName.includes(key)) return value;
    }
    for (const d of districts) {
        if (upperName.includes(d.toUpperCase())) return d;
    }
    return "Other";
}

console.log("1:", getDistrict("University of Visvesvaraya, Bangalore"));
console.log("2:", getDistrict("S S Institute of Technology, Tumkur"));
console.log("3:", getDistrict("B.V.B College of Engg, Hubli"));
console.log("4:", getDistrict("Government Engineering College, Hassan"));

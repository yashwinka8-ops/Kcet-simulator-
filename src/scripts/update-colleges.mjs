import fs from 'fs';
import path from 'path';

const collegesPath = 'src/lib/data/colleges.json';
const colleges = JSON.parse(fs.readFileSync(collegesPath, 'utf8'));

const top10Data = {
    "E005": { // RVCE
        "avg_package": 16,
        "highest_package": 67,
        "placement_strength": "Excellent",
        "fees": 125000,
        "address": "Mysore Rd, RV Vidyaniketan Post, Bengaluru, Karnataka 560059",
        "phone": "+91 80 68188100",
        "website": "rvce.edu.in"
    },
    "E009": { // PESU
        "avg_package": 14.5,
        "highest_package": 65,
        "placement_strength": "Excellent",
        "fees": 130000,
        "address": "100 Feet Ring Road, Banashankari, Bengaluru, Karnataka 560085",
        "phone": "+91 8010297297",
        "website": "pes.edu"
    },
    "E006": { // MSRIT
        "avg_package": 12,
        "highest_package": 56,
        "placement_strength": "Very Strong",
        "fees": 110000,
        "address": "MSRIT Post, MSR Nagar, Mathikere, Bengaluru, Karnataka 560054",
        "phone": "+91 80 23600822",
        "website": "msrit.edu"
    },
    "E003": { // BMSCE
        "avg_package": 10.5,
        "highest_package": 51.5,
        "placement_strength": "Very Strong",
        "fees": 110000,
        "address": "Bull Temple Road, Basavanagudi, Bengaluru, Karnataka 560004",
        "website": "bmsce.ac.in"
    },
    "E001": { // UVCE
        "avg_package": 8.5,
        "highest_package": 35,
        "placement_strength": "Good ROI",
        "fees": 55000,
        "address": "KR Circle, Dr Ambedkar Veedhi, Bengaluru, Karnataka 560001",
        "phone": "+91 80 22961803",
        "website": "uvce.ac.in"
    },
    "E007": { // DSCE
        "avg_package": 9,
        "highest_package": 40,
        "placement_strength": "Good",
        "fees": 110000,
        "address": "Shavige Malleshwara Hills, Kumaraswamy Layout, Bengaluru, Karnataka 560111",
        "phone": "+91 80 42161751",
        "website": "dsce.edu.in"
    },
    "E008": { // BIT
        "avg_package": 8,
        "highest_package": 30,
        "placement_strength": "Good",
        "fees": 105000,
        "address": "KR Road, VV Puram, Bengaluru, Karnataka 560004",
        "phone": "+91 80 26613237",
        "website": "bit-bangalore.edu.in"
    },
    "E012": { // Sir MVIT
        "avg_package": 7.5,
        "highest_package": 25,
        "placement_strength": "Decent",
        "fees": 105000,
        "address": "International Airport Road, Yelahanka, Bengaluru, Karnataka 562157",
        "phone": "+91 80 28467248",
        "website": "sirmvit.edu"
    },
    "E022": { // NIE
        "avg_package": 9.5,
        "highest_package": 30,
        "placement_strength": "Good",
        "fees": 100000,
        "address": "Mananthavady Road, Mysuru, Karnataka 570008",
        "phone": "+91 821 2485802",
        "website": "nie.ac.in"
    },
    "E021": { // JSSSTU
        "avg_package": 10.5,
        "highest_package": 35,
        "placement_strength": "Strong",
        "fees": 100000,
        "address": "JSS Technical Institutions Campus, Mysuru, Karnataka 570006",
        "phone": "+91 821 2548285",
        "website": "jssstuniv.in"
    },
    "E103": { // BMSIT
        "avg_package": 8.7,
        "highest_package": 28,
        "placement_strength": "Decent",
        "fees": 105000,
        "address": "Doddaballapur Main Road, Avalahalli, Yelahanka, Bengaluru, Karnataka 560064",
        "website": "bmsit.ac.in"
    }
};

const updatedColleges = colleges.map(c => {
    if (top10Data[c.college_id]) {
        return { ...c, ...top10Data[c.college_id] };
    }
    return c;
});

fs.writeFileSync(collegesPath, JSON.stringify(updatedColleges, null, 2));
console.log('Updated top 10 colleges with realistic data!');

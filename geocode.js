const fs = require('fs');
const path = require('path');

const csvData = `E001,UVCE,"KR Circle, Ambedkar Veedhi, Bengaluru, 560001"
E003,BMSCE,"P.O. Box No.: 1908, Bull Temple Road, Basavanagudi, Bengaluru, 560019"
E005,RVCE,"RV Vidyanikethan Post, Mysore Road, Bengaluru, 560059"
E006,MSRIT,"MSR Nagar, MSRIT Post, Bangalore, 560054"
E009,PESU (RR),"100 Feet Ring Road, BSK III Stage, Bengaluru, 560085"
E285,RVU,"Mysore Road, RV Vidyanikethan Post, Bengaluru, 560059"
E007,DSCE,"Shavige Malleshwara Hills, Kumaraswamy Layout, Bengaluru, 560078"
E008,BIT,"K.R. Road, V.V. Puram, Bengaluru, 560004"
E078,Oxford,"10th Milestone, Bommanahalli, Hosur Road, Bengaluru, 560068"
E079,Acharya,"Acharya Dr. S. Radhakrishnan Road, Soladevanahalli, Bengaluru, 560107"
E082,JSSATE,"JSSATE Campus, Uttarahalli-Kengeri Road, Bengaluru, 560060"
E097,CMRIT,"132, AECS Layout, ITPL Main Road, Kundalahalli, Bengaluru, 560037"
E099,NHCE,"Bellandur Main Rd, Near Marathahalli, Bengaluru, 560103"
E107,BNMIT,"27th Cross Rd, Banashankari 2nd Stage, Bengaluru, 560070"
E115,SJBIT,"#67, BGS Health & Education City, Uttarahalli Main Road, Kengeri, Bengaluru, 560060"
E118,RNSIT,"Dr. Vishnuvardhan Road, Channasandra, RR Nagar, Bengaluru, 560098"
E126,BMSIT,"Doddaballapur Main Road, Avalahalli, Yelahanka, Bengaluru, 560064"
E141,PESU (EC),"Hosur Road, 1 km before Electronic City, Bengaluru, 560100"
E212,DSATM,"Kanakapura Rd, Opp. Art of Living, Udayapura, Bengaluru, 560082"
E232,REVA,"Rukmini Knowledge Park, Kattigenahalli, Yelahanka, Bengaluru, 560064"
E237,Presidency,"Itgalpur, Rajanakunte, Yelahanka, Bengaluru, 560064"
E004,Dr. AIT,"Near Outer Ring Road, Mallathahalli, Bengaluru, 560056"
E011,MVJCE,"Near ITPB, Whitefield, Bengaluru, 560067"
E012,Sir MVIT,"Krishnadevaraya Nagar, Hunasamaranahalli, International Airport Road, Bengaluru, 562157"
E083,HKBK,"22/1, Nagawara, Arabic College Post, Bengaluru, 560045"
E095,AMC,"18th K.M. Bannerghatta Main Road, Bengaluru, 560083"
E098,Atria,"ASKB Campus, 1st Main Rd, Ags Colony, Anandnagar, Bengaluru, 560024"
E102,DBIT,"Kumbalagodu, Mysore Road, Bengaluru, 560074"
E104,NCET,"Mudugurki, Venkatagiri Kote Post, Devanahalli, Bengaluru, 562110"
E111,SVCE,"Vidyanagar, International Airport Road, Bengaluru, 562157"
E173,Sai Vidya,"Rajanukunte, Via Yelahanka, Bengaluru, 560064"
E220,Alliance,"Chikkahagade Cross, Chandapura-Anekal Main Road, Bengaluru, 562106"
E255,GITAM,"NH-207, Nagadenehalli, Doddaballapur Taluk, Bengaluru, 561203"
E002,SKSJT,"K.R. Circle, Ambedkar Veedhi, Bengaluru, 560001"
E013,Ghousia,"Ramanagaram, Bengaluru-Mysore Highway, 562159"
E086,Sairam,"Sai Leo Nagar, Guddanahalli, Anekal, Bengaluru, 562106"
E109,City Eng,"Doddakallasandra, Kanakapura Road, Bengaluru, 560062"
E171,Brindavan,"Dwarakanagar, Bagalur Main Road, Yelahanka, Bengaluru, 560063"
E186,ACS,"#207, Kambipura, Mysore Road, Bengaluru, 560074"
E235,MSRUAS,"Gnanagangothri Campus, New BEL Road, MSR Nagar, Bengaluru, 560054"
E275,RVITM,"Chaithanya Layout, 8th Phase, J. P. Nagar, Bengaluru, 560076"
E287,Vidyashilp,"Govindapura, Gollahalli, Yelahanka, Bengaluru, 560064"
E266,BMSCA,"Bull Temple Road, Basavanagudi, Bengaluru, 560019"`;

const lines = csvData.trim().split('\n');
const results = {};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function geocode() {
    console.log('Starting geocoding for ' + lines.length + ' colleges...');
    
    // Existing accurate coords for top colleges
    const knownCoords = {
        "E005": { lat: 12.9237, lng: 77.4987 }, // RVCE
        "E009": { lat: 12.9333, lng: 77.5350 }, // PESU
        "E006": { lat: 13.0285, lng: 77.5653 }, // MSRIT
        "E003": { lat: 12.9416, lng: 77.5671 }, // BMSCE
        "E001": { lat: 12.9749, lng: 77.5855 }, // UVCE
        "E007": { lat: 12.9081, lng: 77.5661 }, // DSCE
        "E008": { lat: 12.9497, lng: 77.5753 }, // BIT
        "E012": { lat: 13.1492, lng: 77.6067 }, // Sir MVIT
        "E103": { lat: 13.1340, lng: 77.5676 }, // BMSIT
    };

    for (let line of lines) {
        if (!line.trim() || line.startsWith('College ID')) continue;
        
        const firstComma = line.indexOf(',');
        const secondComma = line.indexOf(',', firstComma + 1);
        
        const id = line.substring(0, firstComma).trim();
        const name = line.substring(firstComma + 1, secondComma).trim();
        let address = line.substring(secondComma + 1).trim();
        if (address.startsWith('"') && address.endsWith('"')) {
            address = address.substring(1, address.length - 1);
        }
        
        if (knownCoords[id]) {
            results[id] = knownCoords[id];
            continue;
        }

        // Clean address for better geocoding
        let searchAddress = address.replace(/P\.O\. Box No\.: \d+,|#\d+,/g, '').trim();
        
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&limit=1`;
        
        try {
            const res = await fetch(url, { headers: { 'User-Agent': 'KCET-Predictor-App' } });
            const data = await res.json();
            
            if (data && data.length > 0) {
                results[id] = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
                console.log(`✅ ${id} (${name}): ${results[id].lat}, ${results[id].lng}`);
            } else {
                // Fallback: search just the college name + Bengaluru
                await sleep(1000);
                const fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name + ' Bengaluru')}&limit=1`;
                const fallbackRes = await fetch(fallbackUrl, { headers: { 'User-Agent': 'KCET-Predictor-App' } });
                const fallbackData = await fallbackRes.json();
                
                if (fallbackData && fallbackData.length > 0) {
                    results[id] = { lat: parseFloat(fallbackData[0].lat), lng: parseFloat(fallbackData[0].lon) };
                    console.log(`✅ ${id} (${name}) [Fallback]: ${results[id].lat}, ${results[id].lng}`);
                } else {
                     console.log(`❌ ${id} (${name}): Not found`);
                     // Assign approximate bangalore center for failed ones
                     results[id] = { lat: 12.9716, lng: 77.5946 };
                }
            }
        } catch (e) {
            console.log(`❌ ${id} (${name}): Error ${e.message}`);
        }
        
        await sleep(1000); // 1s delay for nominatim
    }

    const fileContent = `export const collegeCoordinates: Record<string, { lat: number; lng: number }> = ${JSON.stringify(results, null, 2)};\n`;
    fs.writeFileSync(path.join(__dirname, 'src/lib/data/college_coordinates.ts'), fileContent);
    console.log('✅ Updated src/lib/data/college_coordinates.ts');
}

geocode();

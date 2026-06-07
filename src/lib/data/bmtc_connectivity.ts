export interface BMTCConnectivity {
  college_id: string;
  name: string;
  nearest_stop: string;
  walking_time: string;
  routes: string;
  origin?: string;
}

export const bmtcConnectivity: Record<string, BMTCConnectivity> = {
  "E005": {
    college_id: "E005",
    name: "RV College of Engineering",
    nearest_stop: "RV College Bus Stop",
    walking_time: "0 min",
    routes: "From Majestic, From Kengeri, From Shivajinagar, From Banashankari, 222A, 226A, 223-D, 515-B, D-6, MF-40B",
    origin: "From Majestic"
  },
  "E009": {
    college_id: "E009",
    name: "PES University (Ring Road)",
    nearest_stop: "PES College Bus Stop",
    walking_time: "2 min",
    routes: "From Banashankari TTMC, From Majestic, From Nagarbhavi, MF-510A, 410, MF-13, 43D",
    origin: "From Banashankari TTMC"
  },
  "E001": {
    college_id: "E001",
    name: "UVCE (KR Circle Campus)",
    nearest_stop: "K.R. Circle / Maharani College",
    walking_time: "3 min",
    routes: "From Majestic, From Shivajinagar, From K.R. Market, 215-H, 258, 298-MV, 365-P, G-10",
    origin: "From Majestic"
  },
  "E006": {
    college_id: "E006",
    name: "MS Ramaiah Institute of Technology",
    nearest_stop: "MSRIT / Mathikere Post Office",
    walking_time: "4 min",
    routes: "From Yeshwanthpur TTMC, From Majestic, From Hebbal, 266, 276-A, 401-K, 500-BA",
    origin: "From Yeshwanthpur TTMC"
  },
  "E003": {
    college_id: "E003",
    name: "BMS College of Engineering",
    nearest_stop: "Ramakrishna Ashram / Vidyapeeta",
    walking_time: "7 min",
    routes: "From K.R. Market, From Majestic, From Jayanagar, 210-W, 213-H, 45-D, 45-G",
    origin: "From K.R. Market"
  },
  "E099": {
    college_id: "E099",
    name: "New Horizon College of Engineering",
    nearest_stop: "Marathahalli Bridge",
    walking_time: "5 min",
    routes: "From Silk Board, From K.R. Puram, From Hebbal, From Majestic, 500-A, 500-L, 333, KIA-8",
    origin: "From Silk Board"
  },
  "E007": {
    college_id: "E007",
    name: "Dayananda Sagar College of Engg.",
    nearest_stop: "Kadirenahalli Cross / DSCE Stop",
    walking_time: "8 min",
    routes: "From Banashankari TTMC, From Majestic, From Jayanagar, 15-E, 210-R, 501-A, V-BMT13",
    origin: "From Banashankari TTMC"
  },
  "E008": {
    college_id: "E008",
    name: "Bangalore Institute of Technology",
    nearest_stop: "Makkala Koota / Sajjan Rao Circle",
    walking_time: "5 min",
    routes: "From K.R. Market, From Majestic, 15-E, 210-E, 211-C, 213-M, 77",
    origin: "From K.R. Market"
  },
  "E115": {
    college_id: "E115",
    name: "SJB Institute of Technology",
    nearest_stop: "BGS Hospital Stop / Pattanagere",
    walking_time: "10 min",
    routes: "From Kengeri, From Majestic, 225-C, 225-A, 227 series",
    origin: "From Kengeri"
  },
  "E107": {
    college_id: "E107",
    name: "BNM Institute of Technology",
    nearest_stop: "Banashankari BDA Complex",
    walking_time: "8 min",
    routes: "From Banashankari TTMC, From Jayanagar, From Majestic, 210 series, 2, 15 series",
    origin: "From Banashankari TTMC"
  },
  "E141": {
    college_id: "E141",
    name: "PES University (Electronic City)",
    nearest_stop: "Electronic City Phase 1 / Velankani",
    walking_time: "12 min",
    routes: "From Silk Board, From Majestic, From Banashankari, 356-C, 356-M, 600-F, V-356",
    origin: "From Silk Board"
  },
  "E097": {
    college_id: "E097",
    name: "CMR Institute of Technology",
    nearest_stop: "AECS Layout / Kundalahalli Gate",
    walking_time: "6 min",
    routes: "From K.R. Puram, From Majestic, From Silk Board, From Shivajinagar, 333, 335-E, 330, 500-C",
    origin: "From K.R. Puram"
  },
  "E118": {
    college_id: "E118",
    name: "RNS Institute of Technology",
    nearest_stop: "Channasandra / RNSIT Stop",
    walking_time: "4 min",
    routes: "From Kengeri, From Nagarbhavi, From Majestic, 223 series, 225 series, 374-E",
    origin: "From Kengeri"
  },
  "E126": {
    college_id: "E126",
    name: "BMSIT&M",
    nearest_stop: "Avalahalli / Nitte Meenakshi Stop",
    walking_time: "15 min",
    routes: "From Yelahanka, From Majestic, 284-A, 285 series, 298 series",
    origin: "From Yelahanka"
  },
  "E050": {
    college_id: "E050",
    name: "NMIT",
    nearest_stop: "NMIT Junction",
    walking_time: "12 min",
    routes: "From Yelahanka, From Majestic, 284-A, 285 series",
    origin: "From Yelahanka"
  },
  "E082": {
    college_id: "E082",
    name: "JSS Academy of Technical Education",
    nearest_stop: "JSS College Stop (Uttarahalli)",
    walking_time: "2 min",
    routes: "From Banashankari, From Kengeri, 375-A, 375-B, 225-C",
    origin: "From Banashankari"
  }
};

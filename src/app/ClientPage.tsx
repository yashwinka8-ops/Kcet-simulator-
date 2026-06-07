'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  MapPin, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  Info, 
  IndianRupee, 
  Users, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Hostel {
  id: string;
  name: string;
  category: 'government' | 'community' | 'charitable';
  categoryLabel: string;
  cost: string;
  yearlyCostNum: number; // for sorting
  address: string;
  details: string;
  applyMethod: string;
  applyLink?: string;
  featured?: boolean;
}

const HOSTELS_DATA: Hostel[] = [
  // Government Free Hostels
  {
    id: 'gov-1',
    name: 'Dr. B.R. Ambedkar Post-Matric Boys Hostel (SC/ST)',
    category: 'government',
    categoryLabel: 'Government Free',
    cost: 'Free (100% Subsidized)',
    yearlyCostNum: 0,
    address: 'Near Majestic Railway Station / Cottonpet, Bengaluru',
    details: 'Centralized, high-capacity hostel specifically dedicated for SC/ST students with free stay and food.',
    applyMethod: 'SSP Portal Online',
    applyLink: 'https://shp.karnataka.gov.in/',
    featured: true
  },
  {
    id: 'gov-2',
    name: 'Government Post-Matric Boys Hostel (BCM/OBC)',
    category: 'government',
    categoryLabel: 'Government Free',
    cost: 'Free (100% Subsidized)',
    yearlyCostNum: 0,
    address: '1st Main Rd, RPC Layout, Vijayanagar, Bengaluru - 560104',
    details: 'Reserved for Category-1, 2A, 3A, and 3B students pursuing post-matric/engineering education.',
    applyMethod: 'SSP Portal Online',
    applyLink: 'https://shp.karnataka.gov.in/'
  },
  {
    id: 'gov-3',
    name: 'Devaraj Urs BCM Hostel',
    category: 'government',
    categoryLabel: 'Government Free',
    cost: 'Free (100% Subsidized)',
    yearlyCostNum: 0,
    address: 'Near Yelahanka Police Station, Old Town, Yelahanka, Bengaluru',
    details: 'Strategically located for students enrolled in the North Bengaluru engineering and educational belt.',
    applyMethod: 'SSP Portal Online',
    applyLink: 'https://shp.karnataka.gov.in/'
  },
  {
    id: 'gov-4',
    name: 'Government Science College Hostel',
    category: 'government',
    categoryLabel: 'Government Free',
    cost: 'Free (100% Subsidized)',
    yearlyCostNum: 0,
    address: 'Nrupathunga Road, Ambedkar Veedhi, Bengaluru - 560001',
    details: 'Highly convenient for students admitted to UVCE or surrounding technical institutes in the Central Business District.',
    applyMethod: 'SSP Portal Online',
    applyLink: 'https://shp.karnataka.gov.in/'
  },

  // Community Sangha Hostels
  {
    id: 'com-1',
    name: 'Vokkaligara Sangha Main Hostel',
    category: 'community',
    categoryLabel: 'Community Sangha',
    cost: '₹20,000 - ₹30,000 / year',
    yearlyCostNum: 25000,
    address: 'No. 1, K.R. Road, V.V. Puram, Bengaluru - 560004 (Next to KIMS Hospital)',
    details: 'One of the absolute largest student lodging hubs in Bengaluru. Priority allocations given to community members.',
    applyMethod: 'In-person at V.V. Puram Office',
    featured: true
  },
  {
    id: 'com-2',
    name: 'Reddy Jana Sangha Hostel',
    category: 'community',
    categoryLabel: 'Community Sangha',
    cost: '₹15,000 - ₹35,000 / year',
    yearlyCostNum: 25000,
    address: 'No. 1, Mahayogi Vemana Road, 3rd Block, Koramangala, Bengaluru - 560034',
    details: 'Premium, secure infrastructure featuring a highly dedicated study environment and hygienic mess amenities.',
    applyMethod: 'In-person application at Sangha Office'
  },
  {
    id: 'com-3',
    name: 'Kurubara Sangha Hostel',
    category: 'community',
    categoryLabel: 'Community Sangha',
    cost: '₹15,000 - ₹30,000 / year',
    yearlyCostNum: 22000,
    address: '2nd Cross Road, Gandhinagar, Bengaluru - 560009 (Near Majestic)',
    details: 'Extremely central transit accessibility. Ideal walking distance to primary coaching networks and major bus/train hubs.',
    applyMethod: 'In-person at Gandhinagar HQ'
  },
  {
    id: 'com-4',
    name: 'Veerashaiva (Lingayat) Vidyarthi Nilaya',
    category: 'community',
    categoryLabel: 'Community Sangha',
    cost: '₹20,000 - ₹35,000 / year',
    yearlyCostNum: 27500,
    address: 'KVVN Samithi, 17th Cross, M.C. Layout, Vijayanagar, Bengaluru - 560040',
    details: 'Large-scale, highly disciplined boarding environment surrounded by extensive academic ecosystems and libraries.',
    applyMethod: 'Submit forms directly at KVVN Samithi'
  },
  {
    id: 'com-5',
    name: 'Devanga Sangha Hostel',
    category: 'community',
    categoryLabel: 'Community Sangha',
    cost: '₹15,000 - ₹28,000 / year',
    yearlyCostNum: 21500,
    address: 'Devanga Sangha Road, Near Sampangiramanagar, Bengaluru - 560027',
    details: 'Subsidized boarding options situated right adjacent to central educational zones.',
    applyMethod: 'In-person at Devanga Sangha Office'
  },

  // Charitable & Math-Run Hostels
  {
    id: 'char-1',
    name: 'Ramakrishna Vidyarthi Mandiram',
    category: 'charitable',
    categoryLabel: 'Math / Charitable',
    cost: '₹5,000 - ₹12,000 / year',
    yearlyCostNum: 8500,
    address: '#1, Gavipuram Guttahalli, Near Kempambudhi Lake, Basavanagudi, Bengaluru - 560019',
    details: 'Extremely affordable fees paired with rigorous study timetables and strong spiritual/moral character development.',
    applyMethod: 'Merit-based entrance test & personal interview',
    featured: true
  },
  {
    id: 'char-2',
    name: 'S.L.N. Charities Hostel',
    category: 'charitable',
    categoryLabel: 'Math / Charitable',
    cost: '₹4,000 - ₹10,000 / year',
    yearlyCostNum: 7000,
    address: 'Near Fort/Victoria Hospital, K.R. Market, Bengaluru - 560002',
    details: 'Historic philanthropic institution granting heavily discounted long-term accommodations for outstanding candidates.',
    applyMethod: 'Merit scrutiny & document verification'
  },
  {
    id: 'char-3',
    name: 'Sri Adichunchanagiri Shikshana Trust Hostel',
    category: 'charitable',
    categoryLabel: 'Math / Charitable',
    cost: '₹8,000 - ₹15,000 / year',
    yearlyCostNum: 11500,
    address: '1st Cross, Vijayanagar, Bengaluru - 560040 (Branches also in RR Nagar)',
    details: 'Massive housing complexes managed directly by the Math ecosystem guaranteeing comprehensive food and secure lodging.',
    applyMethod: 'Math recommendation & merit assessment'
  },
  {
    id: 'char-4',
    name: 'Aryavidya Hostel',
    category: 'charitable',
    categoryLabel: 'Math / Charitable',
    cost: '₹6,000 - ₹14,000 / year',
    yearlyCostNum: 10000,
    address: 'Siddaiah Road, Sudhama Nagar, Bengaluru - 560027',
    details: 'Highly community-backed low-cost shelter geared towards providing stable environments for rural engineering entrants.',
    applyMethod: 'Application review & background assessment'
  }
];

export default function HostelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'cost-asc' | 'name'>('cost-asc');

  // Filter and sort hostels
  const filteredHostels = useMemo(() => {
    return HOSTELS_DATA.filter(hostel => {
      const matchesSearch = 
        hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hostel.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hostel.details.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || hostel.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'cost-asc') {
        return a.yearlyCostNum - b.yearlyCostNum;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-20 px-4 md:px-8 selection:bg-primary/30">
      {/* Background radial soft lights */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[30%] bg-emerald-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[35%] h-[35%] bg-primary/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Title Section */}
        <header className="mb-12 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-black uppercase tracking-widest mb-4"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Boarding Infrastructure
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-6xl font-black tracking-tight leading-tight"
          >
            Free & Budget <span className="text-emerald-400">Hostels</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-2 text-sm md:text-base max-w-2xl mx-auto md:mx-0"
          >
            Explore completely free government lodging, subsidized community sanghas, and merit-based charitable options across Bengaluru to drastically minimize your engineering living expenses.
          </motion.p>
        </header>

        {/* Informative Highlights / Quick Overview Table Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Building className="w-24 h-24" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Government Hostels</p>
            <p className="text-xl font-black text-white mt-1">100% Free</p>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <span className="text-emerald-400 font-bold">Via SSP Portal</span> online
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Users className="w-24 h-24" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vokkaligara Sangha</p>
            <p className="text-xl font-black text-white mt-1">₹20k - ₹30k<span className="text-xs font-normal text-muted-foreground">/yr</span></p>
            <p className="text-xs text-muted-foreground mt-2">
              Apply at V.V. Puram HQ
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <BookOpen className="w-24 h-24" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Math / Charities</p>
            <p className="text-xl font-black text-white mt-1">₹5k - ₹15k<span className="text-xs font-normal text-muted-foreground">/yr</span></p>
            <p className="text-xs text-muted-foreground mt-2">
              Merit & interview based
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <IndianRupee className="w-24 h-24" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Other Sanghas</p>
            <p className="text-xl font-black text-white mt-1">₹25k - ₹40k<span className="text-xs font-normal text-muted-foreground">/yr</span></p>
            <p className="text-xs text-muted-foreground mt-2">
              Direct sangha submission
            </p>
          </div>
        </div>

        {/* Controls & Search Filter Pane */}
        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Categories Pill toggles */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2 hidden sm:block">Filter:</span>
            {[
              { id: 'all', label: 'All Options' },
              { id: 'government', label: 'Government Free' },
              { id: 'community', label: 'Community Sanghas' },
              { id: 'charitable', label: 'Math / Charitable' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={cn(
                  "px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border",
                  selectedCategory === tab.id
                    ? "bg-emerald-400 text-black border-emerald-400 shadow-lg font-black"
                    : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10 hover:text-white"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Bar & Sort Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search location or hostel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-emerald-400 transition-all"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-muted-foreground focus:outline-none focus:border-emerald-400 transition-all cursor-pointer"
            >
              <option value="cost-asc">Sort: Price (Low to High)</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>

        </div>

        {/* Main Listing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredHostels.length === 0 ? (
              <div className="col-span-full py-16 text-center text-muted-foreground space-y-2">
                <Info className="w-8 h-8 text-white/20 mx-auto" />
                <p className="text-sm font-bold">No hostels match your active filters or search terms.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                  className="text-xs text-emerald-400 font-bold underline hover:text-emerald-300"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              filteredHostels.map((hostel) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  key={hostel.id}
                  className={cn(
                    "rounded-3xl bg-white/[0.02] border transition-all flex flex-col justify-between overflow-hidden group hover:bg-white/[0.04]",
                    hostel.featured ? "border-emerald-500/30 shadow-xl shadow-emerald-500/5" : "border-white/5 hover:border-white/20"
                  )}
                >
                  {/* Card Inner Content Container */}
                  <div className="p-6 space-y-4">
                    
                    {/* Top Status Indicators */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        hostel.category === 'government' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                        hostel.category === 'community' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      )}>
                        {hostel.categoryLabel}
                      </span>

                      {hostel.featured && (
                        <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                          <Sparkles className="w-2.5 h-2.5" /> High Capacity
                        </span>
                      )}
                    </div>

                    {/* Title & Cost */}
                    <div>
                      <h3 className="font-bold text-base text-white leading-tight group-hover:text-emerald-400 transition-colors">
                        {hostel.name}
                      </h3>
                      <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="text-sm font-mono font-bold text-white/90 px-2 py-0.5 bg-white/5 rounded border border-white/5">
                          {hostel.cost}
                        </span>
                      </div>
                    </div>

                    {/* Address Line */}
                    <div className="flex items-start gap-2 pt-2 border-t border-white/5 text-xs text-muted-foreground/90">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{hostel.address}</span>
                    </div>

                    {/* Details Snippet */}
                    <p className="text-xs text-muted-foreground/70 leading-relaxed font-medium">
                      {hostel.details}
                    </p>

                  </div>

                  {/* Card Bottom CTA Action Footer */}
                  <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between gap-3 mt-auto">
                    <div className="space-y-0.5">
                      <span className="text-[8px] font-black uppercase tracking-wider text-muted-foreground block">Application Pathway</span>
                      <span className="text-[11px] font-bold text-white/90 block truncate max-w-[180px]">{hostel.applyMethod}</span>
                    </div>

                    {hostel.applyLink ? (
                      <a
                        href={hostel.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shrink-0 border border-emerald-500/20"
                      >
                        SSP Portal <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-white/5 text-muted-foreground text-[9px] font-bold tracking-tight select-all text-center">
                        In-Person Query
                      </span>
                    )}
                  </div>

                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Detailed Application Assistance Guidelines Accordion/Section */}
        <div className="mt-12 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-primary/5 to-transparent border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <h4 className="text-base font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              SSP State Scholarship Portal Integration Guide
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              For all Government Free hostels, eligibility verification requires valid Aadhar linked bank accounts, current year KEA CET admission order, and valid income/caste verification certificates. Ensure your documentation is mapped correctly on the SSP application portal prior to counseling fee payment.
            </p>
          </div>

          <a 
            href="https://shp.karnataka.gov.in/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl bg-white text-black font-black text-xs hover:scale-105 transition-all shadow-xl flex items-center gap-2 shrink-0"
          >
            Launch Official SSP Site <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}

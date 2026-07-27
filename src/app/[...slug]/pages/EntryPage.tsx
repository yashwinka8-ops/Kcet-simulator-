'use client';

import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
    Lock, 
    Layers, 
    ListFilter, 
    Check, 
    RefreshCw, 
    Clock, 
    Wallet, 
    ListOrdered, 
    ShieldCheck, 
    FileSpreadsheet, 
    FileDown,
    Save,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { getRoundLabel } from '@/lib/utils/cutoff-link';

interface EntryPageProps {
    globalConfig: any;
    previousAllotment: any;
    submittedRound: number;
    selectedStream: 'course' | 'college';
    setSelectedStream: (v: 'course' | 'college') => void;
    selectedBranch: string;
    setSelectedBranch: (v: string) => void;
    selectedCollege: string;
    setSelectedCollege: (v: string) => void;
    options: Record<string, string>;
    draftOptions: Record<string, string>;
    setDraftOptions: (v: Record<string, string>) => void;
    representativeBranches: { code: string; name: string }[];
    getRawBranchIds: (code: string) => string[];
    colleges: any[];
    allBranches: any[];
    handlePriorityChange: (collegeId: string, branchId: string, value: string) => void;
    handleDraftChange: (collegeId: string, branchId: string, value: string) => void;
    handleUpdateList: () => Promise<void>;
    handleFinalSubmit: () => void;
    handleDownloadReport: () => void;
    selectedOptions: any[];
    isSubmitting: boolean;
    choiceSubmitted?: boolean;
}

// Utility to convert numbers to Indian Rupee Words Format
const formatRupeeWithWords = (feeVal: string | number) => {
    if (!feeVal || feeVal === 'N/A') return '₹ 0 - Zero Rupees Only';
    
    const numericStr = String(feeVal).replace(/[^0-9]/g, '');
    const num = parseInt(numericStr, 10);
    if (isNaN(num) || num === 0) return '₹ 0 - Zero Rupees Only';

    const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const formatTens = (n: number) => {
        if (n < 10) return single[n];
        if (n >= 10 && n < 20) return double[n - 10];
        return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + single[n % 10] : '');
    };

    let words = '';
    const lakhs = Math.floor(num / 100000);
    let remaining = num % 100000;
    
    if (lakhs > 0) {
        words += formatTens(lakhs) + ' Lakh ';
    }
    
    const thousands = Math.floor(remaining / 1000);
    remaining = remaining % 1000;
    if (thousands > 0) {
        words += formatTens(thousands) + ' Thousand ';
    }
    
    const hundreds = Math.floor(remaining / 100);
    remaining = remaining % 100;
    if (hundreds > 0) {
        words += formatTens(hundreds) + ' Hundred ';
    }
    
    if (remaining > 0) {
        if (words !== '') words += 'and ';
        words += formatTens(remaining);
    }
    
    const wordsFormatted = (words.trim() + ' Rupees Only').replace(/\s+/g, ' ');
    const numberFormatted = num.toLocaleString('en-IN');
    return `₹ ${numberFormatted} - ${wordsFormatted}`;
};

export default function EntryPage({
    globalConfig,
    previousAllotment,
    submittedRound,
    selectedStream,
    setSelectedStream,
    selectedBranch,
    setSelectedBranch,
    selectedCollege,
    setSelectedCollege,
    options,
    draftOptions,
    setDraftOptions,
    representativeBranches,
    getRawBranchIds,
    colleges,
    allBranches,
    handlePriorityChange,
    handleDraftChange,
    handleUpdateList,
    handleFinalSubmit,
    handleDownloadReport,
    selectedOptions,
    isSubmitting,
    choiceSubmitted = false,
}: EntryPageProps) {
    const currentRound = globalConfig?.currentRound ?? 0;
    const canAddFreshOptions = currentRound <= 1 && !choiceSubmitted;

    // Session Timer Countdown
    const [timeLeft, setTimeLeft] = useState(1794); // 29:54 default

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTimer = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate dynamic stats
    const optionsAdded = selectedOptions.length;
    const lastPriorityNo = selectedOptions.length > 0 ? Math.max(...selectedOptions.map(o => o.priority)) : 0;
    const highestFeeValue = selectedOptions.reduce((max, opt) => {
        const numeric = parseInt(String(opt.fees).replace(/[^0-9]/g, ''), 10);
        return !isNaN(numeric) && numeric > max ? numeric : max;
    }, 0);

    // Expand/Collapse state for colleges in the search list
    const [expandedColleges, setExpandedColleges] = useState<Record<string, boolean>>({});

    const toggleCollege = (collegeId: string) => {
        setExpandedColleges(prev => ({
            ...prev,
            [collegeId]: !prev[collegeId]
        }));
    };

    return (
        <div className="space-y-6 pb-24 -mx-6 md:-mx-12 -mt-6 md:-mt-12 bg-[#F1F5F9] min-h-screen">
            
            {/* --- TOP BANNER (SECONDARY STATS SUB-HEADER) --- */}
            <div className="bg-[#0B1E36] border-b border-[#243B55] px-6 md:px-12 py-3 shadow-md text-white select-none">
                <div className="w-full max-w-[1500px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Breadcrumb & Title */}
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#D99A29] font-bold tracking-wider uppercase">
                            DASHBOARD &bull; CAP - OPTION ENTRY
                        </span>
                        <h2 className="text-lg md:text-xl font-extrabold text-white tracking-tight mt-0.5">
                            Option Entry
                        </h2>
                    </div>

                    {/* Right: KEA Mock Stats Blocks matching target screenshot */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Options Added Block */}
                        <div className="bg-[#122744] border border-[#243B55] px-3 py-1.5 rounded-lg flex items-center gap-2.5 min-w-[110px] shadow-sm">
                            <Layers className="w-4 h-4 text-[#D99A29]" />
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-400 font-bold uppercase">OPTIONS ADDED</span>
                                <span className="text-sm font-extrabold text-white leading-none mt-0.5">{optionsAdded}</span>
                            </div>
                        </div>

                        {/* Last Priority Block */}
                        <div className="bg-[#122744] border border-[#243B55] px-3 py-1.5 rounded-lg flex items-center gap-2.5 min-w-[110px] shadow-sm">
                            <ListOrdered className="w-4 h-4 text-[#D99A29]" />
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-400 font-bold uppercase">LAST PRIORITY NO.</span>
                                <span className="text-sm font-extrabold text-white leading-none mt-0.5">{lastPriorityNo}</span>
                            </div>
                        </div>

                        {/* Highest Fees Block */}
                        <div className="bg-[#122744] border border-[#243B55] px-3.5 py-1.5 rounded-lg flex items-center gap-2.5 max-w-[340px] shadow-sm">
                            <Wallet className="w-4 h-4 text-[#10B981]" />
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-[9px] text-slate-400 font-bold uppercase">HIGHEST FEES</span>
                                <span className="text-xs font-extrabold text-white leading-none mt-0.5 truncate" title={formatRupeeWithWords(highestFeeValue)}>
                                    {formatRupeeWithWords(highestFeeValue)}
                                </span>
                            </div>
                        </div>

                        {/* Session Expiry Block */}
                        <div className="bg-[#122744] border border-[#243B55] px-3 py-1.5 rounded-lg flex items-center gap-2.5 min-w-[130px] shadow-sm">
                            <Clock className="w-4 h-4 text-amber-400" />
                            <div className="flex flex-col text-right">
                                <span className="text-[9px] text-slate-400 font-bold uppercase">SESSION EXPIRES IN</span>
                                <span className="font-mono font-extrabold text-white text-base leading-none mt-0.5">{formatTimer(timeLeft)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN PAGE CONTENT (55/45 RESPONSIVE SIDE-BY-SIDE SPLIT) --- */}
            <div className="w-full max-w-[1500px] mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    
                    {/* --- LEFT COLUMN: ADD OPTIONS (55% Width) --- */}
                    <div className={cn(
                        "bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 w-full lg:w-[55%]",
                        !canAddFreshOptions && "items-center justify-center p-12 text-center"
                    )}>
                        {canAddFreshOptions ? (
                            <>
                                {/* Card Header with list icon matching screenshot */}
                                <div className="p-4 bg-[#EFF6FF] border-b border-[#BFDBFE] flex items-center justify-between">
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-sm shrink-0">
                                            <Layers className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#0F172A] text-base leading-tight font-sans tracking-tight">Add Options</h3>
                                            <p className="text-xs text-[#64748B] mt-0.5">Browse and select college &amp; course preferences</p>
                                        </div>
                                    </div>
                                    <a 
                                        href="https://cetonline.karnataka.gov.in/kea/" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-xs text-[#2563EB] font-bold hover:underline cursor-pointer flex items-center gap-1 shrink-0"
                                    >
                                        View more about college details
                                    </a>
                                </div>

                                {/* Filters Panel */}
                                <div className="p-5 bg-[#F8FAFC] border-b border-slate-200 space-y-4">
                                    {/* Select Discipline, Filter By, Value Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                                DISCIPLINE
                                            </label>
                                            <select className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs">
                                                <option value="Engineering">Engineering</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                                FILTER BY
                                            </label>
                                            <select className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs">
                                                <option>No Filter</option>
                                                <option>By Stream</option>
                                            </select>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                                VALUE
                                            </label>
                                            <div className="flex gap-2">
                                                <select className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs">
                                                    <option>Select Value</option>
                                                </select>
                                                <button 
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedBranch('');
                                                        setSelectedCollege('');
                                                    }}
                                                    className="px-3 border border-[#FCA5A5] bg-[#FEE2E2] hover:bg-[#FECACA] text-[#991B1B] rounded-md text-[11px] font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1 shrink-0"
                                                >
                                                    <span className="w-3.5 h-3.5 rounded-full bg-[#DC2626] text-white flex items-center justify-center text-[10px] font-black leading-none">&times;</span>
                                                    <span>Clear</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stream Radio Controls & Search Dropdown */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                                        <div className="flex items-center gap-4 shrink-0">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                STREAM
                                            </span>
                                            
                                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="stream" 
                                                    checked={selectedStream === 'course'} 
                                                    onChange={() => {
                                                        setSelectedStream('course');
                                                        setSelectedCollege('');
                                                    }} 
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500/20 cursor-pointer" 
                                                /> 
                                                <span>Course</span>
                                            </label>
                                            
                                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="stream" 
                                                    checked={selectedStream === 'college'} 
                                                    onChange={() => {
                                                        setSelectedStream('college');
                                                        setSelectedBranch('');
                                                    }} 
                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500/20 cursor-pointer" 
                                                /> 
                                                <span>College</span>
                                            </label>
                                        </div>

                                        {/* Dropdown Selector */}
                                        <div className="flex-1 w-full relative">
                                            <select
                                                value={selectedStream === 'course' ? selectedBranch : selectedCollege}
                                                onChange={(e) => {
                                                    if (selectedStream === 'course') {
                                                        setSelectedBranch(e.target.value);
                                                    } else {
                                                        setSelectedCollege(e.target.value);
                                                    }
                                                }}
                                                className="w-full border border-[#D99A29]/60 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#D99A29]/20 shadow-sm cursor-pointer"
                                            >
                                                <option value="">-- Select {selectedStream === 'course' ? 'Course' : 'College'} --</option>
                                                {selectedStream === 'course' ? (
                                                    representativeBranches.map((rb) => (
                                                        <option key={rb.code} value={rb.code}>{rb.code} - {rb.name}</option>
                                                    ))
                                                ) : (
                                                    colleges.map((c: any) => (
                                                        <option key={c.college_id} value={c.college_id}>{c.college_id} - {c.name}</option>
                                                    ))
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Table Header Column Titles */}
                                <div className="bg-gradient-to-r from-[#EAF1F8] to-[#DDEAF5] border-b border-slate-200 flex text-[10px] font-bold text-slate-500 uppercase tracking-wider items-stretch select-none">
                                    <div className="w-12 text-center py-2.5 border-r border-slate-200 flex items-center justify-center shrink-0">#</div>
                                    <div className="flex-1 px-4 py-2.5 border-r border-slate-200 flex items-center">College &amp; Course</div>
                                    <div className="w-48 text-center py-2.5 border-r border-slate-200 flex items-center justify-center leading-tight">Fees (₹ P.A.)</div>
                                    <div className="w-24 text-center py-2.5 flex items-center justify-center leading-tight shrink-0">Option No.</div>
                                </div>

                                {/* Scrollable List Content */}
                                <div className="flex-1 overflow-y-auto max-h-[620px] bg-slate-50/30">
                                    {(() => {
                                        let filteredRows: any[] = [];

                                        if (selectedStream === 'course' && selectedBranch) {
                                            const aliases = getRawBranchIds(selectedBranch);
                                            const matchingColleges = colleges.filter((c: any) =>
                                                c.kcet_cutoffs.some((cut: any) => aliases.includes(cut.branch_id) || cut.branch_id.startsWith(selectedBranch))
                                            ).slice(0, 100);

                                            const repBranch = representativeBranches.find(rb => rb.code === selectedBranch);

                                            filteredRows = matchingColleges.map((c: any) => ({
                                                college: c,
                                                branch: repBranch || { code: selectedBranch, name: selectedBranch },
                                                courseCode: c.kcet_cutoffs.find((cut: any) => aliases.includes(cut.branch_id) || cut.branch_id.startsWith(selectedBranch))?.branch_id || ''
                                            }));
                                        } else if (selectedStream === 'college' && selectedCollege) {
                                            const targetColId = selectedCollege;
                                            const col = colleges.find((c: any) => c.college_id === targetColId);

                                            if (col) {
                                                const rawBranchIds = Array.from(new Set(col.kcet_cutoffs.map((cut: any) => cut.branch_id))) as string[];

                                                filteredRows = rawBranchIds.map(id => {
                                                    let rep = representativeBranches.find(rb => id === rb.code || getRawBranchIds(rb.code).includes(id));

                                                    if (!rep && !id.startsWith('BTCS') && !id.startsWith('BTE')) {
                                                        rep = representativeBranches.find(rb => id.startsWith(rb.code));
                                                    }

                                                    const branchData = allBranches.find((b: any) => (b.branch_code || b.branch_id) === id);
                                                    const rawName = branchData?.branch_name || branchData?.name || '';
                                                    const cleanedName = rawName.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\s+/g, ' ').trim();
                                                    const displayName = cleanedName || (rep ? rep.name : id.startsWith('NEW_') ? 'OTHER ENGINEERING' : id);

                                                    return {
                                                        college: col,
                                                        branch: {
                                                            code: rep?.code || id,
                                                            name: displayName
                                                        },
                                                        courseCode: id
                                                    };
                                                });
                                            }
                                        }

                                        if (!selectedBranch && !selectedCollege) {
                                            return (
                                                <div className="p-16 text-center text-slate-400 font-semibold flex flex-col items-center gap-3">
                                                    <ListFilter className="w-8 h-8 text-slate-300" />
                                                    <span>Please select a Course or College from the dropdown above to view options.</span>
                                                </div>
                                            );
                                        }

                                        // Deduplicate by representative code per college
                                        const seenKeys = new Set();
                                        filteredRows = filteredRows.filter(row => {
                                            const bCode = row.branch.code || row.branch.branch_code || row.branch.branch_id;
                                            const key = `${row.college.college_id}:::${bCode}`;
                                            if (seenKeys.has(key)) return false;
                                            seenKeys.add(key);
                                            return true;
                                        });

                                        if (filteredRows.length === 0) {
                                            return (
                                                <div className="p-16 text-center text-slate-400 font-semibold italic">
                                                    No option matching selection was found.
                                                </div>
                                            );
                                        }

                                        // Group rows by college code for hierarchical display
                                        const groupedByCol: Record<string, { college: any, rows: any[] }> = {};
                                        filteredRows.forEach(row => {
                                            const cId = row.college.college_id;
                                            if (!groupedByCol[cId]) {
                                                groupedByCol[cId] = {
                                                    college: row.college,
                                                    rows: []
                                                };
                                            }
                                            groupedByCol[cId].rows.push(row);
                                        });

                                        return (
                                            <div className="divide-y divide-slate-200">
                                                {Object.entries(groupedByCol).map(([cId, group]) => {
                                                    const isExpanded = expandedColleges[cId] !== false; // expanded by default
                                                    
                                                    return (
                                                        <div key={cId} className="bg-white">
                                                            
                                                            {/* Category Header Row (Mocking KEA layout) */}
                                                            <div className="bg-[#FEF3C7] px-4 py-1.5 text-[11px] font-bold text-[#D97706] tracking-wider border-b border-slate-200/50">
                                                                &mdash; B - PRIVATE UNAIDED
                                                            </div>

                                                            {/* Collapsible College Bar */}
                                                            <div 
                                                                onClick={() => toggleCollege(cId)}
                                                                className="flex items-center gap-3.5 px-4 py-3 bg-slate-50 hover:bg-slate-100/80 border-b border-slate-200 cursor-pointer select-none transition-colors"
                                                            >
                                                                <button type="button" className="text-slate-500 focus:outline-none shrink-0">
                                                                    {isExpanded ? (
                                                                        <span className="text-base font-black leading-none font-mono">&minus;</span>
                                                                    ) : (
                                                                        <span className="text-base font-black leading-none font-mono">+</span>
                                                                    )}
                                                                </button>
                                                                <span className="font-extrabold text-[12.5px] text-[#1B365D] tracking-wide leading-tight">
                                                                    {group.college.college_id} &ndash; {group.college.name}
                                                                </span>
                                                            </div>

                                                            {/* Courses list under this college */}
                                                            {isExpanded && (
                                                                <div className="divide-y divide-slate-100 bg-white">
                                                                    {group.rows.map((row, idx) => {
                                                                        const bCode = row.branch.code || row.branch.branch_code || row.branch.branch_id;
                                                                        const bName = row.branch.name || row.branch.branch_name || bCode;
                                                                        const key = `${row.college.college_id}:::${bCode}`;
                                                                        
                                                                        return (
                                                                            <div key={key} className="flex hover:bg-slate-50/50 transition-colors items-stretch">
                                                                                
                                                                                {/* SL.No. */}
                                                                                <div className="w-12 text-center py-3 border-r border-slate-200/70 text-xs font-bold text-slate-400 flex items-center justify-center shrink-0">
                                                                                    {idx + 1}
                                                                                </div>

                                                                                {/* Course Details (Badge + Name) */}
                                                                                <div className="flex-1 px-4 py-3 border-r border-slate-200/70 text-xs text-slate-800 leading-snug flex items-center gap-3.5">
                                                                                    <span className="bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE] font-bold text-[10px] px-2.5 py-1 rounded-md shrink-0 select-none">
                                                                                        {bCode}
                                                                                    </span>
                                                                                    <span className="font-semibold text-slate-700 tracking-wide uppercase">
                                                                                        {bName}
                                                                                    </span>
                                                                                </div>

                                                                                {/* Fees column formatted in Rupee + Words */}
                                                                                <div className="w-48 text-center py-3 border-r border-slate-200/70 text-[10px] font-extrabold text-[#122744] flex items-center justify-center leading-normal px-2.5">
                                                                                    {formatRupeeWithWords(row.college.fees)}
                                                                                </div>

                                                                                {/* Option No Input */}
                                                                                <div className="w-24 flex items-center justify-center p-2 bg-[#EBF3FA]/30 shrink-0">
                                                                                    <input
                                                                                        type="text"
                                                                                        value={options[key] || ''}
                                                                                        onChange={(e) => handlePriorityChange(row.college.college_id, bCode, e.target.value)}
                                                                                        className="w-12 h-8 border border-slate-300 rounded-xl text-center text-xs font-extrabold text-[#1B365D] bg-white focus:outline-none focus:ring-2 focus:ring-[#D99A29]/40 focus:border-[#D99A29] shadow-inner"
                                                                                        placeholder=""
                                                                                    />
                                                                                </div>

                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Bottom card footer actions */}
                                <div className="p-5 bg-white border-t border-slate-200 flex flex-col items-center gap-2 shadow-inner">
                                    <button
                                        type="button"
                                        onClick={handleFinalSubmit}
                                        disabled={isSubmitting}
                                        className="bg-[#2563EB] hover:bg-[#1D4ED8] active:bg-[#1E40AF] text-white px-8 py-3 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                                    >
                                        <Save className="w-4 h-4 text-[#D99A29]" />
                                        <span>{isSubmitting ? 'Submitting...' : 'Save & Submit'}</span>
                                    </button>
                                    
                                    <p className="text-[11px] text-[#C2410C] font-bold mt-1 text-center">
                                        Please click on the Save and Submit button every 2 minutes to save your options
                                    </p>
                                    <p className="text-[11px] text-[#C2410C] font-bold text-center">
                                        NOTE: N/A Fees shall be updated shortly.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 py-16 animate-in fade-in zoom-in-95 duration-300">
                                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-amber-100/50">
                                    <Lock className="w-10 h-10 text-amber-500" />
                                </div>
                                <h3 className="text-base font-extrabold text-slate-800 uppercase tracking-widest mb-2">Fresh Entry Disabled</h3>
                                <p className="text-xs font-semibold text-slate-500 max-w-md leading-relaxed">
                                    As per KEA rules, fresh option entry is not allowed in {choiceSubmitted ? getRoundLabel(2, 'long') : getRoundLabel(currentRound, 'long')}. You can only re-order or delete your existing options using the panel on the right.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* --- RIGHT COLUMN: MODIFY SELECTED OPTIONS (45% Width) --- */}
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 w-full lg:w-[45%]">
                        
                        {/* Header banner matching target screenshot */}
                        <div className="p-4 bg-[#F0FDF4] border-b border-[#BBF7D0] flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
                                <FileSpreadsheet className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#0F172A] text-base leading-tight font-sans tracking-tight">Modify Selected Options</h3>
                                <p className="text-xs text-[#64748B] mt-0.5">Reorder or delete your saved preferences</p>
                            </div>
                        </div>

                        {/* Column Header Titles */}
                        <div className="bg-gradient-to-r from-[#EAF1F8] to-[#DDEAF5] border-b border-slate-200 flex text-[10px] font-bold text-slate-500 uppercase tracking-wider items-stretch select-none">
                            <div className="w-16 text-center py-2.5 border-r border-slate-200 leading-tight flex items-center justify-center shrink-0">Code</div>
                            <div className="w-14 text-center py-2.5 border-r border-slate-200 leading-tight flex items-center justify-center shrink-0">Option No</div>
                            <div className="flex-1 px-3 py-2.5 border-r border-slate-200 flex items-center">College</div>
                            <div className="flex-1 px-3 py-2.5 border-r border-slate-200 flex items-center">Course</div>
                            <div className="w-24 text-center py-2.5 flex items-center justify-center shrink-0">Fees</div>
                        </div>

                        {/* Scrollable list of priorities */}
                        <div className="flex-1 overflow-y-auto max-h-[620px] bg-white divide-y divide-slate-100">
                            {selectedOptions.length === 0 ? (
                                <div className="p-16 text-center text-xs text-slate-400 font-semibold italic flex flex-col items-center gap-3">
                                    <ListOrdered className="w-8 h-8 text-slate-200" />
                                    <span>No options selected yet.</span>
                                </div>
                            ) : (
                                <Reorder.Group
                                    axis="y"
                                    values={selectedOptions.map(opt => `${opt.collegeId}:::${opt.branchId}`)}
                                    onReorder={(newOrder: string[]) => {
                                        const newOptions = { ...options };
                                        newOrder.forEach((key, index) => {
                                            newOptions[key] = (index + 1).toString();
                                        });
                                    }}
                                    className="divide-y divide-slate-100"
                                >
                                    {selectedOptions.map((opt) => {
                                        const itemKey = `${opt.collegeId}:::${opt.branchId}`;
                                        return (
                                            <Reorder.Item
                                                key={itemKey}
                                                value={itemKey}
                                                className="flex items-stretch text-xs text-slate-800 bg-white hover:bg-slate-50/50 cursor-grab active:cursor-grabbing border-b border-slate-100 select-none group relative"
                                            >
                                                {/* Code Badge block */}
                                                <div className="w-16 text-center py-3 border-r border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center shrink-0">
                                                    <span className="bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE] font-bold text-[9px] px-1.5 py-0.5 rounded shadow-2xs">
                                                        {opt.collegeId}
                                                    </span>
                                                    <span className="bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] font-bold text-[9px] px-1.5 py-0.5 rounded shadow-2xs mt-1">
                                                        {opt.branchId}
                                                    </span>
                                                </div>

                                                {/* Priority Option No Input */}
                                                <div className="w-14 text-center py-3 border-r border-slate-100 bg-slate-50/30 flex items-center justify-center shrink-0">
                                                    <input
                                                        type="text"
                                                        value={draftOptions[`${opt.collegeId}:::${opt.branchId}`] ?? options[`${opt.collegeId}:::${opt.branchId}`] ?? ''}
                                                        onChange={(e) => handleDraftChange(opt.collegeId, opt.branchId, e.target.value)}
                                                        className="w-10 h-7 border border-slate-300 rounded-lg text-center text-xs font-bold bg-white focus:bg-[#FFFACD] outline-none shadow-sm"
                                                    />
                                                </div>

                                                {/* College details text */}
                                                <div className="flex-1 px-3 py-3 border-r border-slate-100 text-[11px] font-bold text-slate-700 leading-snug flex items-center">
                                                    {opt.collegeId} &ndash; {opt.collegeName}
                                                </div>

                                                {/* Course details text */}
                                                <div className="flex-1 px-3 py-3 border-r border-slate-100 text-[11px] font-semibold text-slate-600 leading-snug flex items-center uppercase">
                                                    {opt.branchId} &ndash; {opt.branchName}
                                                </div>

                                                {/* Fees block formatted */}
                                                <div className="w-24 text-center py-3 text-[9px] font-extrabold text-[#122744] flex items-center justify-center leading-normal px-2 shrink-0">
                                                    {formatRupeeWithWords(opt.fees)}
                                                </div>

                                            </Reorder.Item>
                                        );
                                    })}
                                </Reorder.Group>
                            )}
                        </div>

                        {/* Bottom Actions footer */}
                        <div className="bg-[#F8FAFC] border-t border-slate-200 p-5 text-center space-y-3.5 shadow-inner">
                            <p className="text-xs text-[#9A3412] font-bold flex items-center justify-center gap-1.5">
                                <span>⚠️ You can re-order or delete options. Enter 0 to delete options.</span>
                            </p>
                            
                            <div className="flex items-center justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleUpdateList}
                                    disabled={isSubmitting}
                                    className="bg-[#059669] hover:bg-[#047857] active:bg-[#065F46] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                                >
                                    <Check className="w-4 h-4 text-[#D99A29]" />
                                    <span>{isSubmitting ? 'Updating...' : 'Update Options'}</span>
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={handleDownloadReport}
                                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                                >
                                    <FileDown className="w-4 h-4 text-[#2563EB]" />
                                    <span>Download Option Report</span>
                                </button>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    );
}

'use client';

import React from 'react';
import {
    CalendarCheck,
    CreditCard,
    User,
    Mail,
    Trophy,
    Info,
    ArrowRight,
    Clock,
    Download
} from 'lucide-react';
import { LandingHeader, SubHeaderBanner } from '@/components/DashboardHeader';
import PageFooter from '@/components/PageFooter';
import CreditsPrivacyCard from '@/components/CreditsPrivacyCard';

interface LandingPageProps {
    onNavigate: (step: string) => void;
    onLogout: () => void;
    userProfile: any;
    mockAllotment: any;
    hasAgreedDeclaration: boolean;
    globalConfig: any;
    setGlobalConfig: (v: any) => void;
    setMockAllotment: (v: any) => void;
    selectedChoice: number | null;
    setSelectedChoice: (v: number | null) => void;
    choiceSubmitted: boolean;
    setChoiceSubmitted: (v: boolean) => void;
    setPreviousAllotment: (v: any) => void;
    setOptions: (v: any) => void;
    setUserProfile: (v: any) => void;
    handleDownloadReport?: () => void;
}

// Custom SVG Icons matching reference screenshots 100%
const OptionHeaderIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M8 8h.01" />
        <path d="M12 8h4" />
        <path d="M8 12h.01" />
        <path d="M12 12h4" />
        <path d="M8 16h.01" />
        <path d="M12 16h4" />
    </svg>
);

const LockFilledIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#94A3B8">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
);

const Grid4Icon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#64748B">
        <rect x="3" y="3" width="8" height="8" rx="2" />
        <rect x="13" y="3" width="8" height="8" rx="2" />
        <rect x="3" y="13" width="8" height="8" rx="2" />
        <rect x="13" y="13" width="8" height="8" rx="2" />
    </svg>
);

const DocumentSheetIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
    </svg>
);

const ReportPrinterIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#64748B">
        <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
    </svg>
);

const ChoiceSquareIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
    </svg>
);

export default function LandingPage({
    onNavigate,
    onLogout,
    userProfile,
    mockAllotment,
    hasAgreedDeclaration,
    globalConfig,
    setGlobalConfig,
    setMockAllotment,
    selectedChoice,
    setSelectedChoice,
    choiceSubmitted,
    setChoiceSubmitted,
    setPreviousAllotment,
    setOptions,
    setUserProfile,
    handleDownloadReport,
}: LandingPageProps) {

    // Only show the real Engineering rank from userProfile — never use fake multipliers
    const engineeringRank = userProfile?.rank ? parseInt(String(userProfile.rank).replace(/,/g, ''), 10) : null;
    const ranksList = engineeringRank && !isNaN(engineeringRank)
        ? [{ id: 1, group: 'Engineering', rank: engineeringRank.toString() }]
        : [];

    const handleOptionEntryClick = () => {
        if (choiceSubmitted && (selectedChoice === 1 || selectedChoice === 4)) {
            alert(selectedChoice === 1 ? "Option entry is locked because you have accepted your allotted seat (Choice 1)." : "Option entry is locked because you have quit the counseling process (Choice 4).");
            return;
        }
        if (hasAgreedDeclaration) {
            if (userProfile.kcetNumber && userProfile.studentName && userProfile.rank) {
                onNavigate('entry');
            } else {
                onNavigate('profile');
            }
        } else {
            onNavigate('declaration');
        }
    };

    return (
        <div className="min-h-screen bg-[#EBF3FA] flex flex-col font-sans select-none">
            {/* Top Main Navbar */}
            <LandingHeader
                step="landing"
                onNavigate={onNavigate}
                onLogout={onLogout}
                userProfile={userProfile}
            />

            {/* Navy Sub-header Banner */}
            <SubHeaderBanner userProfile={userProfile} />

            {/* Dashboard Content Container */}
            <div className="w-full max-w-[1400px] mx-auto p-4 md:p-6 flex-1">
                {/* 6 Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">

                    {/* ── Card 1: Option Entry (Connected to Simulator Entry Page) ── */}
                    {(() => {
                        const currentRound = globalConfig?.currentRound ?? 0;
                        const isOptionEntryOpen = currentRound <= 2; // Open for Mock (0), Round 1 (1), and Round 2 (2) as per official 2026 KEA flowchart rules!

                        const handleOptionClick = () => {
                            if (!isOptionEntryOpen) {
                                alert('Option Entry is closed after Round 2. Only Choice Entry for allotted seats is permitted in subsequent rounds.');
                                return;
                            }
                            onNavigate('entry');
                        };

                        return (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                
                                {/* Soft Light Blue Header */}
                                <div className="p-4 bg-[#EAF2FF] flex items-center gap-3.5 border-b border-[#BFDBFE]">
                                    <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-sm shrink-0">
                                        <OptionHeaderIcon />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0F172A] text-[17px] leading-tight font-sans tracking-tight">Option Entry</h3>
                                        <p className="text-[13px] text-[#64748B] mt-0.5 font-sans">Select preferred colleges &amp; courses</p>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex-1 flex flex-col gap-4">
                                    
                                    {/* Inner Box: Candidates Option Entry */}
                                    <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-center justify-between gap-3 shadow-2xs">
                                        <div className="flex items-center gap-3.5">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isOptionEntryOpen ? 'bg-[#EFF6FF] border border-[#BFDBFE]' : 'bg-[#E2E8F0]'}`}>
                                                {isOptionEntryOpen ? <OptionHeaderIcon /> : <LockFilledIcon />}
                                            </div>
                                            <div>
                                                <button
                                                    onClick={handleOptionClick}
                                                    className="font-bold text-[15px] text-[#334155] hover:text-blue-600 text-left block leading-tight font-sans"
                                                >
                                                    Candidates Option Entry
                                                </button>
                                                <p className={`text-[13px] font-medium mt-1 font-sans ${isOptionEntryOpen ? 'text-[#2563EB]' : 'text-[#94A3B8]'}`}>
                                                    {isOptionEntryOpen ? 'Option Entry is OPEN — select & re-order choices' : 'Deadline has passed — option entry is closed'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                            {isOptionEntryOpen ? (
                                                <>
                                                    <button
                                                        onClick={handleOptionClick}
                                                        className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs px-4 py-1.5 rounded-full shadow-sm transition-all"
                                                    >
                                                        Modify Options
                                                    </button>
                                                    <span className="bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider font-sans">
                                                        ● OPEN
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="bg-white text-[#94A3B8] border border-[#CBD5E1] text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shrink-0 font-sans">
                                                    CLOSED
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status Bar */}
                                    {isOptionEntryOpen ? (
                                        <div className="bg-[#F0FDF4] border border-[#BBF7D0] px-4 py-2.5 rounded-xl text-[13px] font-semibold text-[#15803D] flex items-center gap-2.5 font-sans">
                                            <Clock className="w-4 h-4 text-[#16A34A] shrink-0" />
                                            <span>Option Entry is OPEN for 2026 Counseling</span>
                                        </div>
                                    ) : (
                                        <div className="bg-[#F0F4F8] border border-[#E2E8F0] px-4 py-2.5 rounded-xl text-[13px] font-medium text-[#64748B] flex items-center gap-2.5 font-sans">
                                            <Clock className="w-4 h-4 text-[#64748B] shrink-0" />
                                            <span>Closed on 09/07/2026 11:40:00 AM</span>
                                        </div>
                                    )}

                                    {/* RESOURCES Section Divider */}
                                    <div className="pt-1">
                                        <div className="relative flex py-2 items-center">
                                            <div className="flex-grow border-t border-[#E2E8F0]"></div>
                                            <span className="flex-shrink mx-4 text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest font-sans">
                                                RESOURCES
                                            </span>
                                            <div className="flex-grow border-t border-[#E2E8F0]"></div>
                                        </div>

                                        {/* Resources List */}
                                        <div className="space-y-3.5 mt-2.5 text-[14px] font-medium text-[#475569]">
                                            <button
                                                onClick={handleOptionClick}
                                                className="flex items-center gap-3.5 hover:text-blue-600 transition-colors w-full text-left font-sans"
                                            >
                                                <Grid4Icon />
                                                <span>Option Entry Example / Demo</span>
                                            </button>

                                            <button
                                                onClick={handleOptionClick}
                                                className="flex items-center gap-3.5 hover:text-blue-600 transition-colors w-full text-left font-sans"
                                            >
                                                <DocumentSheetIcon />
                                                <span>Detailed Option Work Sheet</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    if (handleDownloadReport) handleDownloadReport();
                                                    else alert('Please add choices in Option Entry before downloading report.');
                                                }}
                                                className="flex items-center gap-3.5 hover:text-blue-600 transition-colors w-full text-left font-sans"
                                            >
                                                <ReportPrinterIcon />
                                                <span>Download Option Entry Report</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* ── Card 2: Allotment Result (Connected to Simulator Allotment State) ── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                        {/* Soft Light Green Header */}
                        <div className="p-4 bg-[#E8F8EE] flex items-center gap-3.5 border-b border-[#A7F3D0]">
                            <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center shadow-sm shrink-0">
                                <CalendarCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#0F172A] text-[17px] leading-tight font-sans tracking-tight">Allotment Result</h3>
                                <p className="text-[13px] text-[#64748B] mt-0.5 font-sans">Your seat allotment information</p>
                            </div>
                        </div>

                        {/* Card Body Table */}
                        <div className="p-5 flex-1 flex flex-col justify-start">
                            {mockAllotment ? (
                                <div className="w-full divide-y divide-slate-100 text-xs font-sans">
                                    <div className="py-3.5 flex gap-4 items-start">
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider w-24 shrink-0 pt-0.5">COLLEGE</span>
                                        <span className="font-bold text-slate-800 uppercase leading-relaxed text-[13px]">
                                            {mockAllotment.collegeCode ? `${mockAllotment.collegeCode}–${mockAllotment.collegeName}` : mockAllotment.collegeName}
                                        </span>
                                    </div>
                                    <div className="py-3.5 flex gap-4 items-center">
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider w-24 shrink-0">COURSE</span>
                                        <span className="font-bold text-slate-800 uppercase text-[13px]">
                                            {mockAllotment.branchCode ? `${mockAllotment.branchCode}–${mockAllotment.branchName}` : mockAllotment.branchName}
                                        </span>
                                    </div>
                                    <div className="py-3.5 flex gap-4 items-center">
                                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider w-24 shrink-0">COURSE FEES</span>
                                        <span className="font-bold text-slate-800 text-[13px]">
                                            {mockAllotment.fees || mockAllotment.fee || '120320'}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                        <CalendarCheck className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-600 text-sm">No Allotment Yet</p>
                                        <p className="text-xs text-slate-400 mt-1">Run the simulator to see your allotment result here.</p>
                                    </div>
                                    <button
                                        onClick={() => onNavigate('allotment_auth')}
                                        className="mt-1 text-xs font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2"
                                    >
                                        Check Allotment →
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Advance Round Button (Simulator Feature) */}
                        {globalConfig?.currentRound === 0 && mockAllotment && (
                            <div className="p-4 bg-white border-t border-slate-200">
                                <button
                                    onClick={() => {
                                        const confirmed = window.confirm("Advance to Round 1 Allotment Phase?\nThis will clear your Mock Allotment so you can run the Round 1 simulator.");
                                        if (!confirmed) return;
                                        
                                        if (setMockAllotment) setMockAllotment(null);
                                        if (setSelectedChoice) setSelectedChoice(null);
                                        if (setChoiceSubmitted) setChoiceSubmitted(false);
                                        if (setPreviousAllotment) setPreviousAllotment(null);
                                        const keysToRemove = [];
                                        for (let i = 0; i < localStorage.length; i++) {
                                            const key = localStorage.key(i);
                                            if (key && ['sim_mock_allotment', 'sim_selected_choice', 'sim_choice_submitted', 'sim_previous_allotment'].includes(key)) {
                                                keysToRemove.push(key);
                                            }
                                        }
                                        keysToRemove.forEach(key => localStorage.removeItem(key));
                                        if (setGlobalConfig) setGlobalConfig({ ...globalConfig, currentRound: 1 });
                                        alert("Advanced to First Round.");
                                    }}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded shadow-sm transition-colors text-sm"
                                >
                                    Proceed to First Round Simulation →
                                </button>
                            </div>
                        )}
                        {globalConfig?.currentRound > 0 && choiceSubmitted && globalConfig?.currentRound < 3 && (
                            <div className="p-4 bg-white border-t border-slate-200">
                                <button
                                    onClick={() => {
                                        if (selectedChoice === 1 || selectedChoice === 4) {
                                            const really = window.confirm(`You selected Choice ${selectedChoice}, which means you exit counseling in real life. Advancing the round in the simulator will reset this. Continue?`);
                                            if (!really) return;
                                        } else {
                                            const confirmed = window.confirm(`Advance to Round ${globalConfig.currentRound + 1} Allotment Phase?`);
                                            if (!confirmed) return;
                                        }
                                        
                                        if (setMockAllotment) setMockAllotment(null);
                                        if (setSelectedChoice) setSelectedChoice(null);
                                        if (setChoiceSubmitted) setChoiceSubmitted(false);
                                        // We retain previousAllotment if they selected Choice 2, which is handled during choice submission.
                                        
                                        const keysToRemove = [];
                                        for (let i = 0; i < localStorage.length; i++) {
                                            const key = localStorage.key(i);
                                            if (key && ['sim_mock_allotment', 'sim_selected_choice', 'sim_choice_submitted'].includes(key)) {
                                                keysToRemove.push(key);
                                            }
                                        }
                                        keysToRemove.forEach(key => localStorage.removeItem(key));
                                        if (setGlobalConfig) setGlobalConfig({ ...globalConfig, currentRound: globalConfig.currentRound + 1 });
                                        alert(`Advanced to Round ${globalConfig.currentRound + 1}.`);
                                    }}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded shadow-sm transition-colors text-sm"
                                >
                                    Proceed to Next Round Simulation →
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Card 3: Payments (Connected to Payment Flow) ── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                        {/* Soft Light Red Header */}
                        <div className="p-4 bg-[#FFECEC] flex items-center gap-3.5 border-b border-[#FECDD3]">
                            <div className="w-10 h-10 rounded-xl bg-[#EF4444] text-white flex items-center justify-center shadow-sm shrink-0">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#0F172A] text-[17px] leading-tight font-sans tracking-tight">Payments</h3>
                                <p className="text-[13px] text-[#64748B] mt-0.5 font-sans">Payment summary &amp; actions</p>
                            </div>
                        </div>

                        {/* Card Body Table */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                {/* Table Header Bar */}
                                <div className="bg-[#EBF3FA] px-4 py-2.5 grid grid-cols-12 text-[10px] font-bold text-[#475569] uppercase tracking-wider border-b border-slate-200">
                                    <div className="col-span-5">FEE TYPE</div>
                                    <div className="col-span-2 text-right">TOTAL</div>
                                    <div className="col-span-2 text-right">PAID</div>
                                    <div className="col-span-2 text-right">BALANCE</div>
                                    <div className="col-span-1 text-center">ACTIONS</div>
                                </div>

                                {/* Table Body Rows — driven by real allotment data */}
                                <div className="divide-y divide-slate-100 text-[13px] font-bold text-[#1E293B]">
                                    {mockAllotment ? (
                                        <>
                                            {/* Row 1: Option Entry Fee — always ₹750, already paid */}
                                            <div className="px-4 py-3 grid grid-cols-12 items-center">
                                                <div className="col-span-5 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-[#16A34A] shrink-0" />
                                                    <span>Option Entry Fee</span>
                                                </div>
                                                <div className="col-span-2 text-right font-bold text-slate-800">₹750</div>
                                                <div className="col-span-2 text-right text-[#16A34A] font-bold">₹750</div>
                                                <div className="col-span-2 text-right text-[#16A34A] font-bold">₹0</div>
                                                <div className="col-span-1 text-center text-slate-400 font-normal">&mdash;</div>
                                            </div>

                                            {/* Row 2: Admission Fee — from real allotment data */}
                                            <div className="px-4 py-3 grid grid-cols-12 items-center">
                                                <div className="col-span-5 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0" />
                                                    <span>Admission Fee</span>
                                                </div>
                                                <div className="col-span-2 text-right font-bold text-slate-800">
                                                    {mockAllotment.fees ? `₹${Number(mockAllotment.fees).toLocaleString('en-IN')}` : 'N/A'}
                                                </div>
                                                <div className="col-span-2 text-right text-[#16A34A] font-bold">₹0</div>
                                                <div className="col-span-2 text-right text-[#DC2626] font-bold">
                                                    {mockAllotment.fees ? `₹${Number(mockAllotment.fees).toLocaleString('en-IN')}` : 'N/A'}
                                                </div>
                                                <div className="col-span-1 text-center text-slate-400 font-normal">&mdash;</div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="px-4 py-8 flex flex-col items-center justify-center text-center gap-2">
                                            <CreditCard className="w-7 h-7 text-slate-300" />
                                            <p className="text-sm font-semibold text-slate-500">No fees due yet</p>
                                            <p className="text-xs text-slate-400">Fee details appear after allotment.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Light Blue Banner Link */}
                            <button
                                onClick={() => onNavigate('payment')}
                                className="bg-[#EAF2FF] border-t border-[#BFDBFE] px-4 py-3 text-[13px] font-medium text-[#334155] hover:text-blue-600 transition-colors flex items-center gap-2.5 w-full text-left"
                            >
                                <CreditCard className="w-4 h-4 text-[#64748B] shrink-0" />
                                <span className="flex-1 truncate font-sans">Click here to view all payment details and check payment status.</span>
                                <ArrowRight className="w-4 h-4 text-[#64748B] shrink-0" />
                            </button>
                        </div>
                    </div>

                    {/* ── Card 4: Account Details ── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                        {/* Soft Light Purple Header */}
                        <div className="p-4 bg-[#F5EEFE] flex items-center gap-3.5 border-b border-[#E9D5FF]">
                            <div className="w-10 h-10 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center shadow-sm shrink-0">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#0F172A] text-[17px] leading-tight font-sans tracking-tight">Account Details</h3>
                                <p className="text-[13px] text-[#64748B] mt-0.5 font-sans">Links and account actions</p>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 flex-1 flex flex-col justify-start space-y-4">
                            <button
                                onClick={() => alert(`Last Login: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()} (Active Session)`)}
                                className="flex items-center gap-3 text-[14px] font-medium text-[#475569] hover:text-blue-600 transition-colors text-left font-sans"
                            >
                                <Clock className="w-4 h-4 text-[#64748B] shrink-0" />
                                <span>View Login History</span>
                            </button>

                            <button
                                onClick={() => {
                                    if (handleDownloadReport) handleDownloadReport();
                                    else alert('Option Entry Verification Slip available after option entry submission.');
                                }}
                                className="flex items-center gap-3 text-[14px] font-medium text-[#475569] hover:text-blue-600 transition-colors text-left font-sans"
                            >
                                <Download className="w-4 h-4 text-[#64748B] shrink-0" />
                                <span>View Downloaded Pdf History</span>
                            </button>
                        </div>
                    </div>

                    {/* ── Card 5: Admission (Connected to Choice Entry Navigation & PDF Export) ── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                        {/* Soft Light Blue Header + ACTIVE Badge */}
                        <div className="p-4 bg-[#EAF2FF] flex items-center justify-between border-b border-[#BFDBFE]">
                            <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-[#1E3B66] text-white flex items-center justify-center shadow-sm shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#0F172A] text-[17px] leading-tight font-sans tracking-tight">Admission</h3>
                                    <p className="text-[13px] text-[#64748B] mt-0.5 font-sans">Post-allotment actions</p>
                                </div>
                            </div>

                            {/* ACTIVE Badge */}
                            <span className="bg-[#DBEAFE] text-[#1E40AF] font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                                ACTIVE
                            </span>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 flex-1 flex flex-col justify-start">
                            <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex items-center justify-between gap-3 shadow-2xs">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                                        <ChoiceSquareIcon />
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => onNavigate('choice_entry')}
                                            className="font-bold text-[15px] text-[#334155] hover:text-blue-600 text-left block leading-tight font-sans"
                                        >
                                            Choice Entry
                                        </button>
                                        <p className="text-[12px] text-[#94A3B8] font-normal mt-0.5 font-sans">
                                            Exercise your college preferences
                                        </p>
                                        <p className="text-[11px] font-semibold text-[#D97706] flex items-center gap-1 mt-1 font-sans">
                                            <Clock className="w-3 h-3 text-[#D97706] inline shrink-0" />
                                            <span>Last date: 28/07/2026 11:59:00 PM</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Connected Action Buttons */}
                                <div className="flex flex-col gap-2 shrink-0">
                                    <button
                                        onClick={() => onNavigate('choice_entry')}
                                        className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs px-4 py-1.5 rounded-full shadow-sm transition-all"
                                    >
                                        Enter Choice
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (handleDownloadReport) handleDownloadReport();
                                            else alert('Download your Choice Entry PDF from Option Entry page!');
                                        }}
                                        className="bg-white border border-[#CBD5E1] text-[#334155] hover:bg-slate-50 font-bold text-xs px-4 py-1.5 rounded-full transition-all"
                                    >
                                        Download PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Card 6: My Ranks (Dynamically Connected to User Profile Rank) ── */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                        {/* Soft Light Yellow Header */}
                        <div className="p-4 bg-[#FFFBEB] flex items-center gap-3.5 border-b border-[#FDE68A]">
                            <div className="w-10 h-10 rounded-xl bg-[#D97706] text-white flex items-center justify-center shadow-sm shrink-0">
                                <Trophy className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#0F172A] text-[17px] leading-tight font-sans tracking-tight">My Ranks</h3>
                                <p className="text-[13px] text-[#64748B] mt-0.5 font-sans">{ranksList.length > 0 ? `${ranksList.length} rank${ranksList.length > 1 ? 's' : ''} available` : 'Enter rank in profile'}</p>
                            </div>
                        </div>

                        {/* Card Body Table */}
                        <div className="flex-1 flex flex-col">
                            {/* Table Header Bar */}
                            <div className="bg-[#FFFBEB] px-4 py-2 grid grid-cols-12 text-[10px] font-bold text-[#92400E] uppercase tracking-wider border-b border-[#FDE68A]">
                                <div className="col-span-1">#</div>
                                <div className="col-span-7">COURSE GROUP</div>
                                <div className="col-span-4 text-right">RANK</div>
                            </div>

                            {/* Table Rows — only real data from userProfile */}
                            <div className="divide-y divide-slate-100 text-[13px] font-medium text-[#334155]">
                                {ranksList.length > 0 ? ranksList.map(r => (
                                    <div key={r.id} className="px-4 py-3 grid grid-cols-12 items-center hover:bg-slate-50/50">
                                        <div className="col-span-1 text-[#94A3B8] font-bold">{r.id}</div>
                                        <div className="col-span-7 font-semibold text-[#334155] leading-snug">{r.group}</div>
                                        <div className="col-span-4 text-right">
                                            <span className="bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] font-mono font-bold text-xs px-2.5 py-1 rounded-md inline-block">
                                                {r.rank}
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="px-4 py-8 flex flex-col items-center justify-center text-center gap-2">
                                        <Trophy className="w-7 h-7 text-amber-200" />
                                        <p className="text-sm font-semibold text-slate-500">No rank data yet</p>
                                        <p className="text-xs text-slate-400">Enter your rank in your profile to see it here.</p>
                                        <button
                                            onClick={() => onNavigate('profile')}
                                            className="mt-1 text-xs font-bold text-amber-700 hover:text-amber-800 underline underline-offset-2"
                                        >
                                            Update Profile →
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PageFooter onNavigate={onNavigate} />
        </div>
    );
}

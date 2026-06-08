'use client';

import React, { useState } from 'react';
import { ChevronDown, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Logos ---
const CAPLogo = () => (
    <div className="flex flex-col shrink-0">
        <div className="flex items-end relative -mb-0.5">
            <div className="text-[#CE1126] font-sans font-bold text-[32px] md:text-[38px] tracking-tighter leading-none">CA</div>
            <div className="relative">
                <div className="absolute -top-[14px] -left-[10px] md:-top-[16px] md:-left-[12px] text-[#111] z-10 transform -rotate-[12deg]">
                    <GraduationCap size={30} className="md:w-8 md:h-8 w-[26px] h-[26px]" fill="currentColor" strokeWidth={0.5} />
                </div>
                <div className="text-[#CE1126] font-sans font-bold text-[32px] md:text-[38px] tracking-tighter leading-none relative z-0">P</div>
            </div>
            <div className="text-[#111] font-sans font-medium text-[10px] md:text-[12px] uppercase mb-[4px] ml-1 leading-none tracking-tight">NIC</div>
        </div>
        <div className="text-gray-600 font-sans text-[7px] md:text-[8px] leading-[1.1] font-medium max-w-[140px] tracking-tight">
            Centralised Seat Allotment Process<br />for Professional Degree Courses
        </div>
    </div>
);

const RanksDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    const streams = [
        "Medical", "Dental", "Ayush", "Yoga & Naturopathy", "Architecture",
        "Engineering", "Agri(Bsc)(Theory)", "Agriculture(Pract.)", "Food Sci(Pract.)",
        "Food Sci(Theory)", "Nursing", "Veter Sci(Theory)", "Veter Sci(Pract.)",
        "Sericulture(Theory)", "Sericulture(Pract.)", "D-Pharma", "B-Pharma"
    ];

    return (
        <div className="relative inline-block mt-1 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 border-[1px] border-[#0066cc] px-3 py-1 rounded-[3px] text-[13px] font-medium bg-white text-[#0066cc] hover:bg-gray-50"
            >
                Ranks ∇
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-400 shadow-2xl w-[250px]">
                    <div className="flex bg-white text-[10px] font-bold border-b border-gray-300 px-3 py-1">
                        <div className="flex-1">Stream</div>
                        <div className="w-16 text-center">Rank</div>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto">
                        {streams.map((stream, idx) => (
                            <div
                                key={idx}
                                className="flex text-[10px] text-black font-medium border-b border-gray-100 last:border-0 px-3 py-1 hover:bg-gray-50"
                            >
                                <div className="flex-1">{stream}</div>
                                <div className="w-16 text-center">
                                    {stream === 'Engineering' ? '12500' : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Variant: Landing page header (nav buttons: Home, Courses, Colleges, Log Out) ---
interface LandingHeaderProps {
    onNavigate: (step: string) => void;
    onLogout: () => void;
    userProfile?: any;
}

export function LandingHeader({ onNavigate, onLogout, userProfile }: LandingHeaderProps) {
    return (
        <div className="border-b-[2px] border-gray-300 py-3 px-4 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Left: CAP Logo & User Details */}
            <div className="flex items-center gap-4 shrink-0 mt-1">
                <CAPLogo />
                {userProfile && userProfile.studentName && (
                    <div className="flex flex-col text-[#222] font-sans ml-2">
                        <span className="text-[14px]">Welcome {userProfile.studentName}</span>
                        <span className="text-[14px]">CET NO: {userProfile.kcetNumber} Claimed : Karnataka,</span>
                    </div>
                )}
            </div>

            {/* Center: Title & Ranks */}
            <div className="flex flex-col items-center flex-1 pt-1 gap-1">
                <h1
                    className="text-[#CE3B4B] text-[16px] md:text-[18px] lg:text-[20px] font-medium tracking-wide uppercase text-center"
                    style={{ lineHeight: '1.3' }}
                >
                    ADMISSION TO UGCET &amp; OTHER<br />PROFESSIONAL COURSES- 2026
                </h1>
                <RanksDropdown />
            </div>

            {/* Right: Nav Buttons */}
            <div className="flex items-center gap-[4px] shrink-0 mt-2 md:mt-0">
                <button
                    onClick={() => onNavigate('landing')}
                    className="px-[10px] py-[2px] text-[11px] font-bold border border-[#7A7A7A] rounded-[3px] bg-white text-[#000080] hover:bg-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                >
                    Home
                </button>
                <button
                    onClick={() => onNavigate('courses')}
                    className="px-[10px] py-[2px] text-[11px] font-bold border border-[#7A7A7A] rounded-[3px] bg-white text-[#000080] hover:bg-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                >
                    Courses
                </button>
                <button
                    onClick={() => onNavigate('colleges')}
                    className="px-[10px] py-[2px] text-[11px] font-bold border border-[#7A7A7A] rounded-[3px] bg-white text-[#000080] hover:bg-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                >
                    Colleges
                </button>
                <button
                    onClick={onLogout}
                    className="px-[10px] py-[2px] text-[11px] font-bold border border-[#7A7A7A] rounded-[3px] bg-white text-[#000080] hover:bg-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
}

// --- Variant: Entry/Courses/Colleges header (active-state nav buttons) ---
interface MainHeaderProps {
    step: string;
    onNavigate: (step: string) => void;
    onLogout: () => void;
    userProfile?: any;
}

export function MainHeader({ step, onNavigate, onLogout, userProfile }: MainHeaderProps) {
    return (
        <header className="border-b border-gray-200 bg-[#F8F9FA] px-4 md:px-10 py-4">
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left: CAP Logo & User Details */}
                <div className="flex items-center gap-4 shrink-0">
                    <CAPLogo />
                    {userProfile && userProfile.studentName && (
                        <div className="flex flex-col text-[#222] font-sans ml-2">
                            <span className="text-[14px]">Welcome {userProfile.studentName}</span>
                            <span className="text-[14px]">CET NO: {userProfile.kcetNumber} Claimed : Karnataka,</span>
                        </div>
                    )}
                </div>

                {/* Middle: Title */}
                <div className="text-center flex-1">
                    <h1
                        className="text-[#CE3B4B] text-[16px] md:text-[18px] lg:text-[20px] font-medium tracking-wide uppercase text-center"
                        style={{ lineHeight: '1.3' }}
                    >
                        ADMISSION TO UGCET &amp; OTHER<br />PROFESSIONAL COURSES- 2026
                    </h1>
                </div>

                {/* Right: Nav Buttons */}
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-[4px] shrink-0 mt-2 md:mt-0">
                        <button
                            onClick={() => onNavigate('landing')}
                            className="px-[10px] py-[2px] text-[11px] font-bold border border-[#7A7A7A] rounded-[3px] bg-white text-[#000080] hover:bg-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                        >
                            Home
                        </button>
                        <button
                            onClick={() => onNavigate('courses')}
                            className={cn(
                                "px-[10px] py-[2px] text-[11px] font-bold border border-[#7A7A7A] rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors",
                                step === 'courses'
                                    ? "bg-[#000080] text-white"
                                    : "bg-white text-[#000080] hover:bg-gray-50"
                            )}
                        >
                            Courses
                        </button>
                        <button
                            onClick={() => onNavigate('colleges')}
                            className={cn(
                                "px-[10px] py-[2px] text-[11px] font-bold border border-[#7A7A7A] rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors",
                                step === 'colleges'
                                    ? "bg-[#000080] text-white"
                                    : "bg-white text-[#000080] hover:bg-gray-50"
                            )}
                        >
                            Colleges
                        </button>
                        <button
                            onClick={onLogout}
                            className="px-[10px] py-[2px] text-[11px] font-bold border border-[#7A7A7A] rounded-[3px] bg-white text-[#000080] hover:bg-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                        >
                            Log Out
                        </button>
                    </div>
                    <RanksDropdown />
                </div>
            </div>
        </header>
    );
}

// --- Variant: Simple centered header (login page, allotment auth) ---
interface SimplePageHeaderProps {
    /** Border colour, defaults to maroon (#800000) */
    accentColor?: string;
}

export function SimplePageHeader({ accentColor = '#800000' }: SimplePageHeaderProps) {
    return (
        <div
            className="border-b-[3px] p-4 flex items-center justify-center relative"
            style={{ borderColor: accentColor }}
        >
            <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 flex flex-col items-center">
                <CAPLogo />
            </div>
            <h1
                className="text-lg md:text-xl font-bold uppercase tracking-wide text-center max-w-[70%]"
                style={{ color: accentColor }}
            >
                ADMISSION TO UGCET &amp; OTHER PROFESSIONAL COURSES- 2026
            </h1>
        </div>
    );
}
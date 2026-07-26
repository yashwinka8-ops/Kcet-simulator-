'use client';

import React, { useState, useEffect } from 'react';
import {
    Home,
    BookOpen,
    Building2,
    LogOut,
    Bookmark,
    Phone,
    Mail,
    AlertTriangle,
    Trophy,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- KEA Logo Component (White box with Magenta K E A text matching real KEA portal) ---
export const KEALogo = () => (
    <div className="flex items-center gap-4 shrink-0 select-none">
        {/* Exact KEA Logo Custom SVG */}
        <div className="w-[48px] h-[48px] bg-white flex items-end justify-center overflow-hidden shrink-0 p-1">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-[#A54582] font-sans font-black">
                {/* Podiums (No gaps) */}
                <rect x="0" y="55" width="34" height="45" />
                <rect x="33" y="35" width="34" height="65" />
                <rect x="66" y="65" width="34" height="35" />
                {/* Letters */}
                <text x="17" y="50" textAnchor="middle" fontSize="38" letterSpacing="-1">K</text>
                <text x="50" y="30" textAnchor="middle" fontSize="38" letterSpacing="-1">E</text>
                <text x="83" y="60" textAnchor="middle" fontSize="38" letterSpacing="-1">A</text>
            </svg>
        </div>

        {/* Vertical divider */}
        <div className="w-[2px] h-9 bg-[#D99A29] opacity-90 mx-1" />

        {/* Header Text */}
        <div className="flex flex-col text-white pt-1">
            <span className="font-extrabold text-[13px] md:text-[15px] leading-tight tracking-wide">
                ADMISSION TO UGCET &amp; OTHER PROFESSIONAL COURSES- 2026
            </span>
            <span className="text-[9px] md:text-[11px] text-[#A2B1C6] font-medium tracking-wide">
                CENTRALISED ALLOTMENT PROCESS
            </span>
        </div>
    </div>
);

// --- Simple Header for Auth / Standalone Pages ---
interface SimplePageHeaderProps {
    accentColor?: string;
}

export function SimplePageHeader({ accentColor = '#1B365D' }: SimplePageHeaderProps) {
    return (
        <div className="bg-[#1B365D] border-b-4 border-[#D99A29] py-3.5 px-6 md:px-10 flex items-center justify-between shadow-md">
            <KEALogo />
        </div>
    );
}

// --- Main Header with Navigation (100% Screenshot Matching Top Header) ---
interface MainHeaderProps {
    step: string;
    onNavigate: (step: string) => void;
    onLogout: () => void;
    userProfile?: any;
}

export function MainHeader({ step, onNavigate, onLogout, userProfile }: MainHeaderProps) {
    const studentName = userProfile?.studentName || 'STUDENT';
    const cetNo = userProfile?.kcetNumber || 'CET NO';
    const initials = studentName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'ST';

    return (
        <header className="bg-[#1B365D] text-white shadow-md select-none border-b-4 border-[#D99A29]">
            <div className="w-full px-4 md:px-10 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
                {/* Left side: KEA Logo & Title */}
                <KEALogo />

                {/* Right side: User Badge & Nav Buttons - 100% Match with Screenshot */}
                <div className="flex flex-wrap items-center gap-3 md:gap-5 shrink-0">
                    
                    {/* User profile pill: 2-line stacked text + Yellow Circle Badge */}
                    <button 
                        onClick={() => onNavigate('profile')}
                        className="flex items-center gap-3 bg-[#1E3B66]/60 border border-[#3B629B]/60 hover:bg-[#1E3B66] hover:border-[#D99A29]/50 transition-colors rounded-full pl-1.5 pr-5 py-1 shadow-sm cursor-pointer text-left"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#D99A29] text-[#1E293B] font-extrabold flex items-center justify-center text-xs shrink-0 shadow-inner">
                            {initials}
                        </div>
                        <div className="flex flex-col text-left leading-tight">
                            <span className="font-extrabold text-white text-[13px] tracking-wide">{studentName}</span>
                            <span className="text-[11px] font-medium text-[#8EA6C9]">CET: {cetNo}</span>
                        </div>
                    </button>

                    {/* Home Button: Dark pill with yellow border & yellow text/icon */}
                    <button
                        onClick={() => onNavigate('landing')}
                        className="flex items-center gap-2 bg-[#2E4B75]/70 border border-[#D99A29] rounded-full px-4 py-1.5 text-[13px] font-bold text-[#D99A29] shadow-sm hover:bg-[#2E4B75] transition-all"
                    >
                        <Home className="w-4 h-4 fill-[#D99A29] text-[#D99A29]" />
                        <span>Home</span>
                    </button>

                    {/* Option Entry Button: Yellow text + list icon */}
                    <button
                        onClick={() => onNavigate('entry')}
                        className="flex items-center gap-1.5 text-[14px] font-bold text-[#D99A29] hover:text-amber-300 transition-colors px-1"
                    >
                        <BookOpen className="w-4 h-4 text-[#D99A29]" />
                        <span>Option Entry</span>
                    </button>

                    {/* Courses Button: Inline icon + white text */}
                    <button
                        onClick={() => onNavigate('courses')}
                        className="flex items-center gap-2 text-[14px] font-bold text-white hover:text-slate-200 transition-colors px-1"
                    >
                        <BookOpen className="w-4 h-4 text-white" />
                        <span>Courses</span>
                    </button>

                    {/* Colleges Button: Inline icon + white text */}
                    <button
                        onClick={() => onNavigate('colleges')}
                        className="flex items-center gap-2 text-[14px] font-bold text-white hover:text-slate-200 transition-colors px-1"
                    >
                        <Building2 className="w-4 h-4 text-white" />
                        <span>Colleges</span>
                    </button>

                    {/* Log Out Button: White rounded pill with soft pink/red text & icon */}
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 bg-[#F1F5F9] hover:bg-white rounded-full px-5 py-1.5 text-[14px] font-bold text-[#F87171] shadow-sm transition-all"
                    >
                        <LogOut className="w-4 h-4 text-[#F87171]" />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>
        </header>
    );
}

// --- Landing / Dashboard Sub-header Banner ---
interface SubHeaderProps {
    userProfile?: any;
}

export function SubHeaderBanner({ userProfile }: SubHeaderProps) {
    const category = userProfile?.category || '3A';
    const mobileMasked = 'XXXXXXXXXX';
    const emailMasked = 'x***@g***.com';

    // Live session timer countdown
    const [timeLeft, setTimeLeft] = useState(1551); // 25:51 default

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

    return (
        <div className="bg-[#122744] border-b border-slate-700/80 text-white px-4 md:px-8 py-2.5 shadow-inner">
            <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Left: Page Title & Breadcrumb + Badges */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col justify-center">
                        <h2 className="text-base font-bold tracking-tight text-white leading-none">Dashboard</h2>
                        <span className="text-[10px] text-slate-400 font-medium">Home</span>
                    </div>

                    <div className="hidden sm:block h-6 w-px bg-slate-600/60 mx-1" />

                    {/* Metadata Badges matching screenshot */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                        <div className="flex items-center gap-1.5 bg-[#0F2038] border border-slate-700/80 px-2.5 py-1 rounded-md text-slate-200">
                            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                            <span>Category: {category}</span>
                        </div>

                        <div className="flex items-center gap-1.5 bg-[#0F2038] border border-slate-700/80 px-2.5 py-1 rounded-md text-slate-200">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{mobileMasked}</span>
                        </div>

                        <div className="flex items-center gap-1.5 bg-[#0F2038] border border-slate-700/80 px-2.5 py-1 rounded-md text-slate-200">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{emailMasked}</span>
                        </div>

                        <div className="flex items-center gap-1.5 bg-[#7F1D1D] border border-red-800 text-white px-2.5 py-1 rounded-md font-semibold text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5 text-white" />
                            <span>Payment Pending</span>
                        </div>

                        <div className="flex items-center gap-1.5 bg-[#0F2038] border border-slate-700/80 px-2.5 py-1 rounded-md text-slate-200">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            <span>12 Ranks</span>
                        </div>
                    </div>
                </div>

                {/* Right: Session Timer matching screenshot */}
                <div className="flex items-center gap-2.5 bg-[#0F2038] border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs self-start lg:self-center shrink-0">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div className="flex flex-col text-right">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">SESSION EXPIRES IN:</span>
                        <span className="font-mono font-extrabold text-white text-base leading-none tracking-wider">{formatTimer(timeLeft)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
            </div>
        </div>
    );
}

export const LandingHeader = MainHeader;
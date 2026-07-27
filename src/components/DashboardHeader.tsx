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

import Image from 'next/image';

// --- Simple Header for Auth / Standalone Pages ---
interface SimplePageHeaderProps {
    accentColor?: string;
}

export function SimplePageHeader({ accentColor = '#1B365D' }: SimplePageHeaderProps) {
    return (
        <div className="bg-[#1B365D] border-b-4 border-[#D99A29] py-3.5 px-6 md:px-10 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-4 shrink-0 select-none">
                <div className="w-[48px] h-[48px] bg-white flex items-end justify-center overflow-hidden shrink-0 p-1">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-[#A54582] font-sans font-black">
                        <rect x="0" y="55" width="34" height="45" />
                        <rect x="33" y="35" width="34" height="65" />
                        <rect x="66" y="65" width="34" height="35" />
                        <text x="17" y="50" textAnchor="middle" fontSize="38" letterSpacing="-1">K</text>
                        <text x="50" y="30" textAnchor="middle" fontSize="38" letterSpacing="-1">E</text>
                        <text x="83" y="60" textAnchor="middle" fontSize="38" letterSpacing="-1">A</text>
                    </svg>
                </div>
                <div className="w-[2px] h-9 bg-[#D99A29] opacity-90 mx-1" />
                <div className="flex flex-col text-white pt-1">
                    <span className="font-extrabold text-[13px] md:text-[15px] leading-tight tracking-wide">
                        ADMISSION TO UGCET &amp; OTHER PROFESSIONAL COURSES- 2026
                    </span>
                    <span className="text-[9px] md:text-[11px] text-[#A2B1C6] font-medium tracking-wide">
                        CENTRALISED ALLOTMENT PROCESS
                    </span>
                </div>
            </div>
        </div>
    );
}

// --- Main Header with Navigation (100% Screenshot Matching White Header) ---
interface MainHeaderProps {
    step: string;
    onNavigate: (step: string) => void;
    onLogout: () => void;
    userProfile?: any;
}

export function MainHeader({ step, onNavigate, onLogout, userProfile }: MainHeaderProps) {
    const studentName = userProfile?.studentName || 'STUDENT';
    const cetNo = userProfile?.kcetNumber || 'CET NO';

    return (
        <header className="bg-white text-gray-800 shadow-sm select-none border-b border-gray-200">
            {/* Top thin blue bar */}
            <div className="h-1.5 w-full bg-[#1e3a8a]" />
            
            <div className="w-full px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-4 max-w-[1500px] mx-auto">
                {/* Left side: KEA Official Logo & Title Text */}
                <div className="flex items-center gap-4 shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                        <img 
                            src="https://cetonline.karnataka.gov.in/kea/assets/images/kea-logo-kan.png" 
                            alt="Government of Karnataka Logo" 
                            className="w-full h-full object-contain"
                        />
                    </div>
                    
                    <div className="flex flex-col leading-tight">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] sm:text-[11px] font-bold text-gray-800">ಕರ್ನಾಟಕ ಸರ್ಕಾರ</span>
                            <span className="text-[10px] sm:text-[11px] font-bold text-gray-800">GOVERNMENT OF KARNATAKA</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] sm:text-[13px] font-black text-[#1e3a8a]">ಕರ್ನಾಟಕ ಪರೀಕ್ಷಾ ಪ್ರಾಧಿಕಾರ</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[12px] sm:text-[14px] font-black text-[#1e3a8a]">KARNATAKA EXAMINATIONS AUTHORITY</span>
                        </div>
                        <div className="flex items-center gap-4 mt-0.5">
                            <span className="text-[11px] sm:text-[13px] font-black text-[#dc2626]">Common Admission Cell</span>
                            <span className="text-[11px] sm:text-[13px] font-black text-[#1e3a8a]">UGCET-2024</span>
                        </div>
                    </div>
                </div>

                {/* Right side: Candidate Info & Hidden Nav Links */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                    {/* Navigation links (Subtle so they don't break the exact UI match) */}
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        <button onClick={() => onNavigate('landing')} className="hover:text-[#1e3a8a] transition-colors">Home</button>
                        <span>|</span>
                        <button onClick={() => onNavigate('entry')} className="hover:text-[#1e3a8a] transition-colors">Option Entry</button>
                        <span>|</span>
                        <button onClick={onLogout} className="hover:text-red-600 transition-colors">Log Out</button>
                    </div>

                    {/* Candidate Details Box */}
                    <div className="bg-[#f8fafc] border border-gray-200 px-4 py-2 rounded shadow-sm text-right flex flex-col min-w-[240px]">
                        <div className="flex justify-between items-center gap-4 border-b border-gray-100 pb-1 mb-1">
                            <span className="text-[11px] font-bold text-gray-600">CET No :</span>
                            <span className="text-[12px] font-black text-[#1e3a8a]">{cetNo}</span>
                        </div>
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-[11px] font-bold text-gray-600">CANDIDATE NAME :</span>
                            <span className="text-[12px] font-black text-[#1e3a8a] truncate max-w-[200px]">{studentName}</span>
                        </div>
                    </div>
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

export const LandingHeader = MainHeader;
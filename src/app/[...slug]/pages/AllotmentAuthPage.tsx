'use client';

import React, { useState } from 'react';
import { RefreshCw, Calendar, ArrowLeft } from 'lucide-react';
import { KEALogo } from '@/components/DashboardHeader';
import { getRoundLabel } from '@/lib/utils/cutoff-link';

interface AllotmentAuthPageProps {
    onNavigate: (step: string) => void;
    authCetNo: string;
    setAuthCetNo: (v: string) => void;
    authDob: string;
    setAuthDob: (v: string) => void;
    authCaptcha: string;
    setAuthCaptcha: (v: string) => void;
    handleCheckAllotment: (downloadOnly?: boolean) => Promise<void>;
    currentRound: number;
}

export default function AllotmentAuthPage({
    onNavigate,
    authCetNo,
    setAuthCetNo,
    authDob,
    setAuthDob,
    authCaptcha,
    setAuthCaptcha,
    handleCheckAllotment,
    currentRound,
}: AllotmentAuthPageProps) {
    const roundText = getRoundLabel(currentRound, 'long').toUpperCase();

    // Random Captcha Generator matching screenshot "V 7 C 2 G 9"
    const [captchaCode, setCaptchaCode] = useState("V 7 C 2 G 9");

    const refreshCaptcha = () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let result = "";
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length)) + " ";
        }
        setCaptchaCode(result.trim());
    };

    return (
        <div className="min-h-screen bg-[#EBF3FA] font-sans flex flex-col select-none">
            {/* ── Top Header Navigation Bar ── */}
            <header className="bg-[#1B365D] text-white shadow-md border-b-4 border-[#D99A29]">
                <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
                    <KEALogo />

                    <button
                        onClick={() => onNavigate('landing')}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs md:text-sm px-4 py-2 rounded-full border border-white/20 transition-all flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Dashboard</span>
                    </button>
                </div>
            </header>

            {/* ── Main Form Container ── */}
            <div className="w-full max-w-[580px] mx-auto px-4 my-8 md:my-10 flex-1 flex flex-col justify-start">
                
                {/* ── Outer Card ── */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                    
                    {/* Dark Navy Blue Card Header matching KEA Portal */}
                    <div className="bg-[#1B365D] py-6 px-6 text-center text-white relative">
                        <h2 className="font-extrabold text-[15px] md:text-[17px] leading-snug tracking-tight uppercase font-sans">
                            UGCET-2026 {roundText} FINAL ALLOTMENT RESULTS (15-07-2026)
                        </h2>
                        <h3 className="text-[11px] font-bold text-[#93C5FD] uppercase tracking-[0.18em] mt-1.5 font-sans">
                            KARNATAKA EXAMINATIONS AUTHORITY
                        </h3>
                    </div>

                    {/* Card Body Form */}
                    <div className="p-6 md:p-8 space-y-5 bg-white">
                        
                        {/* Field 1: CET NO */}
                        <div>
                            <label className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block mb-1.5 font-sans">
                                CET NO
                            </label>
                            <input
                                type="text"
                                value={authCetNo}
                                onChange={e => setAuthCetNo(e.target.value)}
                                placeholder="Enter your CET No"
                                className="w-full border border-[#CBD5E1] rounded-lg px-4 py-2.5 text-[14px] text-slate-800 placeholder-[#94A3B8] outline-none focus:border-[#1B365D] focus:ring-1 focus:ring-[#1B365D] shadow-2xs font-medium font-sans"
                            />
                        </div>

                        {/* Field 2: DOB */}
                        <div>
                            <label className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block mb-1.5 font-sans">
                                DOB
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={authDob}
                                    onChange={e => setAuthDob(e.target.value)}
                                    placeholder="dd-mm-yyyy"
                                    className="w-full border border-[#CBD5E1] rounded-lg px-4 py-2.5 pr-10 text-[14px] text-slate-800 placeholder-[#94A3B8] outline-none focus:border-[#1B365D] focus:ring-1 focus:ring-[#1B365D] shadow-2xs font-medium font-sans"
                                />
                                <Calendar className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        {/* Field 3: CAPTCHA */}
                        <div>
                            <label className="text-[11px] font-bold text-[#475569] uppercase tracking-wider block mb-1.5 font-sans">
                                CAPTCHA
                            </label>
                            
                            {/* Graphic Captcha Display + Refresh Button */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex-1 border border-[#CBD5E1] rounded-lg py-2.5 px-4 bg-[#F8FAFC] flex items-center justify-center relative overflow-hidden select-none bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:8px_8px] h-12 shadow-2xs">
                                    <span className="font-mono text-2xl font-extrabold tracking-[0.35em] text-[#1E3B66] italic select-none">
                                        {captchaCode}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={refreshCaptcha}
                                    className="w-10 h-10 border border-[#CBD5E1] rounded-lg bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 shadow-2xs transition-colors shrink-0 cursor-pointer"
                                    title="Refresh Captcha"
                                >
                                    <RefreshCw className="w-4 h-4 text-slate-600" />
                                </button>
                            </div>

                            {/* Captcha Input */}
                            <input
                                type="text"
                                value={authCaptcha}
                                onChange={e => setAuthCaptcha(e.target.value)}
                                placeholder="Enter the characters shown above"
                                className="w-full border border-[#CBD5E1] rounded-lg px-4 py-2.5 text-[14px] text-slate-800 placeholder-[#94A3B8] outline-none focus:border-[#1B365D] focus:ring-1 focus:ring-[#1B365D] shadow-2xs font-medium font-sans"
                            />
                        </div>

                        {/* Check Result Button */}
                        <div className="pt-1">
                            <button
                                onClick={() => handleCheckAllotment(false)}
                                className="w-full bg-[#1B365D] hover:bg-[#122544] text-white font-bold py-3 px-6 rounded-lg text-[15px] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer font-sans tracking-wide"
                            >
                                Check Result
                            </button>
                        </div>

                        {/* NOTE Container inside Card */}
                        <div className="bg-[#EFF6FF] border-l-4 border-[#EAB308] border border-[#BFDBFE]/70 rounded-xl p-5 mt-6 font-sans text-left shadow-2xs">
                            <h4 className="font-extrabold text-[#1E293B] text-[12px] uppercase tracking-wider mb-2.5 font-sans">
                                NOTE
                            </h4>
                            <ol className="list-decimal pl-4 text-[12px] text-[#475569] space-y-2 leading-relaxed font-sans font-medium">
                                <li>Options entered upto 11.00 am on 09-07-2026 have been considered for this first round final seat allotment.</li>
                                <li>This is only result sheet of the UGCET- 2026 First Round final Seat Allotment, candidate should not report to the allotted college based on this result sheet.</li>
                                <li>Next step to be taken by the first round seat allotted candidates: Candidates have to select any one choice out of the four choices which is suitable for them. Before indicating any choice number, candidates please read and understand the implication of each choice and then select the appropriate choice.</li>
                                <li>Choice details are hosted on the kea website. further process please read the instructions / guidelines carefully.</li>
                                <li>If a candidate fails to exercise any choice within the stipulated date and time, then the seat allotted to such candidate stands cancelled automatically without any further notice in this regard and he/she will not be allowed to participate in further rounds.</li>
                                <li>Candidates, who are not allotted any seat in this round, need not exercise any choice entry can participate in the next round as per instructions.</li>
                                <li>KEA will not be responsible for any action/consequences arising due to non-compliance with the instructions, notifications and announcements regarding seat allotment appearing on the KEA website. Candidates are advised to visit the KEA website frequently for updates.</li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Bottom External Link */}
                <a
                    href="https://cetonline.karnataka.gov.in"
                    target="_blank"
                    rel="noreferrer"
                    className="text-center text-[13px] font-semibold text-[#1E3B66] underline underline-offset-2 hover:text-blue-800 block mt-6 mb-8 font-sans"
                >
                    Click here to go to the KEA website
                </a>
            </div>
        </div>
    );
}

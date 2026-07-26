'use client';

import React, { useState } from 'react';
import { ArrowLeft, Printer, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { getRoundLabel } from '@/lib/utils/cutoff-link';

interface AllotmentResultPageProps {
    userProfile: any;
    cetNo: string;
    mockAllotment: any;
    onNavigate: (step: string) => void;
    currentRound: number;
}

export default function AllotmentResultPage({
    userProfile,
    cetNo,
    mockAllotment,
    onNavigate,
    currentRound,
}: AllotmentResultPageProps) {
    const roundText = getRoundLabel(currentRound, 'long').toUpperCase();
    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

    // Form states
    const [inputCetNo, setInputCetNo] = useState(userProfile?.kcetNumber || cetNo || '2600ED0052');
    const [dob, setDob] = useState('');
    const [captchaCode, setCaptchaCode] = useState('D6YLQS');
    const [inputCaptcha, setInputCaptcha] = useState('');

    const refreshCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let res = '';
        for (let i = 0; i < 6; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaCode(res);
    };

    const candidateCetNo = userProfile?.kcetNumber || cetNo || inputCetNo || '2600ED0052';
    const candidateName = (userProfile?.studentName || 'YASHWIN K A').toUpperCase();
    const verifiedCategory = (userProfile?.category || '3AGR').toUpperCase();
    const candidateRank = userProfile?.rank ? `${userProfile.rank}.00000000` : '8892.00000000';

    const feesFormatted = mockAllotment?.fees 
        ? `₹${Number(mockAllotment.fees).toLocaleString('en-IN')}.00`
        : '₹120,320.00';

    return (
        <div className="min-h-screen bg-[#DDE6F0] font-sans flex flex-col text-[#222222]">
            
            {/* KEA Navbar Header */}
            <header className="bg-[#0A1E36] text-white print:hidden">
                <div className="max-w-[1100px] mx-auto px-4 h-[56px] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* KEA Logo Square */}
                        <div className="w-8 h-8 bg-white rounded-none p-[2px] flex items-center justify-center shrink-0">
                            <div className="w-full h-full bg-[#7E1281] flex items-center justify-center text-white font-bold text-[10px] tracking-tighter">
                                KEA
                            </div>
                        </div>

                        <div>
                            <h1 className="text-[12px] sm:text-[13px] font-bold text-white uppercase tracking-tight leading-none">
                                ADMISSION TO UGCET & OTHER PROFESSIONAL COURSES- 2026
                            </h1>
                            <p className="text-[9px] sm:text-[10px] text-[#A0B0C0] uppercase mt-1 tracking-wider leading-none">
                                CENTRALISED ALLOTMENT PROCESS
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => onNavigate('landing')}
                        className="bg-white/10 hover:bg-white/20 text-white text-[11px] px-3 py-1 rounded border border-white/20 transition-all flex items-center gap-1 font-sans"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        <span className="hidden sm:inline">Back to Dashboard</span>
                    </button>
                </div>
            </header>

            {/* Main Outer Centered Container */}
            <main className="flex-1 max-w-[580px] w-full mx-auto px-2 py-6 sm:py-8">
                
                {/* Unified Portal Card */}
                <div className="bg-white border border-[#B0C4DE] shadow-sm rounded-[3px] overflow-hidden">
                    
                    {/* Top Result Banner (Dark Blue Box) */}
                    <div className="bg-[#0A1E36] text-white px-4 py-3 text-center">
                        <h2 className="text-[12px] sm:text-[13px] font-bold uppercase tracking-wide leading-tight">
                            UGCET-2026 {roundText} FINAL ALLOTMENT RESULTS ({dateStr})
                        </h2>
                        <p className="text-[10px] text-[#A0B0C0] uppercase tracking-wider mt-1">
                            KARNATAKA EXAMINATIONS AUTHORITY
                        </p>
                    </div>

                    {/* Card Inner Body */}
                    <div className="p-4 sm:p-5">

                        {/* Seat Allotted Green Banner */}
                        {mockAllotment ? (
                            <div className="bg-[#EAF7ED] border border-[#B2E3BE] text-[#1E7E34] text-[11px] sm:text-[12px] font-medium py-2 px-3 rounded-[3px] mb-4 text-center flex items-center justify-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-[#1E7E34] shrink-0" />
                                <span>🎉 Congratulations — you have been allotted a seat.</span>
                            </div>
                        ) : (
                            <div className="bg-[#FFF1F0] border border-[#FFA39E] text-[#CF1322] text-[11px] sm:text-[12px] font-medium py-2 px-3 rounded-[3px] mb-4 text-center flex items-center justify-center gap-1.5">
                                <AlertCircle className="w-4 h-4 text-[#CF1322] shrink-0" />
                                <span>No seat allotted in this round based on your options and rank.</span>
                            </div>
                        )}

                        {/* Table of Details */}
                        <div className="border border-[#D0D7DE] text-[11px] sm:text-[12px] divide-y divide-[#E1E4E8] mb-6">
                            
                            <div className="grid grid-cols-12 p-2 bg-white">
                                <span className="col-span-5 text-[#555555] font-normal">CET No</span>
                                <span className="col-span-7 font-bold text-[#111111]">{candidateCetNo}</span>
                            </div>

                            <div className="grid grid-cols-12 p-2 bg-[#F8FAFC]">
                                <span className="col-span-5 text-[#555555] font-normal">Name</span>
                                <span className="col-span-7 font-bold text-[#111111]">{candidateName}</span>
                            </div>

                            <div className="grid grid-cols-12 p-2 bg-white">
                                <span className="col-span-5 text-[#555555] font-normal">Applied Category</span>
                                <span className="col-span-7 font-bold text-[#111111]">{verifiedCategory}</span>
                            </div>

                            <div className="grid grid-cols-12 p-2 bg-[#F8FAFC]">
                                <span className="col-span-5 text-[#555555] font-normal">Rank</span>
                                <span className="col-span-7 font-bold text-[#111111]">Engineering - {candidateRank}</span>
                            </div>

                            <div className="grid grid-cols-12 p-2 bg-white">
                                <span className="col-span-5 text-[#555555] font-normal">Discipline</span>
                                <span className="col-span-7 font-bold text-[#111111]">Engineering</span>
                            </div>

                            <div className="grid grid-cols-12 p-2 bg-[#F8FAFC]">
                                <span className="col-span-5 text-[#555555] font-normal">College Allotted</span>
                                <span className="col-span-7 font-bold text-[#111111] leading-normal uppercase">
                                    {mockAllotment?.collegeCode ? `${mockAllotment.collegeCode} - ` : ''}
                                    {mockAllotment?.collegeName || 'NO SEAT ALLOTTED'}
                                </span>
                            </div>

                            <div className="grid grid-cols-12 p-2 bg-white">
                                <span className="col-span-5 text-[#555555] font-normal">Course Allotted</span>
                                <span className="col-span-7 font-bold text-[#111111] uppercase">
                                    {mockAllotment 
                                        ? `${mockAllotment.branchName} (${mockAllotment.branchCode || 'IE'})`
                                        : 'N/A'
                                    }
                                </span>
                            </div>

                            <div className="grid grid-cols-12 p-2 bg-[#F8FAFC]">
                                <span className="col-span-5 text-[#555555] font-normal">Category Allotted</span>
                                <span className="col-span-7 font-bold text-[#111111]">
                                    {mockAllotment?.allottedCategory || 'N/A'}
                                </span>
                            </div>

                            <div className="grid grid-cols-12 p-2 bg-white">
                                <span className="col-span-5 text-[#555555] font-normal">Allotted Option Serial No</span>
                                <span className="col-span-7 font-bold text-[#111111]">
                                    {mockAllotment?.priority || mockAllotment?.choiceNo || '24'}
                                </span>
                            </div>

                            <div className="grid grid-cols-12 p-2 bg-[#F8FAFC]">
                                <span className="col-span-5 text-[#555555] font-normal">Course Fees</span>
                                <span className="col-span-7 font-bold text-[#111111]">{feesFormatted}</span>
                            </div>

                            <div className="grid grid-cols-12 p-2 bg-white">
                                <span className="col-span-5 text-[#555555] font-normal">Payable Fees</span>
                                <span className="col-span-7 font-bold text-[#111111]">{feesFormatted}</span>
                            </div>

                        </div>

                        {/* CET Search Form inside the card below table */}
                        <div className="max-w-[400px] mx-auto space-y-3 pt-2 mb-6">
                            <div>
                                <label className="block text-[10px] font-semibold text-[#555555] uppercase mb-1">
                                    CET NO
                                </label>
                                <input
                                    type="text"
                                    value={inputCetNo}
                                    onChange={(e) => setInputCetNo(e.target.value)}
                                    placeholder="Enter your CET No"
                                    className="w-full px-2.5 py-1.5 text-[11px] border border-[#C0C0C0] rounded-[2px] focus:outline-none focus:border-[#0A1E36]"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-semibold text-[#555555] uppercase mb-1">
                                    DOB
                                </label>
                                <input
                                    type="text"
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    placeholder="dd-mm-yyyy"
                                    className="w-full px-2.5 py-1.5 text-[11px] border border-[#C0C0C0] rounded-[2px] focus:outline-none focus:border-[#0A1E36]"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-semibold text-[#555555] uppercase mb-1">
                                    CAPTCHA
                                </label>
                                
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className="bg-[#F2F4F7] border border-[#CCCCCC] px-4 py-1.5 rounded-[2px] font-mono text-sm font-bold tracking-[5px] text-[#0A1E36] select-none shadow-inner flex items-center justify-center">
                                        <span className="italic transform -skew-x-6">{captchaCode}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={refreshCaptcha}
                                        className="text-[#666666] hover:text-[#000000] p-1"
                                        title="Refresh Captcha"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <input
                                    type="text"
                                    value={inputCaptcha}
                                    onChange={(e) => setInputCaptcha(e.target.value)}
                                    placeholder="Enter the characters shown above"
                                    className="w-full px-2.5 py-1.5 text-[11px] border border-[#C0C0C0] rounded-[2px] focus:outline-none focus:border-[#0A1E36]"
                                />
                            </div>

                            <button
                                type="button"
                                className="w-full bg-[#0A1E36] hover:bg-[#122e50] text-white font-bold text-[11px] py-2 px-3 rounded-[2px] shadow-sm uppercase tracking-wider transition-colors mt-1"
                            >
                                Check Result
                            </button>
                        </div>

                        {/* Yellow Note Box at bottom inside card */}
                        <div className="bg-[#FFFDE7] border border-[#FFE082] rounded-[2px] p-3 text-[10px] sm:text-[11px] text-[#444444] leading-relaxed">
                            <h3 className="font-bold text-[#D48806] uppercase mb-1 text-[11px]">
                                NOTE
                            </h3>

                            <ol className="list-decimal list-inside space-y-1.5 text-[10px] sm:text-[11px]">
                                <li>
                                    Options entered upto 11.00 am on 09-07-2026 have been considered for this first round final seat allotment.
                                </li>
                                <li>
                                    This is only result sheet of the UGCET-2026 First Round final Seat Allotment. Candidate should not report to the allotted college based on this result sheet.
                                </li>
                                <li>
                                    Next step to be taken by the first round seat allotted candidates: Candidates have to select any one choice out of the four choices which is suitable for them. Before indicating any choice number, candidates please read and understand the implication of each choice and then select the appropriate choice.
                                </li>
                                <li>
                                    Choice details are hosted on the kea website. further process please read the instructions / guidelines carefully.
                                </li>
                                <li>
                                    If a candidate fails to exercise any choice within the stipulated date and time, then the seat allotted to such candidate stands cancelled automatically without any further notice in this regard and he/she will not be allowed to participate in further rounds.
                                </li>
                                <li>
                                    Candidates, who are not allotted any seat in this round, need not exercise any choice entry can participate in the next round as per instructions.
                                </li>
                                <li>
                                    KEA will not be responsible for any action/consequences arising due to non-compliance with the instructions, notifications and announcements regarding seat allotment appearing on the KEA website. Candidates are advised to visit the KEA website frequently for updates.
                                </li>
                            </ol>

                            <div className="mt-2 text-center pt-1.5 border-t border-[#FFF59D]">
                                <a
                                    href="https://kea.kar.nic.in"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#0056B3] hover:underline font-normal text-[10px] sm:text-[11px]"
                                >
                                    Click here to go to the KEA website
                                </a>
                            </div>
                        </div>

                        {/* Print & Action Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 print:hidden">
                            <button
                                onClick={() => window.print()}
                                className="bg-[#0A1E36] hover:bg-[#122e50] text-white text-[11px] font-semibold px-4 py-2 rounded-[2px] shadow-sm flex items-center gap-1.5 transition-all"
                            >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Print Result Sheet</span>
                            </button>

                            <button
                                onClick={() => onNavigate('choice_entry')}
                                className="bg-[#1E7E34] hover:bg-[#155d27] text-white text-[11px] font-semibold px-4 py-2 rounded-[2px] shadow-sm flex items-center gap-1.5 transition-all"
                            >
                                <span>Proceed to Choice Entry →</span>
                            </button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}


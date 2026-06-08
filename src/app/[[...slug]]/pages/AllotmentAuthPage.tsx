'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { SimplePageHeader } from '@/components/DashboardHeader';

const roundLabels = ['', 'First', 'Second', 'Third'];

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
    const roundText = roundLabels[currentRound] || `ROUND ${currentRound}`;
    return (
        <div className="min-h-screen bg-white font-sans flex flex-col relative">
            <SimplePageHeader accentColor="#800000" />

            <div className="max-w-3xl mx-auto mt-8 border border-gray-300 rounded shadow-sm w-full">
                <div className="bg-[#0d6efd] text-white text-center py-4 px-2">
                    <h2 className="text-sm md:text-[15px] font-bold uppercase tracking-wide">UGCET/NEET & OTHER PROFESSIONAL COURSES -2026</h2>
                    <h3 className="text-sm md:text-[15px] font-bold uppercase tracking-wide mt-1">{roundText} ROUND PROVISIONAL ALLOTMENT RESULTS (01-08-2026)</h3>
                </div>
                <div className="p-6 md:p-10 space-y-6 bg-white">
                    <div className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-gray-800">CET No:</label>
                        <input type="text" value={authCetNo} onChange={e => setAuthCetNo(e.target.value)} className="border border-gray-300 rounded px-3 py-1.5 w-full max-w-md text-sm outline-none focus:border-blue-500" />
                    </div>

                    <div className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] items-center gap-4">
                        <label className="text-[13px] font-bold text-gray-800">Date Of Birth:</label>
                        <input type="date" value={authDob} onChange={e => setAuthDob(e.target.value)} className="border border-gray-300 rounded px-3 py-1.5 w-full max-w-[180px] text-sm text-gray-600 outline-none focus:border-blue-500" />
                    </div>

                    <div className="space-y-3 mt-8">
                        <label className="text-[13px] font-bold text-gray-800">Enter the text shown below:</label>
                        <div className="flex items-center gap-4 pl-8">
                            <div className="bg-white border border-gray-300 line-through tracking-[0.3em] text-lg font-mono italic px-6 py-2 select-none text-black relative overflow-hidden">
                                C7YV9
                            </div>
                            <button className="bg-[#0d6efd] p-1.5 rounded hover:bg-blue-700 shadow flex items-center justify-center">
                                <RefreshCw className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <input type="text" placeholder="Enter CAPTCHA" value={authCaptcha} onChange={e => setAuthCaptcha(e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full max-w-full text-sm focus:border-blue-500 focus:outline-none" />
                    </div>

                    <div className="flex justify-center pt-6 pb-2">
                        <button onClick={() => handleCheckAllotment(false)} className="bg-[#198754] hover:bg-[#157347] text-white font-bold py-2 px-8 rounded shadow text-[15px]">
                            Check
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto mt-6 border border-gray-300 p-6 bg-white shadow-sm mb-12">
                <h4 className="text-gray-800 text-[15px] mb-4">NOTE:</h4>
                <p className="text-[13px] font-bold text-gray-800 leading-relaxed">
                    1. AS this is {roundText} Round Provisional Seat Allotment result the candidate need not has to report to the allotted college.
                </p>
                <p className="text-[13px] font-bold text-gray-800 leading-relaxed">
                    2. CLICK CHECK DIRECTLY (YOU CAN'T ENTER ANYTHING)
                </p>
            </div>

            <div className="absolute top-4 right-4 md:top-6 md:right-8">
                <button
                    onClick={() => onNavigate('landing')}
                    className="text-gray-500 hover:text-blue-600 text-sm font-bold underline"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

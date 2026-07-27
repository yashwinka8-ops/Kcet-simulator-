'use client';

import React from 'react';
import { ShieldCheck, Sparkles, ArrowRight, Heart, Info, MessageSquare } from 'lucide-react';

interface CreditsPrivacyCardProps {
    onNavigate: (step: string) => void;
}

export default function CreditsPrivacyCard({ onNavigate }: CreditsPrivacyCardProps) {
    return (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl w-full max-w-2xl mx-auto overflow-hidden text-slate-800 font-sans transition-all duration-300 hover:shadow-2xl">
            
            {/* Header Banner matching KEA Theme */}
            <div className="bg-gradient-to-r from-[#1B365D] via-[#20406C] to-[#1B365D] text-white px-6 py-4 border-b-4 border-[#D99A29] flex items-center justify-between relative overflow-hidden">
                <div className="flex items-center gap-2.5 relative z-10">
                    <ShieldCheck className="w-5 h-5 text-[#D99A29]" />
                    <h2 className="text-sm md:text-base font-extrabold uppercase tracking-wider text-white">
                        Credits &amp; Privacy Policy
                    </h2>
                </div>
                <span className="text-[11px] bg-[#0F2038] text-[#D99A29] px-3 py-1 rounded-full font-bold border border-slate-700/80 shadow-inner relative z-10">
                    KEA Simulator 2026
                </span>
            </div>

            <div className="p-6 md:p-8 space-y-6">
                
                {/* Credits Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wide">
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                        <span>Project Credits</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {/* flux_ai badge */}
                        <div className="flex items-center gap-2 bg-[#0F2038] text-white px-3.5 py-2 rounded-xl border border-slate-700 shadow-sm">
                            <MessageSquare className="w-4 h-4 text-[#3B82F6]" />
                            <span className="text-xs font-semibold">flux_ai <span className="text-slate-400 font-normal">(aka Yashwin)</span></span>
                        </div>
                        {/* Azalea badge */}
                        <div className="flex items-center gap-2 bg-[#0F2038] text-white px-3.5 py-2 rounded-xl border border-slate-700 shadow-sm">
                            <MessageSquare className="w-4 h-4 text-[#3B82F6]" />
                            <span className="text-xs font-semibold">Azalea</span>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-200/80" />

                {/* Latest Updates Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wide">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Latest Updates</span>
                    </div>
                    <p className="text-slate-600 text-xs md:text-sm leading-relaxed pl-1">
                        The <strong className="text-slate-900 font-bold">2026 Counseling Simulator Logic</strong> is live with official 2026 cutoffs! Simulated using the standard 3-round counseling sequence (Mock Round, Round 1, Round 2, Round 3).
                    </p>
                </div>

                <div className="h-px bg-slate-200/80" />

                {/* Privacy Policy & Disclaimer Section */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wide">
                        <Info className="w-4 h-4 text-[#1B365D]" />
                        <span>Privacy Policy &amp; Disclaimer</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-600 text-xs md:text-sm leading-relaxed">
                        This platform is built purely for educational purposes and is <strong className="text-red-600 font-bold">NOT</strong> affiliated with the official Karnataka Examinations Authority (KEA). No legal actions can be taken against the creators. We do not collect, transmit, or store any personal data on external servers; all data remains 100% secured within your local browser storage.
                    </div>
                </div>

                <div className="h-px bg-slate-200/80" />

                {/* Footnote & Action Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                    <span className="text-slate-400 italic text-[11px] text-center sm:text-left">
                        * Allotments simulated based on official 2026 &amp; 2025 KCET Round cutoffs.
                    </span>

                    <button
                        onClick={() => onNavigate('privacy')}
                        className="inline-flex items-center gap-2 bg-[#1B365D] hover:bg-[#122744] active:bg-[#0A182E] text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-md text-xs group cursor-pointer shrink-0"
                    >
                        <span>Full Privacy Policy &amp; Disclaimer</span>
                        <ArrowRight className="w-4 h-4 text-[#D99A29] group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

            </div>
        </div>
    );
}

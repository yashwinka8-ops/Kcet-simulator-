'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck } from 'lucide-react';

interface PageFooterProps {
    className?: string;
    onNavigate?: (step: string) => void;
}

export default function PageFooter({ className, onNavigate }: PageFooterProps) {
    return (
        <footer className={cn("border-t-4 border-[#D99A29] py-4 px-4 md:px-12 w-full mt-auto bg-[#1B365D] select-none text-white", className)}>
            <div className="w-full flex flex-col items-center justify-between gap-3 max-w-7xl mx-auto">
                
                {/* Main Row */}
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
                    {/* Left: Karnataka Emblem inside subtle box */}
                    <div className="shrink-0 flex items-center">
                        <div className="bg-[#24426A] border border-[#305380] p-1.5 rounded-xl shadow-inner">
                            <img 
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP0KQXpj2u7uki2Hs1TjVSmOlDIJOI-sgh12cXqq0Kaw&s=10" 
                                alt="Karnataka Government Logo" 
                                className="w-[34px] h-[34px] object-contain rounded-full"
                            />
                        </div>
                    </div>

                    {/* Center: Text Content */}
                    <div className="text-center flex-1 space-y-1 pt-1">
                        <h3 className="text-[12px] md:text-[13px] text-white font-bold tracking-wide">
                            Karnataka Examinations Authority
                        </h3>
                        
                        <p className="text-[10px] md:text-[11px] text-[#A2B1C6] font-medium flex items-center justify-center gap-1.5 flex-wrap">
                            <span>Tel: 080-23460460, 23564583</span>
                            <span className="text-[#3E639A] mx-0.5">•</span>
                            <span className="text-[#D99A29]">cetonline.karnataka.gov.in</span>
                            <span className="text-[#3E639A] mx-0.5">•</span>
                            <span>v1.5.18</span>
                        </p>

                        <p className="text-[9.5px] text-[#869AB5] flex items-center justify-center gap-1.5 flex-wrap max-w-5xl mx-auto leading-relaxed">
                            <span>Designed &amp; Developed with technical support of NIC, Karnataka State Unit, Bangalore</span>
                            <span className="text-[#3E639A] hidden md:inline mx-0.5">•</span>
                            <span>Network &amp; State Data Centre Services by Centre for e-Governance, Govt. of Karnataka</span>
                        </p>
                    </div>

                    {/* Right: NIC Logo inside subtle box */}
                    <div className="shrink-0 flex items-center">
                        <div className="bg-[#24426A] border border-[#305380] px-2 py-1.5 rounded-xl shadow-inner">
                            <img 
                                src="/NIC.png" 
                                alt="NIC Logo" 
                                className="h-[28px] object-contain opacity-90 drop-shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Sub-footer Row: Credits & Privacy Policy */}
                <div className="w-full pt-2.5 mt-1 border-t border-[#24426A]/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#94A3B8]">
                    <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
                        <span>Simulator by</span>
                        <span className="font-bold text-[#D99A29]">flux_ai (Yashwin)</span>
                        <span>&amp;</span>
                        <span className="font-bold text-[#D99A29]">Azalea</span>
                        <span className="text-slate-500">• Official 2026 Cutoffs</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            if (onNavigate) onNavigate('privacy');
                            else if (typeof window !== 'undefined') window.location.href = '/privacy';
                        }}
                        className="text-[#D99A29] hover:text-amber-300 font-semibold underline underline-offset-2 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Privacy Policy &amp; Disclaimer</span>
                    </button>
                </div>

            </div>
        </footer>
    );
}
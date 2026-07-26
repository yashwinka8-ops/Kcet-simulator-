'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PageFooterProps {
    className?: string;
}

export default function PageFooter({ className }: PageFooterProps) {
    return (
        <div className={cn("border-t-4 border-[#D99A29] py-3.5 px-4 md:px-12 w-full mt-auto bg-[#1B365D] select-none", className)}>
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
                <div className="text-center flex-1 space-y-1.5 pt-1">
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
        </div>
    );
}
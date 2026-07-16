'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PageFooterProps {
    className?: string;
}

export default function PageFooter({ className }: PageFooterProps) {
    return (
        <div className={cn("border-t-[4px] border-[#DDA31D] py-6 px-6 w-full mt-auto bg-[#18325C]", className)}>
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto">
                {/* Left: KEA Circular Logo Placeholder */}
                <div className="shrink-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 shadow-md">
                        <img
                            src="https://cetonline.karnataka.gov.in/kea/assets/images/kea-logo-kan.png"
                            alt="KEA Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                {/* Center: Text */}
                <div className="text-center flex-1 space-y-1.5">
                    <p className="text-[13px] md:text-[14px] text-white font-bold tracking-wide">
                        Karnataka Examinations Authority
                    </p>
                    <p className="text-[11px] md:text-[12px] text-white/80 font-medium tracking-wide">
                        Tel: 080-23460460, 23564583 &bull; <span className="text-[#DDA31D]">cetonline.karnataka.gov.in</span> &bull; v1.5.13
                    </p>
                    <p className="text-[10px] md:text-[11px] text-white/60 tracking-wide">
                        Designed &amp; Developed with technical support of NIC, Karnataka State Unit, Bangalore &bull; Network &amp; State Data Centre Services by Centre for e-Governance, Govt. of Karnataka
                    </p>
                </div>

                {/* Right: NIC Logo Placeholder */}
                <div className="shrink-0 flex items-center justify-center">
                    <div className="opacity-80">
                        <img src="/NIC.png" alt="NIC Logo" className="h-10 md:h-12 object-contain" />
                    </div>
                </div>
            </div>
        </div>
    );
}
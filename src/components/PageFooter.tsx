'use client';

import React from 'react';
import { cn } from '@/lib/utils';

const KEALogo = ({ className }: { className?: string }) => (
    <img
        src="https://cetonline.karnataka.gov.in/kea/assets/images/kea-logo-kan.png"
        alt="KEA Logo"
        className={cn("object-fill", className)}
    />
);

const NICLogo = () => (
    <img src="/NIC.png" alt="NIC Logo" className="h-6 md:h-8 object-contain opacity-80" />
);

interface PageFooterProps {
    className?: string;
}

export default function PageFooter({ className }: PageFooterProps) {
    return (
        <div className={cn("border-t-[2px] border-black py-4 px-4 md:px-12 w-full mt-auto bg-white", className)}>
            <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Left: KEA Logo */}
                <div className="shrink-0 hidden md:block">
                    <KEALogo className="h-8 md:h-10 w-[100px] md:w-[130px] object-fill" />
                </div>

                {/* Center: Text */}
                <div className="text-center flex-1 space-y-[2px]">
                    <p className="text-[10px] text-[#A60000] font-bold tracking-tight">
                        HELPLINE NUMBER <span className="font-sans">080-23460460 (10:30am-7:30pm)</span>
                    </p>
                    <p className="text-[9px] text-black font-bold mt-1">Brought to you by</p>
                    <p className="text-[9px] text-black font-bold">r/kcet</p>
                    <p className="text-[9px] text-black font-medium tracking-tight">Tel: 080-23460460, 23564583</p>
                    <p className="text-[9px] text-black font-medium tracking-tight">
                        Website:{' '}
                        <span className="text-[#000080] font-bold underline">
                            cetonline.karnataka.gov.in
                        </span>{' '}
                        / Version 1.0, Server-09
                    </p>
                    <p className="text-[8px] md:text-[9px] text-red-600 font-bold uppercase tracking-tight mt-2">
                        Disclaimer: This site is just a mock and is not affiliated with KEA in any way
                    </p>
                </div>

                {/* Right: NIC Logo */}
                <div className="shrink-0 hidden md:block">
                    <NICLogo />
                </div>
            </div>
        </div>
    );
}
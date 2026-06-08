'use client';

import React from 'react';

interface AllotmentResultPageProps {
    userProfile: any;
    cetNo: string;
    mockAllotment: any;
    onNavigate: (step: string) => void;
}

export default function AllotmentResultPage({
    userProfile,
    cetNo,
    mockAllotment,
    onNavigate,
}: AllotmentResultPageProps) {
    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center py-10 px-4" style={{ fontFamily: 'Arial, sans-serif' }}>
            <div className="bg-white border border-gray-200 rounded-[4px] shadow-sm w-full max-w-[800px] p-4 md:p-8 relative">

                <div className="bg-[#D1E7DD] rounded-[4px] py-3 mb-4 flex justify-center items-center">
                    <span className="text-[#0a58ca] text-[15px] md:text-[16px] font-bold tracking-wide">
                        🎉 CONGRATULATIONS
                    </span>
                </div>

                <div className="bg-[#198754] rounded-[4px] py-2 mb-8">
                    <h2 className="text-white text-center text-[13px] md:text-[14px] font-bold tracking-wider">
                        UGCET/NEET -2025 MOCK ALLOTMENT RESULTS DT: {dateStr}
                    </h2>
                </div>

                <div className="px-2 md:px-6 space-y-[16px]">
                    <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                        <div className="text-[14px] font-bold text-gray-900">CET No:</div>
                        <div className="text-[14px] text-[#0056b3]">{userProfile?.kcetNumber || cetNo}</div>
                    </div>
                    <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                        <div className="text-[14px] font-bold text-gray-900">Name of the Candidate:</div>
                        <div className="text-[14px] text-[#0056b3] uppercase">{userProfile?.studentName || 'CANDIDATE'}</div>
                    </div>
                    <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                        <div className="text-[14px] font-bold text-gray-900">Verified Category:</div>
                        <div className="text-[14px] text-[#0056b3] uppercase">{userProfile?.category || '2AG'}</div>
                    </div>
                    <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                        <div className="text-[14px] font-bold text-gray-900">Rank:</div>
                        <div className="text-[14px] text-[#0056b3]">Engineering - {userProfile?.rank}.00000000</div>
                    </div>
                    <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                        <div className="text-[14px] font-bold text-gray-900">Discipline:</div>
                        <div className="text-[14px] text-[#0056b3]">Engineering</div>
                    </div>
                    <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                        <div className="text-[14px] font-bold text-gray-900">College Allotted:</div>
                        <div className="text-[14px] text-[#0056b3] leading-relaxed uppercase pr-4">
                            {mockAllotment?.collegeName || 'NO SEAT ALLOTTED'}
                        </div>
                    </div>
                    <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                        <div className="text-[14px] font-bold text-gray-900">Course Allotted:</div>
                        <div className="text-[14px] text-[#0056b3] uppercase">
                            {mockAllotment ? `${mockAllotment.branchName} (${mockAllotment.branchId})` : 'N/A'}
                        </div>
                    </div>
                    <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                        <div className="text-[14px] font-bold text-gray-900">Category Allotted:</div>
                        <div className="text-[14px] text-[#0056b3] uppercase">{userProfile?.category || 'GM'}</div>
                    </div>
                    <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                        <div className="text-[14px] font-bold text-gray-900">Allotted Option Serial No:</div>
                        <div className="text-[14px] text-[#0056b3]">{mockAllotment?.choiceNo || 'N/A'}</div>
                    </div>
                    <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                        <div className="text-[14px] font-bold text-gray-900">Course Fees:</div>
                        <div className="text-[14px] text-[#0056b3]">
                            {mockAllotment?.collegeFees?.replace(/,/g, '') || '0'}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-12 mb-2 print:hidden">
                    <button
                        onClick={() => onNavigate('landing')}
                        className="bg-[#6c757d] hover:bg-[#5a6268] text-white text-[13px] px-6 py-1 rounded-[4px] shadow-sm flex items-center"
                    >
                        ...Back
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[13px] px-6 py-1 rounded-[4px] shadow-sm flex items-center"
                    >
                        Print
                    </button>
                </div>
            </div>
        </div>
    );
}

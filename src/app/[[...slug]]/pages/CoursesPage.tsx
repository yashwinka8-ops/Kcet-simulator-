'use client';

import React from 'react';

interface CoursesPageProps {
    onNavigate: (step: string) => void;
}

const coursesData = [
    { code: 'CSE', name: 'COMPUTER SCIENCE & ENGG' },
    { code: 'ISE', name: 'INFORMATION SCIENCE & ENGG' },
    { code: 'ECE', name: 'ELECTRONICS & COMMUNICATION ENGG' },
    { code: 'AIML', name: 'AI & MACHINE LEARNING' },
    { code: 'AIDS', name: 'AI & DATA SCIENCE' },
    { code: 'EEE', name: 'ELECTRICAL & ELECTRONICS ENGG' },
    { code: 'MECH', name: 'MECHANICAL ENGG' },
    { code: 'CIVIL', name: 'CIVIL ENGG' },
    { code: 'BT', name: 'BIO-TECHNOLOGY' },
    { code: 'CHEM', name: 'CHEMICAL ENGINEERING' },
    { code: 'CYBER', name: 'CYBER SECURITY ENGG' },
    { code: 'DS', name: 'DATA SCIENCES' },
    { code: 'EIE', name: 'ELECTRONICS & INSTRUMENTATION ENGG' },
    { code: 'ETE', name: 'ELECTRONICS & TELECOMMUNICATION ENGG' },
    { code: 'AERO', name: 'AERONAUTICAL ENGINEERING' },
    { code: 'ASE', name: 'AEROSPACE ENGINEERING' },
    { code: 'AUTO', name: 'AUTOMOBILE ENGINEERING' },
    { code: 'IEM', name: 'INDUSTRIAL ENGG & MANAGEMENT' },
    { code: 'RAI', name: 'ROBOTICS & ARTIFICIAL INTELLIGENCE' },
    { code: 'TT', name: 'TEXTILES TECHNOLOGY' },
];

const columns = [
    coursesData.slice(0, 7),
    coursesData.slice(7, 14),
    coursesData.slice(14, 20),
];

export default function CoursesPage({ onNavigate }: CoursesPageProps) {
    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-[#00529B] text-3xl font-bold">Engineering Course List</h2>
            </div>

            <div className="border border-gray-200 shadow-sm bg-white overflow-hidden">
                <div className="bg-[#E9D8E2] px-6 py-2 border-b border-gray-200">
                    <span className="text-[11px] font-black text-gray-700 uppercase tracking-widest">Engineering</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                    {columns.map((col, colIdx) => (
                        <div key={colIdx} className="flex flex-col">
                            {col.map((course, idx) => (
                                <div key={idx} className="px-4 py-2 hover:bg-gray-50 flex gap-2 border-b border-gray-100 last:border-0">
                                    <span className="text-[10px] font-black text-[#00529B] shrink-0">{course.code} -</span>
                                    <span className="text-[10px] font-bold text-gray-600 leading-tight uppercase">{course.name}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={() => onNavigate('entry')}
                    className="text-[#00529B] text-xs font-bold underline hover:no-underline"
                >
                    Return to Option Entry
                </button>
            </div>
        </div>
    );
}

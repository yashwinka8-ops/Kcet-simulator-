'use client';

import React from 'react';

interface CollegesPageProps {
    onNavigate: (step: string) => void;
    colleges: any[];
}

export default function CollegesPage({ onNavigate, colleges }: CollegesPageProps) {
    const mockCourses = ['AD', 'CE', 'CS', 'EC', 'EE', 'IE', 'ME'];

    return (
        <div className="max-w-7xl mx-auto space-y-4">
            <div className="text-center space-y-2">
                <h2 className="text-[#00529B] text-2xl font-bold">Engineering College List</h2>
                <p className="text-[#6B2D8C] text-[10px] font-bold">
                    Type = G-Government, A-Private Aided, B-Private Unaided, C-Deemed University, M-Minority (L,R)
                </p>
            </div>

            <div className="border border-gray-200 shadow-sm bg-white overflow-hidden flex flex-col max-h-[70vh]">
                <div className="overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#E9D8E2] border-b border-gray-300 sticky top-0 z-10">
                            <tr className="text-[10px] font-black text-gray-700 uppercase">
                                <th className="p-3 border-r border-gray-200 w-12 text-center">S/N</th>
                                <th className="p-3 border-r border-gray-200 w-12 text-center">Type</th>
                                <th className="p-3 border-r border-gray-200 w-16">Code</th>
                                <th className="p-3 border-r border-gray-200">College Name</th>
                                <th className="p-3 text-center">Courses</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {colleges.map((college: any, idx: number) => {
                                const type = idx % 5 === 0 ? 'G' : idx % 5 === 1 ? 'A' : idx % 5 === 2 ? 'B' : idx % 5 === 3 ? 'C' : 'M';
                                return (
                                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#F8F9FA]"}>
                                        <td className="p-3 border-r border-gray-200 text-center text-[11px] font-bold text-gray-400">{idx + 1}</td>
                                        <td className="p-3 border-r border-gray-200 text-center text-[11px] font-black text-gray-600">{type}</td>
                                        <td className="p-3 border-r border-gray-200 text-[11px] font-black text-[#00529B]">{college.college_id}</td>
                                        <td className="p-3 border-r border-gray-200 text-[11px] font-bold text-gray-700 uppercase">{college.name}</td>
                                        <td className="p-3">
                                            <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                                                {mockCourses.slice(0, 4 + (idx % 4)).map((c, i) => (
                                                    <span key={i} className="text-[10px] font-black text-gray-600 border-b border-rose-400">
                                                        {c}{i < 3 + (idx % 4) ? ',' : ''}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
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

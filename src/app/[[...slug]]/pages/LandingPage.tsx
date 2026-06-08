'use client';

import React from 'react';
import { Trash2, RefreshCw } from 'lucide-react';
import { LandingHeader } from '@/components/DashboardHeader';
import PageFooter from '@/components/PageFooter';

interface LandingPageProps {
    onNavigate: (step: string) => void;
    onLogout: () => void;
    userProfile: any;
    mockAllotment: any;
    hasAgreedDeclaration: boolean;
    globalConfig: any;
    setMockAllotment: (v: any) => void;
    setSelectedChoice: (v: number | null) => void;
    setChoiceSubmitted: (v: boolean) => void;
    setPreviousAllotment: (v: any) => void;
    setOptions: (v: any) => void;
    setUserProfile: (v: any) => void;
}

export default function LandingPage({
    onNavigate,
    onLogout,
    userProfile,
    mockAllotment,
    hasAgreedDeclaration,
    globalConfig,
    setMockAllotment,
    setSelectedChoice,
    setChoiceSubmitted,
    setPreviousAllotment,
    setOptions,
    setUserProfile,
}: LandingPageProps) {
    return (
        <div className="min-h-screen bg-white flex flex-col font-sans" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            <LandingHeader
                onNavigate={onNavigate}
                onLogout={onLogout}
            />

            <div className="w-full max-w-[1300px] mx-auto p-4 md:p-8 mt-2 flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    {/* Box 1: OPTION ENTRY */}
                    <div className="border border-gray-400 flex flex-col bg-white">
                        <div className="bg-[#0000FF] text-white text-center py-2 font-bold text-[13px] uppercase">
                            OPTION ENTRY
                        </div>
                        <div className="p-4 flex flex-col gap-5 text-[11px] font-bold text-black mt-2">
                            <div>
                                <button onClick={() => {
                                    if (hasAgreedDeclaration) {
                                        if (userProfile.kcetNumber && userProfile.studentName && userProfile.rank) {
                                            onNavigate('entry');
                                        } else {
                                            onNavigate('profile');
                                        }
                                    } else {
                                        onNavigate('declaration');
                                    }
                                }} className="text-blue-700 underline hover:text-blue-900 cursor-pointer text-left">
                                    Candidates Option Entry
                                </button>
                                <p className="text-black font-normal mt-1 mb-2">
                                    Please complete the payment to enable option entry.
                                </p>
                                <div className="h-px bg-gray-300 w-[85%]" />
                            </div>
                            <div>
                                <a href="#" className="text-black hover:text-gray-700 cursor-pointer">Option Entry Example</a>
                                <div className="h-px bg-gray-300 w-[85%] mt-3" />
                            </div>
                            <div>
                                <a href="#" className="text-black hover:text-gray-700 cursor-pointer">Detailed Option Work Sheet</a>
                                <div className="h-px bg-gray-300 w-[85%] mt-3" />
                            </div>
                            <div className="pb-4">
                                <a href="#" className="text-black hover:text-gray-700 cursor-pointer">Print Option Report</a>
                                <p className="mt-3">
                                    <a href="#" className="text-black hover:text-gray-700 cursor-pointer">Download Option Entry Report</a>
                                </p>
                                <p className="text-black font-normal mt-5 leading-relaxed pr-4">
                                    Click the 'Download Option Entry Report' link to download the option entry printout, which closes on 2026/06/25 00:00:00
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column */}
                    <div className="flex flex-col gap-6 md:gap-8">
                        {/* Box 2: ALLOTMENT */}
                        <div className="border border-gray-300 rounded shadow-sm flex flex-col bg-white">
                            <div className="bg-[#198754] text-white py-2 font-bold text-[14px] uppercase text-center flex justify-center items-center gap-2">
                                ALLOTMENT
                            </div>
                            <div className="p-3 text-[11px] leading-relaxed">
                                {mockAllotment ? (
                                    <div className="flex flex-col space-y-2.5 font-sans">
                                        <div className="grid grid-cols-[105px_1fr] gap-1">
                                            <div className="text-gray-800">Allotment<br />Session:</div>
                                            <div className="text-gray-600">1</div>
                                        </div>
                                        <div className="grid grid-cols-[105px_1fr] gap-1">
                                            <div className="text-gray-800">Candidate<br />Name:</div>
                                            <div className="text-gray-600 uppercase">{userProfile?.name || 'CANDIDATE'}</div>
                                        </div>
                                        <div className="grid grid-cols-[105px_1fr] gap-1">
                                            <div className="text-gray-800">Candidate<br />Category:</div>
                                            <div className="text-gray-600 uppercase">{userProfile?.category || 'GM'}</div>
                                        </div>
                                        <div className="grid grid-cols-[105px_1fr] gap-1">
                                            <div className="text-gray-800">College<br />Name:</div>
                                            <div className="text-gray-600 uppercase">{mockAllotment.collegeName}</div>
                                        </div>
                                        <div className="grid grid-cols-[105px_1fr] gap-1">
                                            <div className="text-gray-800">Course<br />Name:</div>
                                            <div className="text-gray-600 uppercase">{mockAllotment.branchName} ({mockAllotment.branchId})</div>
                                        </div>
                                        <div className="grid grid-cols-[105px_1fr] gap-1">
                                            <div className="text-gray-800 font-bold mt-1">Fees:</div>
                                            <div className="text-gray-600 mt-1">Rs. {mockAllotment.collegeFees?.replace(/,/g, '') || '0'}</div>
                                        </div>
                                        <div className="grid grid-cols-[105px_1fr] gap-1">
                                            <div className="text-gray-800 font-bold">Fees Paid:</div>
                                            <div className="text-gray-600">Rs. 0</div>
                                        </div>
                                        <div className="grid grid-cols-[105px_1fr] gap-1">
                                            <div className="text-gray-800 font-bold">Balance<br />Fees:</div>
                                            <div className="text-gray-600">Rs. {mockAllotment.collegeFees?.replace(/,/g, '') || '0'}</div>
                                        </div>
                                        <div className="mt-4 flex justify-center border-t border-gray-100 pt-3">
                                            <button onClick={() => onNavigate('allotment_auth')} className="text-blue-700 underline hover:text-blue-900 cursor-pointer text-[10px]">
                                                First Round Provisional Allotment Results
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center min-h-[140px]">
                                        <div className="bg-[#f2f2f2] border border-gray-300 text-black text-[11px] font-bold px-4 py-4 text-center w-full max-w-[90%] shadow-inner rounded-sm">
                                            <button onClick={() => onNavigate('allotment_auth')} className="text-blue-700 underline hover:text-blue-900 cursor-pointer">
                                                First Round Provisional Allotment Results
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Box 3: ADMISSION */}
                        <div className="border border-gray-400 flex flex-col bg-white">
                            <div className="bg-[#1C2833] text-white text-center py-2 font-bold text-[13px] uppercase">
                                ADMISSION
                            </div>
                            <div className="p-5 flex flex-col gap-4 text-[11px] font-bold min-h-[140px]">
                                <a href="#" onClick={(e) => { e.preventDefault(); alert('This is a demo site, no payments to be made on this site'); }} className="text-blue-700 underline hover:text-blue-900 w-fit">Pay Online</a>
                                <div className="h-px bg-gray-200 w-full my-1" />
                                <a href="#" onClick={(e) => { e.preventDefault(); alert('This is a demo site, no payments to be made on this site'); }} className="text-blue-700 underline hover:text-blue-900 w-fit">Payment Details</a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div>
                        {/* Box 4: ACCOUNT SETTINGS */}
                        <div className="border border-gray-400 flex flex-col bg-white min-h-[180px]">
                            <div
                                className="bg-[#FFA500] hover:bg-[#CC8400] text-white text-center py-2 font-bold text-[13px] uppercase cursor-pointer transition-colors"
                                onClick={() => onNavigate('profile')}
                            >
                                ACCOUNT SETTINGS
                            </div>
                            <div className="p-4 flex-1 flex flex-col gap-2 text-[11px] font-bold text-black mt-2 px-6">
                                <div className="flex">
                                    <span className="w-24">CET No</span>
                                    <span>: {userProfile.kcetNumber || 'Not set'}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-24">Name</span>
                                    <span className="truncate">: {userProfile.studentName || 'Not set'}</span>
                                </div>
                                <div className="flex">
                                    <span className="w-24">Rank</span>
                                    <span>: {userProfile.rank || 'Not set'}</span>
                                </div>
                                <div className="flex mt-2 text-blue-700 italic font-normal text-[10px]">
                                    Click 'Account Settings' above to edit.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simulation Control Panel */}
            <div className="w-full max-w-[1300px] mx-auto px-4 md:px-8 pb-6">
                <div className="border border-dashed border-amber-400 bg-amber-50 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-[11px] font-black text-amber-800 uppercase tracking-widest">Simulation Control Panel</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    const confirmed = window.confirm(
                                        `Advance to Round ${(globalConfig?.currentRound || 1) + 1}?`
                                    );
                                    if (!confirmed) return;
                                    setMockAllotment(null);
                                    setSelectedChoice(null);
                                    setChoiceSubmitted(false);
                                    setPreviousAllotment(null);
                                    const keysToRemove: string[] = [];
                                    for (let i = 0; i < localStorage.length; i++) {
                                        const key = localStorage.key(i);
                                        if (key) keysToRemove.push(key);
                                    }
                                    keysToRemove.forEach(key => {
                                        if (
                                            key === 'sim_mock_allotment' ||
                                            key === 'sim_selected_choice' ||
                                            key === 'sim_choice_submitted' ||
                                            key === 'sim_previous_allotment'
                                        ) {
                                            localStorage.removeItem(key);
                                        }
                                    });
                                    alert(`Advanced to Round ${(globalConfig?.currentRound || 1) + 1}.`);
                                }}
                                className="flex items-center gap-1.5 px-4 py-2 bg-[#00529B] hover:bg-[#003d75] text-white text-[11px] font-black uppercase tracking-wider rounded transition-colors shadow-sm"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Next Round
                            </button>

                            <button
                                onClick={() => {
                                    const confirmed = window.confirm(
                                        'Reset ALL simulation data?\n\nThis will permanently clear:\n All option entries\n All allotment results\n All submitted choices\n All candidate profiles\n\nThis cannot be undone.'
                                    );
                                    if (!confirmed) return;
                                    const keysToRemove: string[] = [];
                                    for (let i = 0; i < localStorage.length; i++) {
                                        const key = localStorage.key(i);
                                        if (key && (key.startsWith('sim_') || key.startsWith('simulation_state_'))) {
                                            keysToRemove.push(key);
                                        }
                                    }
                                    keysToRemove.forEach(key => localStorage.removeItem(key));
                                    setOptions({});
                                    setMockAllotment(null);
                                    setSelectedChoice(null);
                                    setChoiceSubmitted(false);
                                    setPreviousAllotment(null);
                                    setUserProfile({
                                        studentName: '',
                                        kcetNumber: '',
                                        rank: '',
                                        category: 'GM',
                                        isKannadaMedium: false,
                                        isRural: false,
                                        isHydKar: false,
                                        gender: 'Male'
                                    });
                                    alert('✅ All simulation data has been reset.');
                                }}
                                className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-300 text-[11px] font-black uppercase tracking-wider rounded transition-colors shadow-sm"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Reset Data
                            </button>
                        </div>
                    </div>
                    <p className="text-[10px] text-amber-700 mt-2 font-medium">
                        Round {globalConfig?.currentRound || 1} active · <span className="font-bold">Next Round</span> clears allotment results while preserving option lists · <span className="font-bold">Reset Data</span> wipes all simulation data
                    </p>
                </div>
            </div>

            <PageFooter />
        </div>
    );
}

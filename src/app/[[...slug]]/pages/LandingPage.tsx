'use client';

import React from 'react';

import { LandingHeader } from '@/components/DashboardHeader';
import PageFooter from '@/components/PageFooter';
import { getRoundLabel } from '@/lib/utils/cutoff-link';

interface LandingPageProps {
    onNavigate: (step: string) => void;
    onLogout: () => void;
    userProfile: any;
    mockAllotment: any;
    hasAgreedDeclaration: boolean;
    globalConfig: any;
    setGlobalConfig: (v: any) => void;
    setMockAllotment: (v: any) => void;
    selectedChoice: number | null;
    setSelectedChoice: (v: number | null) => void;
    choiceSubmitted: boolean;
    setChoiceSubmitted: (v: boolean) => void;
    setPreviousAllotment: (v: any) => void;
    setOptions: (v: any) => void;
    setUserProfile: (v: any) => void;
    handleDownloadReport?: () => void;
}

export default function LandingPage({
    onNavigate,
    onLogout,
    userProfile,
    mockAllotment,
    hasAgreedDeclaration,
    globalConfig,
    setGlobalConfig,
    setMockAllotment,
    selectedChoice,
    setSelectedChoice,
    choiceSubmitted,
    setChoiceSubmitted,
    setPreviousAllotment,
    setOptions,
    setUserProfile,
    handleDownloadReport,
}: LandingPageProps) {
    const currentRound = globalConfig?.currentRound ?? 0;
    const currentRoundLabel = getRoundLabel(currentRound, 'long');
    const nextRoundLabel = getRoundLabel(currentRound + 1, 'long');
    const resultLabel = `${currentRoundLabel} Provisional Allotment Results`;

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
            <LandingHeader
                onNavigate={onNavigate}
                onLogout={onLogout}
                userProfile={userProfile}
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
                                    if (choiceSubmitted && (selectedChoice === 1 || selectedChoice === 4)) {
                                        alert(selectedChoice === 1 ? "Option entry is locked because you have accepted your allotted seat (Choice 1)." : "Option entry is locked because you have quit the counseling process (Choice 4).");
                                        return;
                                    }

                                    if (hasAgreedDeclaration) {
                                        if (userProfile.kcetNumber && userProfile.studentName && userProfile.rank) {
                                            onNavigate('entry');
                                        } else {
                                            onNavigate('profile');
                                        }
                                    } else {
                                        onNavigate('declaration');
                                    }
                                }} className={`underline hover:text-blue-900 cursor-pointer text-left ${(choiceSubmitted && (selectedChoice === 1 || selectedChoice === 4)) ? 'text-gray-500' : 'text-blue-700'}`}>
                                    Candidates Option Entry
                                </button>
                                <p className="text-black font-normal mt-1 mb-2">
                                    {(choiceSubmitted && (selectedChoice === 1 || selectedChoice === 4)) ? (
                                        <span className="text-red-600">Option entry is locked.</span>
                                    ) : choiceSubmitted ? (
                                        <span className="text-blue-700">Modify your choices for the next round.</span>
                                    ) : (
                                        'Please complete the payment to enable option entry.'
                                    )}
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
                                    <button onClick={() => {
                                        if (handleDownloadReport) handleDownloadReport();
                                    }} className="text-black underline font-bold hover:text-gray-700 cursor-pointer">
                                        Download Option Entry Report
                                    </button>
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
                                <div className="flex flex-col items-center justify-center min-h-[140px] gap-3">
                                    {mockAllotment ? (
                                        <div className="w-full flex flex-col px-2 pb-2">
                                            <table className="w-full border-collapse text-[11px] mb-4 text-left">
                                                <tbody>
                                                    <tr className="border-b border-gray-100">
                                                        <td className="py-2 pr-2 text-gray-600 font-bold w-[130px]">Allotment Session:</td>
                                                        <td className="py-2 text-gray-900">{currentRoundLabel}</td>
                                                    </tr>
                                                    <tr className="border-b border-gray-100">
                                                        <td className="py-2 pr-2 text-gray-600 font-bold">Candidate Name:</td>
                                                        <td className="py-2 text-gray-900 uppercase">{userProfile?.studentName || 'CANDIDATE'}</td>
                                                    </tr>
                                                    <tr className="border-b border-gray-100">
                                                        <td className="py-2 pr-2 text-gray-600 font-bold">Candidate Category:</td>
                                                        <td className="py-2 text-gray-900 uppercase">{userProfile?.category || 'GM'}</td>
                                                    </tr>
                                                    <tr className="border-b border-gray-100">
                                                        <td className="py-2 pr-2 text-gray-600 font-bold">College Name:</td>
                                                        <td className="py-2 text-gray-900 uppercase">{mockAllotment.collegeName}</td>
                                                    </tr>
                                                    <tr className="border-b border-gray-100">
                                                        <td className="py-2 pr-2 text-gray-600 font-bold">Course Name:</td>
                                                        <td className="py-2 text-gray-900 uppercase">{mockAllotment.branchName}</td>
                                                    </tr>
                                                    <tr className="border-b border-gray-100">
                                                        <td className="py-2 pr-2 text-gray-600 font-bold">Fees:</td>
                                                        <td className="py-2 text-gray-900">Rs. 96k - 1.07L</td>
                                                    </tr>
                                                    <tr className="border-b border-gray-100">
                                                        <td className="py-2 pr-2 text-gray-600 font-bold">Fees Paid:</td>
                                                        <td className="py-2 text-gray-900">Rs. 0</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="py-2 pr-2 text-gray-600 font-bold">Balance Fees:</td>
                                                        <td className="py-2 text-gray-900">Rs. 96k - 1.07L</td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            {!choiceSubmitted ? (
                                                <div className="text-center w-full">
                                                    <button onClick={() => onNavigate('allotment_auth')} className="text-blue-700 underline hover:text-blue-900 cursor-pointer text-[11px] font-bold">
                                                        {resultLabel}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="bg-[#e6f2ff] border border-[#b3d4ff] text-black text-[11px] font-bold px-4 py-3 text-center w-full shadow-inner rounded-sm mt-2">
                                                    <p className="text-blue-900 font-bold mb-2">Simulation status: Choice {selectedChoice} Recorded</p>

                                                    {selectedChoice === 1 && (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <p className="text-green-700 text-[10px]">Please proceed to pay fees and download admission order.</p>
                                                        </div>
                                                    )}

                                                    {(selectedChoice === 2 || selectedChoice === 3) && (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <p className="text-amber-700 text-[10px]">Waiting for next round.</p>
                                                            <button
                                                                onClick={() => {
                                                                    const confirmed = window.confirm(`Advance to ${nextRoundLabel}?`);
                                                                    if (confirmed) {
                                                                        setMockAllotment(null); setSelectedChoice(null); setChoiceSubmitted(false); setPreviousAllotment(null);
                                                                        const keysToRemove: string[] = [];
                                                                        for (let i = 0; i < localStorage.length; i++) {
                                                                            const key = localStorage.key(i);
                                                                            if (key && ['sim_mock_allotment', 'sim_selected_choice', 'sim_choice_submitted', 'sim_previous_allotment'].includes(key)) {
                                                                                keysToRemove.push(key);
                                                                            }
                                                                        }
                                                                        keysToRemove.forEach(key => localStorage.removeItem(key));
                                                                        const nextRound = currentRound + 1;
                                                                        if (setGlobalConfig) setGlobalConfig({ ...globalConfig, currentRound: nextRound });
                                                                        alert(`Advanced to ${getRoundLabel(nextRound, 'long')}.`);
                                                                        onNavigate('allotment_auth');
                                                                    }
                                                                }}
                                                                className="mt-2 bg-[#00529B] hover:bg-[#003d75] text-white px-3 py-1.5 rounded font-bold text-[10px] uppercase shadow-sm w-full"
                                                            >
                                                                {nextRoundLabel} Provisional Allotment Results
                                                            </button>
                                                        </div>
                                                    )}

                                                    {selectedChoice === 4 && (
                                                        <p className="text-red-600 text-[10px]">You have exited the counseling process.</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-[#f2f2f2] border border-gray-300 text-black text-[11px] font-bold px-4 py-4 text-center w-full max-w-[90%] shadow-inner rounded-sm">
                                            <button onClick={() => onNavigate('allotment_auth')} className="text-blue-700 underline hover:text-blue-900 cursor-pointer">
                                                {resultLabel}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Box 3: ADMISSION */}
                        <div className="border border-gray-400 flex flex-col bg-white">
                            <div className="bg-[#1C2833] text-white text-center py-2 font-bold text-[13px] uppercase">
                                ADMISSION
                            </div>
                            <div className="p-5 flex flex-col gap-4 text-[11px] font-bold min-h-[140px]">
                                {mockAllotment ? (
                                    <>
                                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('choice_entry'); }} className="text-blue-700 underline hover:text-blue-900 w-fit">
                                            Choice Entry (Choice Print)
                                        </a>
                                        <div className="h-px bg-gray-200 w-full my-1" />
                                        {(choiceSubmitted && selectedChoice === 1) ? (
                                            <a href="#" onClick={(e) => { e.preventDefault(); alert('This is a demo site. In real KCET, you would pay fees here.'); }} className="text-green-700 font-bold underline hover:text-green-900 w-fit">
                                                Pay Fees / Download Admission Order
                                            </a>
                                        ) : (
                                            <a href="#" onClick={(e) => { e.preventDefault(); alert('Payment is not available or not required for your choice.'); }} className="text-blue-700 underline hover:text-blue-900 w-fit">
                                                Payment Details
                                            </a>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <a href="#" onClick={(e) => { e.preventDefault(); alert('This is a demo site, no payments to be made on this site'); }} className="text-blue-700 underline hover:text-blue-900 w-fit">Pay Online</a>
                                        <div className="h-px bg-gray-200 w-full my-1" />
                                        <a href="#" onClick={(e) => { e.preventDefault(); alert('This is a demo site, no payments to be made on this site'); }} className="text-blue-700 underline hover:text-blue-900 w-fit">Payment Details</a>
                                    </>
                                )}
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

                        {/* Box 5: CREDITS & PRIVACY POLICY */}
                        <div className="border border-gray-400 flex flex-col bg-white mt-6 md:mt-8">
                            <div className="bg-[#6c757d] text-white text-center py-2 font-bold text-[13px] uppercase">
                                CREDITS & PRIVACY POLICY
                            </div>
                            <div className="p-4 flex-1 flex flex-col gap-3 text-[11px] text-gray-800">
                                <div>
                                    <span className="font-bold block mb-1">Credits:</span>
                                    <div className="flex items-center gap-1 mt-1">
                                        <svg className="w-4 h-4 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                                        </svg>
                                        <span>flux_ai (aka Yashwin)</span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <svg className="w-4 h-4 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                                        </svg>
                                        <span>Azalea</span>
                                    </div>
                                </div>
                                <hr className="border-gray-200" />
                                <div>
                                    <span className="font-bold">Privacy Policy & Disclaimer:</span><br />
                                    This platform is built purely for educational purposes and is <span className="font-bold text-red-600">NOT</span> affiliated with the official Karnataka Examinations Authority (KEA). No legal actions can be taken against the creators. We do not collect, transmit, or store any of your personal data on external servers; all data remains completely secured within your local browser storage.
                                </div>
                                <hr className="border-gray-200" />
                                <div className="italic text-gray-600 font-medium">
                                    * Allotments are simulated based on the official 2025 Round 1, 2, and 3 cutoffs.
                                </div>
                                <div className="mt-2 text-center">
                                    <button
                                        onClick={() => onNavigate('privacy')}
                                        className="text-[#000080] hover:text-blue-900 underline font-bold"
                                    >
                                        Click here to read the full Privacy Policy & Legal Disclaimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



            <PageFooter />
        </div>
    );
}

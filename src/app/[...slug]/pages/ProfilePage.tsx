'use client';

import React, { useState } from 'react';
import { RefreshCw, Trash2, X, Download, Upload, Import } from 'lucide-react';
import { getRoundLabel } from '@/lib/utils/cutoff-link';

interface ProfilePageProps {
    userProfile: any;
    setUserProfile: (profile: any) => void;
    onNavigate: (step: string) => void;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    isScraping: boolean;
    categories: string[];
    handleProfileSubmit: (e: React.FormEvent) => Promise<void>;
    globalConfig?: any;
    setGlobalConfig?: (config: any) => void;
    setMockAllotment?: (allotment: any) => void;
    setSelectedChoice?: (choice: number | null) => void;
    setChoiceSubmitted?: (submitted: boolean) => void;
    setPreviousAllotment?: (allotment: any) => void;
    setOptions?: (options: any) => void;
    handleImportFromChoiceList?: () => void;
    handleExportJSON?: () => void;
    handleImportJSON?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleImportPDF?: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleDownloadAllRoundsReport?: () => Promise<void>;
}

export default function ProfilePage({
    userProfile,
    setUserProfile,
    onNavigate,
    handleFileUpload,
    isScraping,
    categories,
    handleProfileSubmit,
    globalConfig,
    setGlobalConfig,
    setMockAllotment,
    setSelectedChoice,
    setChoiceSubmitted,
    setPreviousAllotment,
    setOptions,
    handleImportFromChoiceList,
    handleExportJSON,
    handleImportJSON,
    handleImportPDF,
    handleDownloadAllRoundsReport
}: ProfilePageProps) {
    const currentRound = globalConfig?.currentRound ?? 0;
    const nextRound = currentRound + 1;
    const isLastRound = currentRound === (globalConfig?.counselingYear === '2026' ? 4 : 3);

    const [showResetModal, setShowResetModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [resetOptionsChecked, setResetOptionsChecked] = useState(false);
    const [resetProfileChecked, setResetProfileChecked] = useState(false);
    const [resetAllotmentChecked, setResetAllotmentChecked] = useState(true);

    const handleSelectiveReset = () => {
        const keysToRemove: string[] = [];
        let anyReset = false;

        if (resetAllotmentChecked) {
            keysToRemove.push('sim_mock_allotment', 'sim_selected_choice', 'sim_choice_submitted', 'sim_previous_allotment');
            if (setMockAllotment) setMockAllotment(null);
            if (setSelectedChoice) setSelectedChoice(null);
            if (setChoiceSubmitted) setChoiceSubmitted(false);
            if (setPreviousAllotment) setPreviousAllotment(null);
            if (setGlobalConfig) setGlobalConfig({ ...globalConfig, currentRound: 0 });
            anyReset = true;
        }

        if (resetOptionsChecked) {
            keysToRemove.push('sim_options_list');
            if (setOptions) setOptions({});
            anyReset = true;
        }

        if (resetProfileChecked) {
            keysToRemove.push('sim_user_profile', 'sim_pdf_extracted_data');
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
            anyReset = true;
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        setShowResetModal(false);
        if (anyReset) {
            alert('✅ Selected data has been reset.');
            if (resetProfileChecked) {
                window.location.href = '/login';
            }
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-4">
            <div className="border border-gray-400 flex flex-col bg-white">
                <div className="bg-[#FFA500] text-white py-[6px] px-4 font-bold text-[13px] uppercase flex justify-between items-center">
                    <span>Account Settings - Candidate Profile</span>
                </div>

                <form onSubmit={handleProfileSubmit} className="p-6">
                    <div className="flex justify-end mb-4">
                        <label className="bg-[#0000FF] hover:bg-blue-700 text-white cursor-pointer px-3 py-[4px] text-[11px] font-bold rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all">
                            {isScraping ? 'Scraping...' : 'Upload KCET Result PDF (Auto Scrape)'}
                            <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={isScraping}
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1">
                            <label className="text-[12px] font-bold text-black">Student Name</label>
                            <input
                                type="text"
                                value={userProfile.studentName}
                                onChange={(e) => setUserProfile({ ...userProfile, studentName: e.target.value })}
                                className="w-full border border-gray-400 px-2 py-1 text-[12px] focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[12px] font-bold text-black">KCET Number</label>
                            <input
                                type="text"
                                value={userProfile.kcetNumber}
                                onChange={(e) => setUserProfile({ ...userProfile, kcetNumber: e.target.value })}
                                className="w-full border border-gray-400 px-2 py-1 text-[12px] focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[12px] font-bold text-black">General Rank *</label>
                            <input
                                type="text"
                                required
                                value={userProfile.rank}
                                onChange={(e) => setUserProfile({ ...userProfile, rank: e.target.value })}
                                className="w-full border border-gray-400 px-2 py-1 text-[12px] focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-[12px] font-bold text-black">Reservation Category</label>
                            <select
                                value={userProfile.category}
                                onChange={(e) => setUserProfile({ ...userProfile, category: e.target.value })}
                                className="w-full border border-gray-400 px-2 py-1 text-[12px] focus:outline-none focus:border-blue-500"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="text-[12px] font-bold text-black mb-2 block">Other Details</label>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={userProfile.isKannadaMedium}
                                    onChange={(e) => setUserProfile({ ...userProfile, isKannadaMedium: e.target.checked })}
                                    className="mt-[1px]"
                                />
                                <span className="text-[12px] font-bold text-black">Kannada Medium Candidate</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={userProfile.isRural}
                                    onChange={(e) => setUserProfile({ ...userProfile, isRural: e.target.checked })}
                                    className="mt-[1px]"
                                />
                                <span className="text-[12px] font-bold text-black">Rural Candidate</span>
                            </label>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button
                            type="submit"
                            className="bg-[#0000FF] hover:bg-blue-700 text-white px-6 py-[4px] rounded-[3px] font-bold text-[13px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all"
                        >
                            Save & Continue
                        </button>
                    </div>
                </form>
            </div>

            {/* Data & Options Management */}
            <div className="mt-8 border border-gray-400 flex flex-col bg-white">
                <div className="bg-[#00796B] text-white py-[6px] px-4 font-bold text-[13px] uppercase flex justify-between items-center">
                    <span>Data & Options Management</span>
                </div>
                <div className="p-6">
                    <p className="text-[12px] text-gray-700 font-bold mb-4">
                        Manage your simulator option entries here. You can import choices from your Choice List or JSON file, and export your options list.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setShowImportModal(true)}
                            className="bg-[#00796B] hover:bg-[#004D40] text-white text-[11px] font-bold uppercase px-3 py-2 rounded transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                            title="Import options list"
                        >
                            <Import className="w-3.5 h-3.5" />
                            Import List
                        </button>
                        {handleExportJSON && (
                            <button
                                type="button"
                                onClick={handleExportJSON}
                                className="bg-[#558B2F] hover:bg-[#33691E] text-white text-[11px] font-bold uppercase px-3 py-2 rounded transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                                title="Download a backup file"
                            >
                                <Upload className="w-3.5 h-3.5" />
                                Export List
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Simulation Control Panel */}
            <div className="mt-8">
                <div className="border border-dashed border-amber-400 bg-amber-50 rounded-lg p-4">
                    <div className="flex flex-col gap-4">
                        {/* Multi-Round Report Download for Final Round */}
                        {isLastRound && handleDownloadAllRoundsReport && (
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-200 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                                    <span className="text-[11px] font-black text-amber-800 uppercase tracking-widest">Final Simulation Summary</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleDownloadAllRoundsReport}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-black uppercase tracking-wider rounded transition-colors shadow-sm"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Download All Rounds Report (PDF)
                                </button>
                            </div>
                        )}
                        {/* Controls Row */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[11px] font-black text-amber-800 uppercase tracking-widest">Simulation Controls</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {currentRound < 3 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const confirmed = window.confirm(`Advance to Round ${currentRound + 1} Allotment Phase?`);
                                            if (!confirmed) return;
                                            
                                            if (setMockAllotment) setMockAllotment(null);
                                            if (setSelectedChoice) setSelectedChoice(null);
                                            if (setChoiceSubmitted) setChoiceSubmitted(false);
                                            const keysToRemove = [];
                                            for (let i = 0; i < localStorage.length; i++) {
                                                const key = localStorage.key(i);
                                                if (key && ['sim_mock_allotment', 'sim_selected_choice', 'sim_choice_submitted'].includes(key)) {
                                                    keysToRemove.push(key);
                                                }
                                            }
                                            keysToRemove.forEach(key => localStorage.removeItem(key));
                                            if (setGlobalConfig) setGlobalConfig({ ...globalConfig, counselingYear: '2026', currentRound: currentRound + 1 });
                                            alert(`Advanced to Round ${currentRound + 1}.`);
                                        }}
                                        className="bg-[#00529B] text-white hover:bg-blue-800 font-bold px-3 py-1.5 rounded text-xs shadow"
                                    >
                                        Proceed to Round {currentRound + 1} →
                                    </button>
                                )}

                                {currentRound > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const confirmed = window.confirm(
                                                `Move back to ${getRoundLabel(currentRound - 1, 'long')}? Allotment results for the current round will be cleared.`
                                            );
                                            if (!confirmed) return;
                                            if (setMockAllotment) setMockAllotment(null);
                                            if (setSelectedChoice) setSelectedChoice(null);
                                            if (setChoiceSubmitted) setChoiceSubmitted(false);
                                            if (setPreviousAllotment) setPreviousAllotment(null);
                                            const keysToRemove: string[] = [];
                                            for (let i = 0; i < localStorage.length; i++) {
                                                const key = localStorage.key(i);
                                                if (key && ['sim_mock_allotment', 'sim_selected_choice', 'sim_choice_submitted', 'sim_previous_allotment'].includes(key)) {
                                                    keysToRemove.push(key);
                                                }
                                            }
                                            keysToRemove.forEach(key => localStorage.removeItem(key));
                                            if (setGlobalConfig) setGlobalConfig({ ...globalConfig, currentRound: currentRound - 1 });
                                            alert(`Moved back to ${getRoundLabel(currentRound - 1, 'long')}.`);
                                        }}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-[11px] font-black uppercase tracking-wider rounded transition-colors shadow-sm"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5 rotate-180" />
                                        Prev Round
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setShowResetModal(true)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-300 text-[11px] font-black uppercase tracking-wider rounded transition-colors shadow-sm"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Reset Data
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className="text-[10px] text-amber-700 mt-2 font-medium">
                        {getRoundLabel(currentRound, 'long')} active &nbsp;•&nbsp; <span className="font-bold">Next Round</span> clears allotment results &nbsp;•&nbsp; <span className="font-bold">Reset Data</span> wipes all simulation data
                    </p>
                </div>
            </div>

            {/* Selective Reset Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white max-w-md w-full border-t-4 border-t-red-600 rounded-lg shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h3 className="font-bold text-red-600 flex items-center gap-2">
                                <Trash2 className="w-5 h-5" />
                                Selective Reset
                            </h3>
                            <button onClick={() => setShowResetModal(false)} className="text-gray-400 hover:text-black">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <p className="text-[13px] text-gray-700 font-medium">
                                Choose which data you want to clear from the simulator:
                            </p>
                            
                            <label className="flex items-start gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="mt-1 w-4 h-4 text-red-600"
                                    checked={resetAllotmentChecked}
                                    onChange={(e) => setResetAllotmentChecked(e.target.checked)}
                                />
                                <div>
                                    <div className="font-bold text-[13px] text-black">Allotment Results & Round Progress</div>
                                    <div className="text-[11px] text-gray-500">Clears current round results, choices, and resets back to Mock Round.</div>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="mt-1 w-4 h-4 text-red-600"
                                    checked={resetOptionsChecked}
                                    onChange={(e) => setResetOptionsChecked(e.target.checked)}
                                />
                                <div>
                                    <div className="font-bold text-[13px] text-black">Option Entries</div>
                                    <div className="text-[11px] text-gray-500">Deletes your saved list of preferred colleges.</div>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="mt-1 w-4 h-4 text-red-600"
                                    checked={resetProfileChecked}
                                    onChange={(e) => setResetProfileChecked(e.target.checked)}
                                />
                                <div>
                                    <div className="font-bold text-[13px] text-black">Candidate Profile</div>
                                    <div className="text-[11px] text-gray-500">Clears your rank, category, and name, and logs you out.</div>
                                </div>
                            </label>
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-200">
                            <button 
                                onClick={() => setShowResetModal(false)}
                                className="px-4 py-2 text-[12px] font-bold text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSelectiveReset}
                                disabled={!resetAllotmentChecked && !resetOptionsChecked && !resetProfileChecked}
                                className="px-4 py-2 text-[12px] font-bold text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                Confirm Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Options Modal */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white max-w-md w-full border-t-4 border-t-[#00796B] rounded-lg shadow-2xl overflow-hidden font-sans">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200">
                            <h3 className="font-bold text-[#00796B] flex items-center gap-2">
                                <Import className="w-5 h-5" />
                                Import Options List
                            </h3>
                            <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-black">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <p className="text-[13px] text-gray-700 font-medium">
                                Choose how you want to import your options:
                            </p>
                            
                            <div 
                                onClick={() => document.getElementById('import-json-input')?.click()}
                                className="flex items-start gap-3 p-4 border border-gray-200 rounded hover:bg-[#E0F2F1]/30 hover:border-[#00796B] cursor-pointer transition-all group"
                            >
                                <Upload className="w-5 h-5 text-gray-500 group-hover:text-[#00796B] mt-1 shrink-0" />
                                <div>
                                    <div className="font-bold text-[13px] text-black group-hover:text-[#00796B]">Upload JSON Backup File</div>
                                    <div className="text-[11px] text-gray-500 font-normal">Restore options from a previously saved options list file on your device.</div>
                                </div>
                            </div>

                            <div 
                                onClick={() => document.getElementById('import-pdf-input')?.click()}
                                className="flex items-start gap-3 p-4 border border-gray-200 rounded hover:bg-[#E3F2FD]/40 hover:border-blue-600 cursor-pointer transition-all group"
                            >
                                <Upload className="w-5 h-5 text-gray-500 group-hover:text-blue-600 mt-1 shrink-0" />
                                <div>
                                    <div className="font-bold text-[13px] text-black group-hover:text-blue-600">Upload KEA Option Entry PDF</div>
                                    <div className="text-[11px] text-gray-500 font-normal">Auto-scrape choices from your official KEA option entry downloaded PDF.</div>
                                </div>
                            </div>

                            <div 
                                onClick={() => {
                                    if (handleImportFromChoiceList) handleImportFromChoiceList();
                                    setShowImportModal(false);
                                }}
                                className="flex items-start gap-3 p-4 border border-gray-200 rounded hover:bg-[#E8F5E9]/50 hover:border-green-600 cursor-pointer transition-all group"
                            >
                                <Import className="w-5 h-5 text-gray-500 group-hover:text-green-600 mt-1 shrink-0" />
                                <div>
                                    <div className="font-bold text-[13px] text-black group-hover:text-green-600">Load from Choice List Page</div>
                                    <div className="text-[11px] text-gray-500 font-normal">Import the college & branch selections you saved in the choice list section.</div>
                                </div>
                            </div>

                            <input 
                                type="file" 
                                id="import-json-input"
                                accept=".json" 
                                onChange={(e) => {
                                    if (handleImportJSON) handleImportJSON(e);
                                    setShowImportModal(false);
                                }} 
                                className="hidden" 
                            />

                            <input 
                                type="file" 
                                id="import-pdf-input"
                                accept=".pdf" 
                                onChange={async (e) => {
                                    if (handleImportPDF) await handleImportPDF(e);
                                    setShowImportModal(false);
                                }} 
                                className="hidden" 
                            />
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-end border-t border-gray-200">
                            <button 
                                onClick={() => setShowImportModal(false)}
                                className="px-4 py-2 text-[12px] font-bold text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

'use client';

import React from 'react';
import { RefreshCw, Trash2 } from 'lucide-react';
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
    setOptions
}: ProfilePageProps) {
    const currentRound = globalConfig?.currentRound ?? 0;
    const nextRound = currentRound + 1;

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

            {/* Simulation Control Panel */}
            <div className="mt-8">
                <div className="border border-dashed border-amber-400 bg-amber-50 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-[11px] font-black text-amber-800 uppercase tracking-widest">Simulation Control Panel</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    const confirmed = window.confirm(
                                        `Advance to ${getRoundLabel(nextRound, 'long')}?`
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
                                    if (setGlobalConfig) setGlobalConfig({ ...globalConfig, currentRound: nextRound });
                                    alert(`Advanced to ${getRoundLabel(nextRound, 'long')}.`);
                                }}
                                className="flex items-center gap-1.5 px-4 py-2 bg-[#00529B] hover:bg-[#003d75] text-white text-[11px] font-black uppercase tracking-wider rounded transition-colors shadow-sm"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Next Round
                            </button>

                            <button
                                type="button"
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
                                    if (setOptions) setOptions({});
                                    if (setMockAllotment) setMockAllotment(null);
                                    if (setSelectedChoice) setSelectedChoice(null);
                                    if (setChoiceSubmitted) setChoiceSubmitted(false);
                                    if (setPreviousAllotment) setPreviousAllotment(null);
                                    if (setGlobalConfig) setGlobalConfig({ currentRound: 0 });
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
                                    window.location.href = '/login';
                                }}
                                className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-300 text-[11px] font-black uppercase tracking-wider rounded transition-colors shadow-sm"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Reset Data
                            </button>
                        </div>
                    </div>
                    <p className="text-[10px] text-amber-700 mt-2 font-medium">
                        {getRoundLabel(currentRound, 'long')} active  <span className="font-bold">Next Round</span> clears allotment results while preserving option lists  <span className="font-bold">Reset Data</span> wipes all simulation data
                    </p>
                </div>
            </div>
        </div>
    );
}


'use client';

import React from 'react';

interface ProfilePageProps {
    userProfile: any;
    setUserProfile: (profile: any) => void;
    onNavigate: (step: string) => void;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    isScraping: boolean;
    categories: string[];
    handleProfileSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function ProfilePage({
    userProfile,
    setUserProfile,
    onNavigate,
    handleFileUpload,
    isScraping,
    categories,
    handleProfileSubmit,
}: ProfilePageProps) {
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
        </div>
    );
}

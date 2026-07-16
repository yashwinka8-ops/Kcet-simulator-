'use client';

import React, { useState } from 'react';
import { SimplePageHeader } from '@/components/DashboardHeader';
import PageFooter from '@/components/PageFooter';

interface LoginPageProps {
    onLogin: (cetNo: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
    const [cetNoInput, setCetNoInput] = useState('');
    const [isScanActive, setIsScanActive] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [hasAgreedToPrivacy, setHasAgreedToPrivacy] = useState(false);

    const handleCetLogin = () => {
        let trimmed = cetNoInput.trim().toUpperCase();
        if (!trimmed) {
            trimmed = `25U${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
            setCetNoInput(trimmed);
        }
        setShowPrivacyModal(true);
    };

    const handleAgreeAndLogin = () => {
        onLogin(cetNoInput.trim().toUpperCase());
    };

    return (
        <div className="min-h-screen bg-[#F0F4F9] flex flex-col font-sans">
            <SimplePageHeader />

            <div className="flex-1 flex flex-col items-center py-12 px-4 gap-6">

                {/* Main Action Card */}
                <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 w-full max-w-md border border-gray-100">

                    {/* Top Text Instruction */}
                    <div className="mb-6 border border-[#DDA31D] bg-[#FFFBF0] rounded-md p-3">
                        <p className="text-[12px] text-gray-700 text-center leading-relaxed">
                            You can find the QR code, Application No, Cet No on your verification slip.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-[#F8F9FA] rounded-md p-1 mb-6 border border-gray-200">
                        <button
                            onClick={() => setIsScanActive(true)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[14px] font-semibold rounded ${
                                isScanActive ? 'bg-[#18325C] text-white shadow' : 'text-gray-600 hover:text-gray-800'
                            } transition-all`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16v5h-5"/><path d="M21 21v-5h-5"/><path d="M21 21h-5v-5"/></svg>
                            Scan QR Code
                        </button>
                        <button
                            onClick={() => setIsScanActive(false)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[14px] font-semibold rounded ${
                                !isScanActive ? 'bg-[#18325C] text-white shadow' : 'text-gray-600 hover:text-gray-800'
                            } transition-all`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                            Enter CET No
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col items-center">
                        {isScanActive ? (
                            <>
                                {/* QR Scanner Box */}
                                <div className="bg-[#0f172a] rounded-lg w-[220px] h-[220px] relative flex items-center justify-center mb-4 shadow-inner">
                                    {/* Corner Brackets */}
                                    <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-[#DDA31D]"></div>
                                    <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-[#DDA31D]"></div>
                                    <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-[#DDA31D]"></div>
                                    <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-[#DDA31D]"></div>
                                </div>
                                <p className="text-[12px] text-gray-500 text-center mb-6">
                                    Point the camera at the QR code on<br />your verification slip
                                </p>

                                <div className="flex gap-4 w-full justify-center">
                                    <button className="flex items-center gap-2 bg-[#18325C] text-white px-5 py-2.5 rounded text-[14px] font-medium hover:bg-[#112341] transition-colors shadow">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                                        Start Scan
                                    </button>
                                    <button
                                        onClick={() => setIsScanActive(false)}
                                        className="flex items-center gap-2 bg-white text-gray-600 border border-gray-200 px-5 py-2.5 rounded text-[14px] font-medium hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
                                        Stop
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="w-full flex flex-col gap-4 mt-2">
                                <label className="text-[13px] font-semibold text-gray-700">Enter your CET Number</label>
                                <input
                                    type="text"
                                    value={cetNoInput}
                                    onChange={e => setCetNoInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleCetLogin())}
                                    className="w-full border border-gray-300 rounded px-4 py-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#18325C] focus:border-transparent transition-all shadow-sm"
                                    placeholder="e.g., 25UXXXX"
                                />
                                <button
                                    onClick={handleCetLogin}
                                    className="w-full mt-2 bg-[#18325C] hover:bg-[#112341] text-white py-3 rounded text-[14px] font-medium transition-colors shadow"
                                >
                                    Proceed to Login
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Receive OTP Via Section */}
                <div className="bg-[#F8F9FA] rounded-lg border border-gray-200 p-5 w-full max-w-md shadow-sm">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">
                        RECEIVE OTP VIA
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <button className="flex items-center gap-2 bg-[#18325C] text-white px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#112341] transition-colors shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                            SMS
                        </button>
                        <button className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-full text-[13px] font-medium hover:bg-gray-50 transition-colors shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                            WhatsApp
                        </button>
                        <button className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-full text-[13px] font-medium hover:bg-gray-50 transition-colors shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            Email
                        </button>
                    </div>
                </div>

            </div>

            <PageFooter />

            {/* Privacy Policy Modal */}
            {showPrivacyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-200 bg-[#f8f9fa] flex justify-between items-center">
                            <h2 className="text-lg font-bold text-[#0a3161]">Privacy Policy & Legal Disclaimer</h2>
                            <button onClick={() => setShowPrivacyModal(false)} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-sm text-gray-700">
                            <p><strong>1. Educational & Simulation Purposes Only</strong><br />
                                This platform (&quot;KCET Simulator&quot;) is built strictly for educational and demonstrative purposes. The mock allotments generated by this simulator are not real and do not guarantee you a seat in any institution.</p>

                            <p><strong>2. No Affiliation with KEA</strong><br />
                                This website is an independent community-driven project and is NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with the Karnataka Examinations Authority (KEA).</p>

                            <p><strong>3. Privacy & Data Storage</strong><br />
                                We deeply respect your privacy. We do not collect, transmit, share, or store any of your personal data on external servers. All the information you input (including CET Numbers, Names, Ranks, Categories, and Option Entries) is stored 100% locally in your device&apos;s browser storage.</p>

                            <p><strong>4. Accuracy of Cutoffs & Algorithm</strong><br />
                                All mock allotments provided on this platform are simulated based on the official KCET 2025 Round 1, Round 2, and Round 3 cutoff data. Our algorithm is an approximation.</p>

                            <p><strong>5. Legal Disclaimer & Liability Limitation</strong><br />
                                By using this simulator, you acknowledge and agree that no legal actions can be taken against the developers. The creators shall not be held liable for any direct, indirect, incidental, or consequential damages.</p>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 text-[#8B2065] rounded border-gray-300 focus:ring-[#8B2065] cursor-pointer"
                                    checked={hasAgreedToPrivacy}
                                    onChange={(e) => setHasAgreedToPrivacy(e.target.checked)}
                                />
                                <span className="text-sm font-medium text-gray-800">I have read, understood, and agree to the Privacy Policy & Legal Disclaimer.</span>
                            </label>

                            <div className="mt-4 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowPrivacyModal(false)}
                                    className="px-5 py-2 rounded text-gray-600 font-semibold hover:bg-gray-100 transition-colors text-sm border border-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAgreeAndLogin}
                                    disabled={!hasAgreedToPrivacy}
                                    className="px-5 py-2 rounded text-white font-semibold transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-[#8B2065] hover:bg-[#701A51]"
                                >
                                    Accept & Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

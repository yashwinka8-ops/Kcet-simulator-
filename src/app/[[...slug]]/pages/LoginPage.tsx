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
        <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: 'Arial, sans-serif' }}>
            <SimplePageHeader accentColor="#8B2065" />

            <div className="h-[2px] bg-black" />

            <div className="flex-1 flex items-center justify-center py-10 px-4">
                <div className="w-full max-w-xs">
                    <div className="flex items-center justify-center mb-0 w-full px-2">
                        <img
                            src="/ChatGPT%20Image%20Jun%207,%202026,%2011_35_02%20AM.png"
                            alt="KEA Banner"
                            className="w-full h-auto object-contain max-h-24"
                        />
                    </div>

                    <h1 className="text-[22px] font-bold text-center text-[#0a3161] mb-6 -mt-3">Option Entry Login</h1>

                    <div className="flex flex-col items-center gap-1.5 mb-3">
                        <div className="w-7 h-7 rounded-full bg-[#8B2065] text-white flex items-center justify-center text-sm font-bold shadow">
                            1
                        </div>
                        <p className="font-bold text-gray-700 text-sm text-center">Scan QR / Enter CETNO</p>
                        <p className="text-[11px] text-gray-500 text-center leading-snug">
                            You can find the QR, Application No, Cet No on<br />your verification slip.
                        </p>
                    </div>

                    {isScanActive ? (
                        <div className="border border-gray-300 rounded w-full h-36 flex flex-col items-center justify-center bg-gray-50 gap-2 mb-2">
                            <div className="w-8 h-8 border-4 border-[#8B2065] border-t-transparent rounded-full animate-spin" />
                            <p className="text-[11px] text-gray-500 font-medium">Camera Initializing...</p>
                            <p className="text-[10px] text-gray-400">Point QR code at the camera</p>
                        </div>
                    ) : (
                        <textarea
                            value={cetNoInput}
                            onChange={e => setCetNoInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleCetLogin())}
                            className="w-full border border-gray-400 rounded h-36 p-2.5 text-sm focus:outline-none focus:border-[#8B2065] resize-none mb-2 block"
                            placeholder=""
                        />
                    )}

                    <button
                        onClick={() => setIsScanActive(v => !v)}
                        className="w-full bg-[#8B2065] hover:bg-[#701A51] text-white py-2 rounded text-sm font-semibold mb-1 transition-colors"
                    >
                        {isScanActive ? 'Scanning...' : 'Start Scan'}
                    </button>

                    <div className="text-center mb-2">
                        <button
                            onClick={() => setIsScanActive(false)}
                            className="text-xs text-gray-600 hover:text-gray-800 underline-offset-2 hover:underline"
                        >
                            Stop Scan
                        </button>
                    </div>

                    <button
                        onClick={handleCetLogin}
                        className="w-full bg-[#8B2065] hover:bg-[#701A51] text-white py-2 rounded text-sm font-semibold transition-colors"
                    >
                        Login with CETNO
                    </button>
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
                            <p><strong>1. Educational & Simulation Purposes Only</strong><br/>
                            This platform ("KCET Simulator") is built strictly for educational and demonstrative purposes. The mock allotments generated by this simulator are not real and do not guarantee you a seat in any institution.</p>

                            <p><strong>2. No Affiliation with KEA</strong><br/>
                            This website is an independent community-driven project and is NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with the Karnataka Examinations Authority (KEA).</p>

                            <p><strong>3. Privacy & Data Storage</strong><br/>
                            We deeply respect your privacy. We do not collect, transmit, share, or store any of your personal data on external servers. All the information you input (including CET Numbers, Names, Ranks, Categories, and Option Entries) is stored 100% locally in your device's browser storage.</p>

                            <p><strong>4. Accuracy of Cutoffs & Algorithm</strong><br/>
                            All mock allotments provided on this platform are simulated based on the official KCET 2025 Round 1, Round 2, and Round 3 cutoff data. Our algorithm is an approximation.</p>

                            <p><strong>5. Legal Disclaimer & Liability Limitation</strong><br/>
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

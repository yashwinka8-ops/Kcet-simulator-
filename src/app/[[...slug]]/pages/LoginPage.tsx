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

    const handleCetLogin = () => {
        let trimmed = cetNoInput.trim().toUpperCase();
        if (!trimmed) {
            trimmed = `25U${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        }
        onLogin(trimmed);
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
        </div>
    );
}

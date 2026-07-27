'use client';

import React, { useState } from 'react';
import { SimplePageHeader } from '@/components/DashboardHeader';
import PageFooter from '@/components/PageFooter';

interface LoginPageProps {
    onLogin: (cetNo: string) => void;
}

// Custom SVG Icons matching the reference image exactly
const QRIcon = ({ className }: { className?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M7 7h.01" />
        <path d="M18 7h.01" />
        <path d="M18 18h.01" />
        <path d="M7 18h.01" />
    </svg>
);

const CETIcon = ({ className }: { className?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <rect x="8" y="8" width="8" height="8" rx="1" />
    </svg>
);

const SMSPixelIcon = () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <rect x="3" y="1" width="10" height="14" rx="2" fill="#2563EB" />
        <rect x="4.5" y="2.5" width="7" height="9" fill="#0F172A" />
        <rect x="5.5" y="3.5" width="2" height="2" fill="#EF4444" />
        <rect x="8.5" y="3.5" width="2" height="2" fill="#F59E0B" />
        <rect x="5.5" y="6.5" width="2" height="2" fill="#10B981" />
        <rect x="8.5" y="6.5" width="2" height="2" fill="#3B82F6" />
        <circle cx="8" cy="13.5" r="0.75" fill="#FFFFFF" />
    </svg>
);

const WhatsAppPurpleIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#C084FC">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
    </svg>
);

const EmailPurpleIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#C084FC">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.84 6.72 2.25L21 8" />
        <path d="M21 3v5h-5" />
    </svg>
);

export default function LoginPage({ onLogin }: LoginPageProps) {
    const [applicationNo, setApplicationNo] = useState('');
    const [cetNoInput, setCetNoInput] = useState('');
    const [otpChannel, setOtpChannel] = useState<'SMS' | 'WhatsApp' | 'Email'>('SMS');
    const [loginMethod, setLoginMethod] = useState<'qr' | 'cet'>('cet');
    const [captchaCode, setCaptchaCode] = useState(['4', 'K', 'X', 'X', '9', 'J']);
    const [captchaInput, setCaptchaInput] = useState('');
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [hasAgreedToPrivacy, setHasAgreedToPrivacy] = useState(false);

    const captchaColors = ['#1E3A8A', '#800000', '#006400', '#6B21A8', '#004B87', '#7C3AED'];
    const captchaOffsets = ['translate-y-0', 'translate-y-1', '-translate-y-1', 'translate-y-0.5', '-translate-y-0.5', 'translate-y-1'];

    const generateCaptcha = () => {
        const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        const newCode = [];
        for (let i = 0; i < 6; i++) {
            newCode.push(chars.charAt(Math.floor(Math.random() * chars.length)));
        }
        setCaptchaCode(newCode);
    };

    const handleCetLogin = () => {
        let trimmed = cetNoInput.trim().toUpperCase();
        if (!trimmed) {
            trimmed = `DG${Math.floor(100 + Math.random() * 900)}`;
            setCetNoInput(trimmed);
        }
        setShowPrivacyModal(true);
    };

    const handleAgreeAndLogin = () => {
        onLogin(cetNoInput.trim().toUpperCase() || 'DG052');
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans select-none">
            {/* Top Header */}
            <SimplePageHeader />

            {/* Main Login Form Container */}
            <div className="flex-1 flex items-center justify-center p-4 md:py-8">
                <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                    
                    {/* Header Banner on Card */}
                    <div className="bg-gradient-to-tr from-[#1B365D] to-[#254A80] text-white p-6 text-center flex flex-col items-center justify-center border-b-4 border-[#D99A29] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                        <h1 className="text-xl font-bold tracking-tight relative z-10">Option Entry Login</h1>
                        <p className="text-[11px] font-semibold tracking-wide text-slate-300 uppercase mt-1 relative z-10">
                            KARNATAKA EXAMINATIONS AUTHORITY
                        </p>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 md:p-8 space-y-6">

                        {/* Stepper Bar */}
                        <div className="flex items-center justify-between px-4 pb-2">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center">
                                <div className="w-9 h-9 rounded-full bg-[#1B365D] text-white flex items-center justify-center text-[13px] font-bold shadow-sm ring-4 ring-[#E2E8F0]">
                                    1
                                </div>
                                <span className="text-[12px] font-bold text-[#1B365D] mt-2">Login</span>
                            </div>

                            {/* Gold Line 1 */}
                            <div className="flex-1 h-[2px] bg-[#D99A29] mx-2 -mt-5" />

                            {/* Step 2 */}
                            <div className="flex flex-col items-center">
                                <div className="w-9 h-9 rounded-full bg-[#F1F5F9] text-slate-400 flex items-center justify-center text-[13px] font-bold">
                                    2
                                </div>
                                <span className="text-[12px] font-medium text-slate-400 mt-2">Verify OTP</span>
                            </div>

                            {/* Gray Line 2 */}
                            <div className="flex-1 h-[2px] bg-slate-200 mx-2 -mt-5" />

                            {/* Step 3 */}
                            <div className="flex flex-col items-center">
                                <div className="w-9 h-9 rounded-full bg-[#F1F5F9] text-slate-400 flex items-center justify-center text-[13px] font-bold">
                                    3
                                </div>
                                <span className="text-[12px] font-medium text-slate-400 mt-2">Face Verify</span>
                            </div>
                        </div>

                        {/* Notice Box */}
                        <div className="border-l-4 border-[#D99A29] bg-[#EFF6FF] border border-blue-100 p-4 rounded-r-xl rounded-l-sm text-[13px] text-[#1E3A8A] font-medium text-center space-y-1 shadow-sm">
                            <div className="font-bold text-[#1B365D] flex items-center justify-center gap-1.5 text-[14px]">
                                <span>💡 Quick Access — No details required!</span>
                            </div>
                            <p className="text-slate-600 text-[12px] leading-relaxed">
                                You do <strong>NOT need to enter any real details</strong> or Application / CET numbers. Simply click <span className="font-bold text-[#1B365D]">"Send OTP"</span> below to instantly start!
                            </p>
                        </div>

                        {/* Login Method Buttons (Joined Segmented Control) */}
                        <div className="flex bg-[#F8FAFC] rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                            <button
                                type="button"
                                onClick={() => setLoginMethod('qr')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-[13px] font-bold transition-colors ${
                                    loginMethod === 'qr'
                                        ? 'bg-[#1B365D] text-white'
                                        : 'bg-transparent text-slate-500 hover:bg-slate-100'
                                }`}
                            >
                                <QRIcon className={loginMethod === 'qr' ? 'text-white' : 'text-slate-500'} />
                                <span>Scan QR Code</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setLoginMethod('cet')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-[13px] font-bold transition-colors ${
                                    loginMethod === 'cet'
                                        ? 'bg-[#1B365D] text-white'
                                        : 'bg-transparent text-slate-500 hover:bg-slate-100'
                                }`}
                            >
                                <CETIcon className={loginMethod === 'cet' ? 'text-white' : 'text-slate-500'} />
                                <span>Enter CET No</span>
                            </button>
                        </div>

                        {/* Form Inputs */}
                        {loginMethod === 'cet' && (
                            <div className="space-y-5">
                                {/* Application No */}
                                <div>
                                    <label className="block text-[11px] font-bold text-[#1B365D] uppercase tracking-wide mb-1.5 flex justify-between items-center">
                                        <span>APPLICATION NO</span>
                                        <span className="text-[10px] text-slate-400 font-normal lowercase">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={applicationNo}
                                        onChange={e => setApplicationNo(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1B365D] focus:border-[#1B365D] transition-colors placeholder:text-slate-400"
                                        placeholder="Optional - click Send OTP to test"
                                    />
                                </div>

                                {/* Option Entry CET No */}
                                <div>
                                    <label className="block text-[11px] font-bold text-[#1B365D] uppercase tracking-wide mb-1.5 flex justify-between items-center">
                                        <span>OPTION ENTRY CET NO</span>
                                        <span className="text-[10px] text-slate-400 font-normal lowercase">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={cetNoInput}
                                        onChange={e => setCetNoInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleCetLogin()}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1B365D] focus:border-[#1B365D] transition-colors placeholder:text-slate-400"
                                        placeholder="Optional (e.g. DG052)"
                                    />
                                </div>

                                {/* RECEIVE OTP VIA Box */}
                                <div className="bg-[#F0F4F9] border border-[#DDE3EA] rounded-2xl p-4">
                                    <label className="block text-[11px] font-bold text-[#5B6B7C] uppercase tracking-wide mb-3">
                                        RECEIVE OTP VIA
                                    </label>
                                    <div className="flex items-center gap-2.5">
                                        <button
                                            type="button"
                                            onClick={() => setOtpChannel('SMS')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-bold transition-all ${
                                                otpChannel === 'SMS'
                                                    ? 'bg-[#1B365D] text-white shadow-sm'
                                                    : 'bg-white text-[#5B6B7C] border border-slate-200 hover:bg-slate-50'
                                            }`}
                                        >
                                            <SMSPixelIcon />
                                            <span>SMS</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setOtpChannel('WhatsApp')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-bold transition-all ${
                                                otpChannel === 'WhatsApp'
                                                    ? 'bg-[#1B365D] text-white shadow-sm'
                                                    : 'bg-white text-[#5B6B7C] border border-slate-200 hover:bg-slate-50'
                                            }`}
                                        >
                                            <WhatsAppPurpleIcon />
                                            <span>WhatsApp</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setOtpChannel('Email')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-full text-xs font-bold transition-all ${
                                                otpChannel === 'Email'
                                                    ? 'bg-[#1B365D] text-white shadow-sm'
                                                    : 'bg-white text-[#5B6B7C] border border-slate-200 hover:bg-slate-50'
                                            }`}
                                        >
                                            <EmailPurpleIcon />
                                            <span>Email</span>
                                        </button>
                                    </div>
                                </div>

                                {/* CAPTCHA Section */}
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-bold text-[#5B6B7C] uppercase tracking-wide">
                                        CAPTCHA
                                    </label>
                                    
                                    <div className="flex items-center gap-3">
                                        {/* Pixelated Image Box matching screenshot */}
                                        <div 
                                            className="flex-1 h-14 bg-[#FAFAFA] border border-[#C3D2E5] rounded-xl flex items-center justify-between px-6 overflow-hidden relative shadow-inner select-none"
                                            style={{
                                                backgroundImage: `
                                                    linear-gradient(to right, #E2E8F0 1px, transparent 1px),
                                                    linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)
                                                `,
                                                backgroundSize: '10px 10px'
                                            }}
                                        >
                                            {/* Noise line overlays */}
                                            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:8px_8px]" />

                                            {captchaCode.map((char, i) => (
                                                <span 
                                                    key={i} 
                                                    className={`text-2xl font-black font-mono tracking-wider transition-all duration-300 ${captchaOffsets[i % captchaOffsets.length]}`}
                                                    style={{
                                                        color: captchaColors[i % captchaColors.length],
                                                        fontFamily: '"Courier New", Courier, monospace',
                                                        textShadow: '1px 1px 0px rgba(0,0,0,0.1)'
                                                    }}
                                                >
                                                    {char}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Refresh Button */}
                                        <button
                                            type="button"
                                            onClick={generateCaptcha}
                                            className="w-12 h-14 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 transition-colors shadow-sm flex items-center justify-center shrink-0"
                                        >
                                            <RefreshIcon />
                                        </button>
                                    </div>

                                    {/* Captcha Input */}
                                    <input
                                        type="text"
                                        value={captchaInput}
                                        onChange={e => setCaptchaInput(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1B365D] focus:border-[#1B365D] transition-colors placeholder:text-slate-400"
                                        placeholder="Optional - click Send OTP directly"
                                    />
                                </div>

                                {/* Send OTP Submit Button */}
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={handleCetLogin}
                                        className="w-full bg-[#1B365D] hover:bg-[#122744] active:bg-[#0A182E] text-white py-3.5 px-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-md flex items-center justify-center"
                                    >
                                        Send OTP
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* QR Method Placeholder */}
                        {loginMethod === 'qr' && (
                            <div className="flex flex-col items-center justify-center py-8 space-y-4 border border-dashed border-slate-300 rounded-xl bg-slate-50">
                                <div className="w-48 h-48 bg-[#0F1F35] rounded-2xl relative flex items-center justify-center shadow-inner overflow-hidden border border-slate-700">
                                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#D99A29]" />
                                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#D99A29]" />
                                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#D99A29]" />
                                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#D99A29]" />
                                    <QRIcon className="w-16 h-16 text-slate-600 animate-pulse" />
                                </div>
                                <p className="text-[13px] text-slate-500 font-semibold text-center max-w-[220px]">
                                    Point the camera at the QR code on your verification slip
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <PageFooter />

            {/* Privacy Policy Modal */}
            {showPrivacyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-slate-200 bg-[#1B365D] text-white flex justify-between items-center">
                            <h2 className="text-base font-bold">Privacy Policy &amp; Legal Disclaimer</h2>
                            <button onClick={() => setShowPrivacyModal(false)} className="text-slate-300 hover:text-white text-2xl leading-none">&times;</button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-[13px] text-slate-600 leading-relaxed">
                            <p><strong>1. Educational &amp; Simulation Purposes Only</strong><br />
                                This platform ("KCET Simulator") is built strictly for educational and demonstrative purposes. The mock allotments generated by this simulator are simulated using official cutoff data and do not guarantee seats in real counseling.</p>

                            <p><strong>2. No Affiliation with KEA</strong><br />
                                This website is an independent project and is NOT affiliated with, authorized, or endorsed by the Karnataka Examinations Authority (KEA).</p>

                            <p><strong>3. Privacy &amp; Data Storage</strong><br />
                                We respect your privacy. No personal data is uploaded to external servers. All information entered is stored locally in your browser cache.</p>

                            <p><strong>4. Disclaimer &amp; Liability Limitation</strong><br />
                                By logging in, you acknowledge that this tool is for guidance only.</p>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-[#1B365D] rounded border-slate-300 focus:ring-[#1B365D] cursor-pointer"
                                    checked={hasAgreedToPrivacy}
                                    onChange={(e) => setHasAgreedToPrivacy(e.target.checked)}
                                />
                                <span className="text-[13px] font-semibold text-slate-700">I have read, understood, and agree to the Privacy Policy &amp; Legal Disclaimer.</span>
                            </label>

                            <div className="mt-5 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowPrivacyModal(false)}
                                    className="px-5 py-2.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-200 transition-colors text-[13px] border border-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAgreeAndLogin}
                                    disabled={!hasAgreedToPrivacy}
                                    className="px-6 py-2.5 rounded-xl text-white font-bold transition-all text-[13px] disabled:opacity-50 disabled:cursor-not-allowed bg-[#1B365D] hover:bg-[#122744]"
                                >
                                    Accept &amp; Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

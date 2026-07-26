'use client';

import React from 'react';

interface CreditsPrivacyCardProps {
    onNavigate: (step: string) => void;
}

export default function CreditsPrivacyCard({ onNavigate }: CreditsPrivacyCardProps) {
    return (
        <div className="bg-white border border-gray-300 shadow-sm w-full max-w-xl mx-auto rounded-none overflow-hidden text-slate-800 font-sans text-xs">
            
            {/* Header Banner */}
            <div className="bg-[#6c757d] text-white px-4 py-2.5 text-center">
                <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide">
                    CREDITS & PRIVACY POLICY
                </h2>
            </div>

            <div className="p-5 space-y-4">
                
                {/* Credits Section */}
                <div>
                    <h3 className="font-bold text-slate-900 text-xs mb-2">Credits:</h3>
                    <div className="space-y-1.5 pl-1">
                        <div className="flex items-center gap-2 text-slate-800">
                            <svg className="w-4 h-4 text-[#5865F2] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                            </svg>
                            <span className="font-medium text-[#4040F2]">flux_ai (aka Yashwin)</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-800">
                            <svg className="w-4 h-4 text-[#5865F2] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                            </svg>
                            <span className="font-medium text-[#4040F2]">Azalea</span>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Latest Updates Section */}
                <div>
                    <h3 className="font-bold text-red-600 text-xs mb-1">Latest Updates:</h3>
                    <p className="text-slate-700 leading-relaxed">
                        The <strong>2026 Counseling Simulator Logic</strong> is live with official 2026 cutoffs! Simulated using the standard 3-round counseling sequence (Mock, Round 1, Round 2, Round 3).
                    </p>
                </div>

                <hr className="border-gray-200" />

                {/* Privacy Policy & Disclaimer Section */}
                <div>
                    <h3 className="font-bold text-slate-900 text-xs mb-1">Privacy Policy & Disclaimer:</h3>
                    <p className="text-slate-700 leading-relaxed">
                        This platform is built purely for educational purposes and is <strong className="text-red-600 font-bold">NOT</strong> affiliated with the official Karnataka Examinations Authority (KEA). No legal actions can be taken against the creators. We do not collect, transmit, or store any of your personal data on external servers; all data remains completely secured within your local browser storage.
                    </p>
                </div>

                <hr className="border-gray-200" />

                {/* Footnote & Disclaimer Link */}
                <div className="space-y-2 text-center pt-1">
                    <p className="text-slate-500 italic text-[11px]">
                        * Allotments are simulated based on official 2026 &amp; 2025 KCET Round cutoffs.
                    </p>

                    <div>
                        <button
                            onClick={() => onNavigate('privacy_policy')}
                            className="text-[#0000B3] font-bold underline hover:text-blue-900 text-xs"
                        >
                            Click here to read the full Privacy Policy & Legal Disclaimer
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

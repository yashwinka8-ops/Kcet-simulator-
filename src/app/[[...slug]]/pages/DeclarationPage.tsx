'use client';

import React from 'react';

interface DeclarationPageProps {
    isDeclarationChecked: boolean;
    setIsDeclarationChecked: (v: boolean) => void;
    setHasAgreedDeclaration: (v: boolean) => void;
    onNavigate: (step: string) => void;
    hasProfile: boolean;
}

export default function DeclarationPage({
    isDeclarationChecked,
    setIsDeclarationChecked,
    setHasAgreedDeclaration,
    onNavigate,
    hasProfile,
}: DeclarationPageProps) {
    const handleAgree = () => {
        if (!isDeclarationChecked) {
            alert("Please check the declaration box before proceeding.");
            return;
        }
        setHasAgreedDeclaration(true);
        if (hasProfile) {
            onNavigate('entry');
        } else {
            onNavigate('profile');
        }
    };

    return (
        <div className="bg-white border border-gray-200 p-4 md:p-6 mt-2">
            <div className="flex gap-2 items-start">
                <input type="checkbox" className="mt-1 shrink-0" checked={isDeclarationChecked} onChange={e => setIsDeclarationChecked(e.target.checked)} />
                <p className="text-black text-[12px] font-bold leading-relaxed">
                    I am aware that the options entered by me for the first round will continue as it is for all the subsequent rounds of online seat allotment. I also know that I will not be allowed to add the options again in next round, but I know that there is a provision to delete or alter or modify the order of options.
                </p>
            </div>

            <div className="mt-4">
                <button
                    onClick={handleAgree}
                    className="bg-[#0000FF] hover:bg-blue-700 text-white px-5 py-[4px] rounded-[3px] font-bold text-[13px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all"
                >
                    I Agree
                </button>
            </div>
        </div>
    );
}

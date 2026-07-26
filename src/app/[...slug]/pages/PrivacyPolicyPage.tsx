import React from 'react';
import { LandingHeader } from '@/components/DashboardHeader';
import PageFooter from '@/components/PageFooter';

import CreditsPrivacyCard from '@/components/CreditsPrivacyCard';

interface PrivacyPolicyPageProps {
    onNavigate: (step: string) => void;
    userProfile: any;
}

export function PrivacyPolicyPage({ onNavigate, userProfile }: PrivacyPolicyPageProps) {
    return (
        <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
            <LandingHeader onNavigate={onNavigate} onLogout={() => onNavigate('login')} userProfile={userProfile} step="privacy_policy" />

            <div className="flex-1 p-4 md:p-8 flex flex-col items-center gap-6 pb-20">
                <CreditsPrivacyCard onNavigate={onNavigate} />

                <div className="pt-2 text-center">
                    <button
                        onClick={() => onNavigate('landing')}
                        className="bg-[#000080] hover:bg-blue-900 text-white font-bold py-2 px-8 rounded shadow text-[14px]"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>

            <PageFooter />
        </div>
    );
}

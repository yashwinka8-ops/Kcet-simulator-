import React from 'react';

interface PaymentSuccessPageProps {
    onNavigate: (step: string) => void;
}

export default function PaymentSuccessPage({ onNavigate }: PaymentSuccessPageProps) {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center fixed inset-0 z-[200] bg-white overflow-y-auto pt-10 pb-10">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR70c6KiSoEHu-sv4tsowYfx5bu2x1LM-4Ihg&s" alt="Payment Successful" className="w-80 h-auto object-contain mb-8 rounded-lg" />
            <button 
                onClick={() => onNavigate('landing')}
                className="bg-[#000080] hover:bg-blue-900 text-white font-bold py-2 px-8 rounded shadow-md transition-colors"
            >
                Back to Dashboard
            </button>
        </div>
    );
}

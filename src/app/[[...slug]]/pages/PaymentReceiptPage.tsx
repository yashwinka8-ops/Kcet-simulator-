import React from 'react';

interface PaymentReceiptPageProps {
    onNavigate: (step: string) => void;
}

export default function PaymentReceiptPage({ onNavigate }: PaymentReceiptPageProps) {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-start bg-gray-100 py-10 px-4 overflow-y-auto z-[200] relative">
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-8 flex flex-col items-center relative mb-8">
                <button 
                    onClick={() => onNavigate('landing')}
                    className="absolute top-6 left-6 text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    Back to Dashboard
                </button>

                <h1 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2 w-full text-center mt-8">Admission Payment Receipt</h1>
                
                <div className="flex flex-col gap-8 items-center w-full">
                    <img src="https://i.pinimg.com/236x/6a/2c/66/6a2c669640a19c5eaceed4ac95618ba8.jpg" alt="Payment Receipt Part 1" className="w-full max-w-2xl h-auto border border-gray-300 shadow-sm" />
                    <img src="https://i.pinimg.com/originals/54/26/99/542699371275940351b64998a52a8de3.jpg?nii=t" alt="Payment Receipt Part 2" className="w-full max-w-2xl h-auto border border-gray-300 shadow-sm" />
                </div>

                <div className="mt-10 flex gap-4">
                    <button 
                        onClick={() => window.print()}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-8 rounded shadow-md transition-colors"
                    >
                        Print Receipt
                    </button>
                    <button 
                        onClick={() => onNavigate('landing')}
                        className="bg-[#000080] hover:bg-blue-900 text-white font-bold py-2 px-8 rounded shadow-md transition-colors"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

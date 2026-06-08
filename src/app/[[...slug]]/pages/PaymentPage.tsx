import React from 'react';

interface PaymentPageProps {
    onNavigate: (step: string) => void;
    setIsPaymentComplete: (v: boolean) => void;
}

export default function PaymentPage({ onNavigate, setIsPaymentComplete }: PaymentPageProps) {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
            <div className="flex flex-col md:flex-row w-[800px] max-w-[95vw] shadow-2xl relative">
                {/* Left Side: Info */}
                <div className="flex-1 bg-white rounded-l-lg hidden md:flex flex-col">
                    <div className="p-8 flex flex-col flex-1 border-r border-gray-200 bg-gray-50 rounded-l-lg">
                        <div className="flex items-center gap-2 mb-6 text-gray-700">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                            <span className="font-medium text-sm">support@kea.kar.nic.in</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">KEA Admission Fee Payment</h2>
                        <p className="text-sm text-gray-600 leading-relaxed mb-6">Complete your payment securely to confirm your allotted seat and enable option entry for further rounds.</p>
                        
                        <div className="mt-auto pt-6 border-t border-gray-200">
                            <div className="flex items-center gap-3">
                                <span className="italic text-[#0A22C2] text-sm font-black border-l-4 pl-2 border-blue-600">Razorpay</span>
                                <span className="text-xs text-gray-500 font-medium">Secured Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Razorpay Checkout Modal */}
                <div className="w-full md:w-[380px] min-h-[550px] bg-white rounded-r-lg md:rounded-l-none rounded-l-lg flex flex-col relative overflow-hidden shadow-[-10px_0_20px_rgba(0,0,0,0.05)]">
                    {/* Blue Header */}
                    <div className="bg-[#0A22C2] h-[260px] w-full flex flex-col items-center relative text-white pt-5 shrink-0">
                        <div className="absolute top-4 left-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigate('landing')}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                        </div>
                        
                        {/* KEA Logo Square */}
                        <div className="w-16 h-16 bg-white rounded-[12px] mt-2 flex flex-col items-center justify-center p-1 mb-2 shadow-sm relative overflow-hidden">
                            <div className="flex flex-col items-center justify-center w-full h-full bg-white text-center leading-[1.1]">
                                <span className="text-[#8B0000] font-bold text-[8px]">ಕರ್ನಾಟಕ ಪರೀಕ್ಷಾ ಪ್ರಾಧಿಕಾರ</span>
                                <span className="text-[6px] text-black mt-[2px] font-bold">Karnataka Examinations Authority</span>
                            </div>
                        </div>
                        
                        <h2 className="text-[16px] font-medium tracking-wide">KEA</h2>

                        <div className="mt-4 flex flex-col items-center">
                            <span className="text-[12px] opacity-80 mb-0.5">Total Amount</span>
                            <div className="flex items-start">
                                <span className="text-[20px] mt-1 mr-1">₹</span>
                                <span className="text-[38px] font-bold leading-none tracking-tight">7 karod</span>
                            </div>
                        </div>
                    </div>

                    {/* White Content Area */}
                    <div className="flex-1 bg-white p-6 flex flex-col rounded-t-[16px] -mt-4 z-10 relative shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
                        <h3 className="text-[15px] font-bold text-gray-800 mb-0.5">Contact details</h3>
                        <p className="text-[12px] text-gray-500 mb-5">Enter mobile & email to proceed</p>

                        <div className="flex border border-gray-300 rounded-[4px] p-3 mb-auto focus-within:border-[#0A22C2] focus-within:shadow-[0_0_0_1px_#0A22C2] transition-all">
                            <div className="flex items-center gap-1 border-r border-gray-300 pr-3 mr-3 text-[14px] font-medium text-gray-700">
                                🇮🇳 +91 
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                            </div>
                            <input type="text" placeholder="Mobile number" className="w-full outline-none text-[15px] font-medium text-gray-900" defaultValue="xxxxx zzzzz" />
                        </div>

                        <button 
                            onClick={() => {
                                setIsPaymentComplete(true);
                                onNavigate('payment_success');
                            }}
                            className="w-full mt-6 bg-[#0A22C2] hover:bg-[#081b99] text-white py-[14px] rounded-[4px] text-[15px] font-bold shadow-md transition-all tracking-wide flex justify-center items-center gap-2"
                        >
                            Proceed to Pay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

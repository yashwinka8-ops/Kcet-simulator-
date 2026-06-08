import React, { useState } from 'react';

interface ChoiceEntryPageProps {
    mockAllotment: any;
    selectedChoice: number | null;
    setSelectedChoice: (v: number | null) => void;
    choiceSubmitted: boolean;
    setChoiceSubmitted: (v: boolean) => void;
    onNavigate: (step: string) => void;
}

export default function ChoiceEntryPage({
    mockAllotment,
    selectedChoice,
    setSelectedChoice,
    choiceSubmitted,
    setChoiceSubmitted,
    onNavigate,
}: ChoiceEntryPageProps) {
    const [localChoice, setLocalChoice] = useState<number | null>(selectedChoice);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChoiceSelect = (choice: number) => {
        if (choiceSubmitted) return;
        setLocalChoice(choice);
    };

    const [agreed, setAgreed] = useState(false);

    const handleSubmit = () => {
        if (!localChoice) {
            alert('Please select a choice first.');
            return;
        }
        setAgreed(false);
        setShowConfirm(true);
    };

    const confirmSubmit = () => {
        if (!agreed) {
            alert('Please click the check box to accept the declaration');
            return;
        }
        setSelectedChoice(localChoice);
        setChoiceSubmitted(true);
        if (localChoice === 4) {
            alert('You have exited the counseling. You will not be considered for further rounds.');
        } else if (localChoice === 2 || localChoice === 3) {
            alert('Your choice has been recorded. You will participate in the next round.');
        } else if (localChoice === 1) {
            alert('Your choice has been recorded. Please proceed to pay fees on the dashboard.');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!mockAllotment) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h1 className="text-xl font-bold text-red-600 mb-4">No Allotment Found</h1>
                <button onClick={() => onNavigate('landing')} className="text-blue-600 underline">Back to Dashboard</button>
            </div>
        );
    }

    const declarationText: Record<number, string> = {
        1: "I am Satisfied with the UGCET-2026 allotted seat and I am willing to report to the allotted college. Therefore I should not be considered for further allotment of seats in any subsequent round for any discipline. I will pay the prescribed fees by downloading the Challan / allotted details from the KEA website for the seat confirmed or allotted in the first round.",
        2: "I am Satisfied with the UGCET-2026 allotted seat but wish to participate in the next round. I will pay the prescribed fees by downloading the Challan / allotted details from the KEA website for the seat confirmed or allotted in the second round. If higher options are allotted in the 3rd round, then seat allotted in the second round gets cancelled automatically OR if higher order options seats are not allotted in the 3rd round, then the seat allotted in the second round shall remain in candidates favour.",
        3: "I am not satisfied with the UGCET-2026 allotted seat but wish to participate in the next round with all the already entered options except the allotted option by surrendering the allotted seat.",
        4: "I am Not satisfied with the UGCET-2026 allotted seat and I have got seat elsewhere, so I am quitting and not to be considered for allotment of seats in any of the further rounds."
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center pb-20">
            
            <div className="w-full max-w-5xl px-4 mt-8">
                <h1 className="text-2xl md:text-3xl text-red-600 font-normal text-center mb-6">
                    PLEASE BE CAUTIOUS WHILE EXERCISING YOUR CHOICE
                </h1>

                {/* Allotment Details Box */}
                <div className="border border-gray-300 rounded mb-8">
                    <div className="bg-[#1a73e8] text-white text-center py-3 px-4 rounded-t">
                        <h2 className="text-lg font-normal">CHOICE ENTRY</h2>
                        <p className="text-sm">You are allotted seat as details given below</p>
                    </div>
                    
                    <div className="p-6 bg-white space-y-4">
                        <div className="grid grid-cols-[100px_1fr] md:grid-cols-[150px_1fr] gap-4">
                            <div className="text-gray-700 font-medium">Stream:</div>
                            <div className="text-red-600">Engineering</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] md:grid-cols-[150px_1fr] gap-4">
                            <div className="text-gray-700 font-medium">College:</div>
                            <div className="text-red-600 uppercase">{mockAllotment.collegeName}</div>
                        </div>
                        <div className="grid grid-cols-[100px_1fr] md:grid-cols-[150px_1fr] gap-4">
                            <div className="text-gray-700 font-medium">Course:</div>
                            <div className="text-red-600 uppercase">{mockAllotment.branchName}</div>
                        </div>
                    </div>
                </div>

                {!choiceSubmitted ? (
                    <>
                        <div className="space-y-6">
                    {/* Choice 1 */}
                    <div 
                        className={`border rounded p-5 cursor-pointer ${localChoice === 1 ? 'border-green-500 bg-[#eef8f1]' : 'border-green-300 bg-[#f4faf5]'}`}
                        onClick={() => handleChoiceSelect(1)}
                    >
                        <div className="flex items-start gap-3">
                            <input 
                                type="radio" 
                                name="choice" 
                                disabled={choiceSubmitted}
                                checked={localChoice === 1} 
                                onChange={() => handleChoiceSelect(1)} 
                                className="mt-1 w-4 h-4 accent-green-600"
                            />
                            <div className="text-sm text-green-900 leading-relaxed">
                                <p className="font-bold mb-2">✅ Choice-1 (Satisfied):</p>
                                <div className="mb-4 space-y-2">
                                    <p>1. I am 100% satisfied about the seat allotted in the first round. I will join the college and do not need any change. Hence, I should not be considered for further rounds of seat allotment.</p>
                                    <p>2. Also I do not want to participate in the next rounds (for courses like UGNEET- Medical or Dental or AYUSH or UGCET-Engineering / Architecture / Farm Science / Veterinary / Pharmacy / B.Sc Nursing, Naturopathy and Yoga, Allied Health Science etc.)</p>
                                    <p>3. I hereby confirm that, I will pay the fee for the seat allotted in the first round, download the Confirmation Slip and then get the OTP through the college portal login by Online Face Recognition, verify the eligibility, download the admit card and get admission within the stipulated date and time.</p>
                                    <p>4. Any CHOICE-1 selected candidate fails to pay the fees or paid the fees but failed to download the Confirmation Slip or fails to report to the College, he / she has no claim further on such allotment, revert back to the seat matrix, and he / she will not be considered for allotment of seats in the subsequent rounds, fee paid if any will be forfeited.</p>
                                    <p>For further details visit KEA Website (https://cetonline.karnataka.gov.in/kea/ugcet2026)</p>
                                </div>
                                <div className="space-y-2 font-kannada font-bold">
                                    <p>1. ಮೊದಲನೇ ಸುತ್ತಿನಲ್ಲಿ ಹಂಚಿಕೆಯಾದ ಸೀಟು ನನಗೆ ಶೇ. 100 ರಷ್ಟು ಇಷ್ಟವಾಗಿದೆ. ನಾನು ಕಾಲೇಜಿಗೆ ಸೇರಲು ಇಚ್ಚಿಸುತ್ತೇನೆ ಮತ್ತು ನನಗೆ ಯಾವುದೇ ಬದಲಾವಣೆ ಅವಶ್ಯಕತೆ ಇರುವುದಿಲ್ಲ. ಆದ್ದರಿಂದ ನನ್ನನ್ನು ಮುಂದಿನ ಯಾವುದೇ ಸುತ್ತುಗಳ ಸೀಟು ಹಂಚಿಕೆಗೆ ಪರಿಗಣಿಸಬಾರದು.</p>
                                    <p>2. ಮುಂದಿನ ಸುತ್ತುಗಳಲ್ಲಿ (ಯುಜಿನೀಟ್-ವೈದ್ಯಕೀಯ ಅಥವಾ ದಂತ ವೈದ್ಯಕೀಯ ಅಥವಾ ಆಯುಷ್ ಅಥವಾ ಇಂಜಿನಿಯರಿಂಗ್ / ಆರ್ಕಿಟೆಕ್ಚರ್ / ಫಾರ್ಮ ಸೈನ್ಸ್ / ವೆಟರ್ನರಿ / ಫಾರ್ಮಸಿ / ಬಿ.ಎಸ್ಸಿ ನರ್ಸಿಂಗ್, ನ್ಯಾಚುರೋಪತಿ ಮತ್ತು ಯೋಗ, ಅಲೈಡ್ ಹೆಲ್ತ್ ಸೈನ್ಸ್ ಮುಂತಾದ ಕೋರ್ಸುಗಳಿಗೆ) ಭಾಗವಹಿಸಲು ಇಚ್ಛಿಸುವುದಿಲ್ಲ.</p>
                                    <p>3. ನಾನು ಮೊದಲನೇ ಸುತ್ತಿನಲ್ಲಿ ಹಂಚಿಕೆಯಾದ ಸೀಟಿಗೆ ಶುಲ್ಕವನ್ನು ಪಾವತಿಸಿ, Confirmation Slip ಅನ್ನು ಡೌನ್ಲೋಡ್ ಮಾಡಿಕೊಂಡು ನಂತರ ಕಾಲೇಜಿನ ಪೋರ್ಟಲ್ ಲಾಗಿನ್ ಮೂಲಕ ಒಟಿಪಿ ಪಡೆದು, Online Face Recognition ಮಾಡಿ, ಪ್ರವೇಶ ಪತ್ರ ಡೌನ್ಲೋಡ್ ಮಾಡಿ, ನಿಗದಿತ ದಿನಾಂಕದೊಳಗೆ ಪ್ರವೇಶ ಪಡೆಯಲು ಇಚ್ಛಿಸುತ್ತೇನೆ.</p>
                                    <p>4. CHOICE-1 ಆಯ್ಕೆ ಮಾಡಿದ ಅಭ್ಯರ್ಥಿಯು ಶುಲ್ಕವನ್ನು ಪಾವತಿಸಲು ವಿಫಲನಾದಲ್ಲಿ ಅಥವಾ ಶುಲ್ಕ ಪಾವತಿಸಿ, Confirmation Slip ಅನ್ನು ಡೌನ್ಲೋಡ್ ಮಾಡಲು ವಿಫಲನಾದಲ್ಲಿ ಅಥವಾ ಕಾಲೇಜಿಗೆ ವರದಿ ಮಾಡಲು ವಿಫಲರಾದಲ್ಲಿ ಅಂತಹ ಅಭ್ಯರ್ಥಿಗಳನ್ನು ಮುಂದಿನ ಸುತ್ತುಗಳ ಸೀಟು ಹಂಚಿಕೆಗೆ ಪರಿಗಣಿಸಲಾಗುವುದಿಲ್ಲ, ಪಾವತಿಸಿದ ಶುಲ್ಕವಿದ್ದಲ್ಲಿ ಮುಟ್ಟುಗೋಲು ಹಾಕಿಕೊಳ್ಳಲಾಗುವುದು.</p>
                                    <p>ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ಕೆಇಎ ವೆಬ್ಸೈಟ್ (https://cetonline.karnataka.gov.in/kea/ugcet2026) ಗೆ ಭೇಟಿ ನೀಡಿ.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Choice 2 */}
                    <div 
                        className={`border rounded p-5 cursor-pointer ${localChoice === 2 ? 'border-yellow-500 bg-[#fffdf0]' : 'border-yellow-300 bg-[#fffef5]'}`}
                        onClick={() => handleChoiceSelect(2)}
                    >
                        <div className="flex items-start gap-3">
                            <input 
                                type="radio" 
                                name="choice" 
                                disabled={choiceSubmitted}
                                checked={localChoice === 2} 
                                onChange={() => handleChoiceSelect(2)} 
                                className="mt-1 w-4 h-4 accent-yellow-600"
                            />
                            <div className="text-sm text-yellow-900 leading-relaxed">
                                <p className="font-bold mb-2">⏸️ Choice-2 (Hold):</p>
                                <div className="mb-4 space-y-2">
                                    <p>1. Candidate wants the seat allotted in the first round but he/she wants to participate in the second round to get a better seat.</p>
                                    <p>2. If any seat is allotted in the higher order options on the basis of merit in the second round, he/she will take the seat allotted in the second round.</p>
                                    <p>3. In case no seat is allotted on the basis of merit in the second round, candidate confirms that the seat already allotted in the first round will remain.</p>
                                    <p>4. Candidates can alter / delete / reorder / modify the higher order options in the second round option entry portal. Wait for the second round option entry and seat allotment schedule.</p>
                                    <p>5. Fee Payment details for the seat allotted candidates in the First Round:</p>
                                    <ul className="list-disc pl-5">
                                        <li>Candidate allotted with UGNEET seat in Medical / Dental / AYUSH should pay the prescribed fees.</li>
                                        <li>Candidate allotted seat in UGCET courses like Engineering / Architecture / Farm Sciences / Veterinary / B.Sc. Nursing / B-Pharma / Pharm-D / Yoga & Naturopathy etc need not have to pay the fees.</li>
                                    </ul>
                                    <p>For further details visit KEA Website (https://cetonline.karnataka.gov.in/kea/ugcet2026)</p>
                                </div>
                                <div className="space-y-2 font-kannada font-bold">
                                    <p>1. ಅಭ್ಯರ್ಥಿಗಳಿಗೆ ಮೊದಲನೇ ಸುತ್ತಿನಲ್ಲಿ ಹಂಚಿಕೆಯಾದ ಸೀಟು ಇಷ್ಟವಾಗಿರುತ್ತದೆ. ಆದರೆ ಅವನು/ಅವಳು ಇನ್ನೂ ಉತ್ತಮವಾದ ಸೀಟನ್ನು ಪಡೆಯಲು ಮುಂದಿನ ಎರಡನೇ ಸುತ್ತಿನಲ್ಲಿ ಭಾಗವಹಿಸಲಿಚ್ಛಿಸುತ್ತಾನೆ/ಳೆ.</p>
                                    <p>2. ಮುಂದಿನ ಎರಡನೇ ಸುತ್ತಿನಲ್ಲಿ ಮೆರಿಟ್ ಆಧಾರದ ಮೇಲೆ Higher Order Options ಗಳಲ್ಲಿ ಯಾವುದೇ ಸೀಟು ಹಂಚಿಕೆಯಾದಲ್ಲಿ, ಎರಡನೇ ಸುತ್ತಿನಲ್ಲಿ ಹಂಚಿಕೆಯಾದ ಸೀಟನ್ನು ಅಭ್ಯರ್ಥಿಯು ಪಡೆಯಲಿಚ್ಛಿಸುತ್ತಾನೆ/ಳೆ.</p>
                                    <p>3. ಒಂದು ವೇಳೆ ಮುಂದಿನ ಎರಡನೇ ಸುತ್ತಿನಲ್ಲಿ ಮೆರಿಟ್ ಆಧಾರದ ಮೇಲೆ higher order options ಗಳಲ್ಲಿ ಯಾವುದೇ ಸೀಟು ಹಂಚಿಕೆಯಾಗದಿದ್ದಲ್ಲಿ, ಈಗಾಗಲೇ ಮೊದಲನೇ ಸುತ್ತಿನಲ್ಲಿ ಹಂಚಿಕೆಯಾದ ಸೀಟೇ ಉಳಿಯುತ್ತದೆ.</p>
                                    <p>4. ಮೊದಲನೇ ಸುತ್ತಿನಲ್ಲಿ ಅಭ್ಯರ್ಥಿಗಳು ದಾಖಲಿಸಿದ higher order options ಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸಲಾಗುವುದು. ಅಭ್ಯರ್ಥಿಗಳು ಎರಡನೇ ಸುತ್ತಿನ ಪ್ರಕ್ರಿಯೆ ಪ್ರಾರಂಭವಾದ ನಂತರ higher order options ಗಳನ್ನು ಮರುಕ್ರಮಗೊಳಿಸಬಹುದು ಅಥವಾ ಆದ್ಯತಾ ಕ್ರಮಗಳನ್ನು ಮಾರ್ಪಡಿಸಿಕೊಳ್ಳಬಹುದು ಅಥವಾ ಯಾವುದಾದರೂ options ಬೇಡವಾದಲ್ಲಿ ಅಳಿಸಿಹಾಕಬಹುದು / ತೆಗೆದು ಹಾಕಬಹುದು.</p>
                                    <p>5. ಮೊದಲ ಸುತ್ತಿನಲ್ಲಿ ಸೀಟು ಹಂಚಿಕೆಯಾದ ಅಭ್ಯರ್ಥಿಗಳಿಗೆ ಶುಲ್ಕ ಪಾವತಿಯ ವಿವರ:</p>
                                    <ul className="list-disc pl-5">
                                        <li>ಯುಜಿನೀಟ್ ಕೋರ್ಸುಗಳಾದ ವೈದ್ಯಕೀಯ, ದಂತವೈದ್ಯಕೀಯ, ಹೋಮಿಯೋಪತಿ ಸೀಟು ಹಂಚಿಕೆಯಾದ ಅಭ್ಯರ್ಥಿಗಳು ನಿಗದಿತ ಶುಲ್ಕವನ್ನು ಪಾವತಿಸಬೇಕು.</li>
                                        <li>ಯುಜಿಸಿಇಟಿ ಕೋರ್ಸುಗಳಾದ ಇಂಜಿನಿಯರಿಂಗ್, ಆರ್ಕಿಟೆಕ್ಚರ್, ಯೋಗ ಮತ್ತು ನ್ಯಾಚುರೋಪತಿ, ಫಾರ್ಮ ಸೈನ್ಸ್, ವೆಟರ್ನರಿ, ಬಿ-ಫಾರ್ಮ, ಫಾರ್ಮಾ-ಡಿ, ಬಿ.ಎಸ್ಸಿ (ನರ್ಸಿಂಗ್), ಬಿಪಿಟಿ, ಬಿಪಿಒ, ಅಲೈಡ್ ಹೆಲ್ತ್ ಸೈನ್ಸ್ ಕೋರ್ಸುಗಳಲ್ಲಿ ಸೀಟು ಹಂಚಿಕೆಯಾದ ಅಭ್ಯರ್ಥಿಗಳು ಶುಲ್ಕ ಪಾವತಿಸುವ ಅವಶ್ಯಕತೆ ಇರುವುದಿಲ್ಲ.</li>
                                    </ul>
                                    <p>ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ಕೆಇಎ ವೆಬ್ಸೈಟ್ (https://cetonline.karnataka.gov.in/kea/ugcet2026) ಗೆ ಭೇಟಿ ನೀಡಿ.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Choice 3 */}
                    <div 
                        className={`border rounded p-5 cursor-pointer ${localChoice === 3 ? 'border-teal-500 bg-[#eef8f8]' : 'border-teal-300 bg-[#f4fafa]'}`}
                        onClick={() => handleChoiceSelect(3)}
                    >
                        <div className="flex items-start gap-3">
                            <input 
                                type="radio" 
                                name="choice" 
                                disabled={choiceSubmitted}
                                checked={localChoice === 3} 
                                onChange={() => handleChoiceSelect(3)} 
                                className="mt-1 w-4 h-4 accent-teal-600"
                            />
                            <div className="text-sm text-teal-900 leading-relaxed">
                                <p className="font-bold mb-2">👤 Choice-3 (Not Interested):</p>
                                <div className="mb-4 space-y-2">
                                    <p>1. Candidate is not satisfied with allotted seat.</p>
                                    <p>2. Candidate wishes to participate in the second round option entry by surrendering the allotted seat.</p>
                                    <p>3. The candidates after logging in and agreeing to the terms and conditions, all the options entered by the candidates in the first round will be shown (except the allotted option for the candidate in the first round). The candidates can modify only the options they want in any order. The options removed by the candidate will remain on the left-hand side screen and such options will not be considered.</p>
                                    <p>4. Consequential vacancies that arise after their turn cannot be claimed. Chances of getting the lower order options is subject to availability of seats as the other candidates next to your rank might have entered those options and seat would have been allotted to them based on merit.</p>
                                    <p>5. The candidates who exercise CHOICE-3 need not pay the fees for the allotted seat but, if the candidate likes to participate with un-allotted medical seat in the second round, then he / she has to pay the caution deposit.</p>
                                    <p>For further details visit KEA Website (https://cetonline.karnataka.gov.in/kea/ugcet2026)</p>
                                </div>
                                <div className="space-y-2 font-kannada font-bold">
                                    <p>1. ಅಭ್ಯರ್ಥಿಗೆ ಮೊದಲ ಸುತ್ತಿನಲ್ಲಿ ದೊರೆತಿರುವ ಸೀಟು ತೃಪ್ತಿಕರವಾಗಿಲ್ಲ.</p>
                                    <p>2. ಅಭ್ಯರ್ಥಿಯು ಮೊದಲನೇ ಸುತ್ತಿನಲ್ಲಿ ಹಂಚಿಕೆಯಾದ ಸೀಟನ್ನು ರದ್ದುಪಡಿಸಿಕೊಂಡು ಎರಡನೇ ಸುತ್ತಿನಲ್ಲಿ ಭಾಗವಹಿಸಲಿಚ್ಛಿಸುತ್ತಾರೆ.</p>
                                    <p>3. ಅಭ್ಯರ್ಥಿಗಳು ಎರಡನೇ ಸುತ್ತಿನಲ್ಲಿ ಇಚ್ಛೆ/ಆಯ್ಕೆಗಳನ್ನು ದಾಖಲಿಸುವ ಪ್ರಕ್ರಿಯೆ ಪ್ರಾರಂಭಿಸಿದ ನಂತರ option entry portal ನಲ್ಲಿ ಲಾಗಿನ್ ಮಾಡಿ ಒಪ್ಪಿಗೆ ನೀಡಿದ ನಂತರ ಮೊದಲನೇ ಸುತ್ತಿನಲ್ಲಿ ಅವರು ದಾಖಲಿಸಿದ ಎಲ್ಲಾ options ಗಳನ್ನು ತೋರಿಸಲಾಗುವುದು (ಮೊದಲನೇ ಸುತ್ತಿನಲ್ಲಿ ಹಂಚಿಕೆಯಾಗಿ ಅಭ್ಯರ್ಥಿಯು ರದ್ದುಪಡಿಸಿಕೊಂಡ option ಅನ್ನು ಹೊರತುಪಡಿಸಿ ಉಳಿದ ಎಲ್ಲಾ ಇಚ್ಛೆ/ಆಯ್ಕೆಗಳು). ಅಭ್ಯರ್ಥಿಗಳು ತಮಗೆ ಬೇಕಾಗಿರುವ options ಗಳನ್ನು ಮಾತ್ರ ಯಾವುದೇ ಕ್ರಮದಲ್ಲಿ ಬೇಕಾದರೂ ಮಾರ್ಪಡಿಸಿಕೊಳ್ಳಬಹುದು. ಯಾವುದೇ ಬೇಡವೋ ಅಂತಹ options ಗಳನ್ನು ಅಳಿಸಿಕೊಳ್ಳುವ ಅಗತ್ಯ ಇರುವುದಿಲ್ಲ, ತೆಗೆದು ಹಾಕಬಹುದು. ನೀವು ತೆಗೆದು ಹಾಕುವ options ಗಳು ನಿಮ್ಮ ಎಡಭಾಗದ ಸ್ಕ್ರೀನ್ ನಲ್ಲಿಯೇ ಇರುತ್ತವೆ ಮತ್ತು ಅಂತಹ options ಗಳನ್ನು ಪರಿಗಣಿಸುವುದಿಲ್ಲ.</p>
                                    <p>4. ಅಭ್ಯರ್ಥಿ ತಮ್ಮ ರ್ಯಾಂಕ್ ಸರದಿಯ ನಂತರ ನಮೂದಿಸಿರುವ ಉದ್ಭವಿಸುವ ಸೀಟುಗಳನ್ನು ಪಡೆಯಲು ಹಕ್ಕನ್ನು ಚಲಾಯಿಸುವಂತಿಲ್ಲ. ಇಚ್ಛೆ/ಆಯ್ಕೆಗಳನ್ನು ಹೊಸದಾಗಿ ಸೇರಿಸಲು ಅವಕಾಶವಿರುವುದಿಲ್ಲ. ಒಂದು ವೇಳೆ ಸೀಟ್ ಮ್ಯಾಟ್ರಿಕ್ಸ್ ಗೆ ಹೊಸದಾಗಿ ಕಾಲೇಜು ಅಥವಾ ಕೋರ್ಸುಗಳು ಸೇರ್ಪಡೆಯಾದಲ್ಲಿ ಮಾತ್ರ options ಗಳನ್ನು ಸೇರಿಸಲು ಅವಕಾಶವಿರುತ್ತದೆ.</p>
                                    <p>5. CHOICE-3 ಅನ್ನು ಆಯ್ಕೆ ಮಾಡಿಕೊಂಡಿರುವ ಅಭ್ಯರ್ಥಿಗಳು ಮೊದಲನೇ ಸುತ್ತಿನಲ್ಲಿ ಹಂಚಿಕೆಯಾದ ಸೀಟಿಗೆ ಶುಲ್ಕವನ್ನು ಪಾವತಿಸುವ ಅಗತ್ಯವಿರುವುದಿಲ್ಲ. ಆದರೆ, ಒಂದು ವೇಳೆ ಅಭ್ಯರ್ಥಿಯು ವೈದ್ಯಕೀಯ ಕೋರ್ಸಿಗೆ ಈಗಾಗಲೇ ದಾಖಲಿಸಿರುವ options ಗಳೊಂದಿಗೆ ಎರಡನೇ ಸುತ್ತಿನಲ್ಲಿ ಭಾಗವಹಿಸಲು ಇಚ್ಛಿಸಿದಲ್ಲಿ CAUTION DEPOSIT ಅನ್ನು ಪಾವತಿಸಬೇಕು.</p>
                                    <p>ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ಕೆಇಎ ವೆಬ್ಸೈಟ್ (https://cetonline.karnataka.gov.in/kea/ugcet2026) ಗೆ ಭೇಟಿ ನೀಡಿ.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Choice 4 */}
                    <div 
                        className={`border rounded p-5 cursor-pointer ${localChoice === 4 ? 'border-red-500 bg-[#fdeeee]' : 'border-red-300 bg-[#fff5f5]'}`}
                        onClick={() => handleChoiceSelect(4)}
                    >
                        <div className="flex items-start gap-3">
                            <input 
                                type="radio" 
                                name="choice" 
                                disabled={choiceSubmitted}
                                checked={localChoice === 4} 
                                onChange={() => handleChoiceSelect(4)} 
                                className="mt-1 w-4 h-4 accent-red-600"
                            />
                            <div className="text-sm text-red-900 leading-relaxed">
                                <p className="font-bold mb-2">❌ Choice-4 (Quit):</p>
                                <div className="mb-4 space-y-2">
                                    <p>1. Candidate is not satisfied with the allotted seat and has got seat elsewhere. Hence the candidate quit the counseling process.</p>
                                    <p>2. Candidate is not eligible to participate in UGCET-2026 or UGNEET-2026 subsequent rounds and no hold on the allotted seat and seat allotted earlier will get cancelled.</p>
                                    <p>For further details visit KEA Website (https://cetonline.karnataka.gov.in/kea/ugcet2026)</p>
                                </div>
                                <div className="space-y-2 font-kannada font-bold">
                                    <p>1. ಅಭ್ಯರ್ಥಿಗೆ ಮೊದಲ ಸುತ್ತಿನಲ್ಲಿ ಹಂಚಿಕೆಯಾಗಿರುವ ಸೀಟು ತೃಪ್ತಿಕರವಾಗಿಲ್ಲ ಮತ್ತು ಅಭ್ಯರ್ಥಿಗೆ ಬೇರೆಡೆ ಸೀಟು ದೊರಕಿದೆ. ಆದ್ದರಿಂದ ಕೌನ್ಸೆಲಿಂಗ್ ಪ್ರಕ್ರಿಯೆಯಿಂದ ಹೊರಹೋಗಲು ಇಚ್ಛಿಸುತ್ತಾರೆ. ನನಗೆ ಮುಂದಿನ ಸುತ್ತಿನಲ್ಲೂ ಸಹ ಯಾವುದೇ ಸೀಟು ತೆಗೆದುಕೊಳ್ಳಲು ಇಷ್ಟವಿಲ್ಲ.</p>
                                    <p>2. ಅಭ್ಯರ್ಥಿಯು ಯುಜಿಸಿಇಟಿ-2026 ಅಥವಾ ಯುಜಿನೀಟ್-2026ರ ಕೋರ್ಸುಗಳ ಸೀಟು ಹಂಚಿಕೆಯ ಮುಂದಿನ ಯಾವುದೇ ಸುತ್ತುಗಳಲ್ಲಿ ಭಾಗವಹಿಸಲು ಅರ್ಹರಾಗುವುದಿಲ್ಲ.</p>
                                    <p>ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ಕೆಇಎ ವೆಬ್ಸೈಟ್ (https://cetonline.karnataka.gov.in/kea/ugcet2026) ಗೆ ಭೇಟಿ ನೀಡಿ.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                        <div className="mt-8 flex justify-center">
                            <button onClick={handleSubmit} className="px-10 py-2.5 rounded bg-[#1a73e8] hover:bg-blue-700 text-white font-medium text-lg shadow-sm">
                                Submit
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="mt-8 flex flex-col items-center w-full">
                        <div className="bg-[#fff9e6] border border-[#ffecb3] p-8 rounded w-full shadow-sm text-[#d48806] mb-6">
                            <h2 className="text-3xl text-center font-normal mb-6">Your selected choice is:{selectedChoice}</h2>
                            <div className="flex items-start gap-3 mb-6">
                                <input type="checkbox" checked disabled className="mt-1 w-4 h-4 accent-yellow-600" />
                                <div className="text-sm leading-relaxed text-justify">
                                    <span className="font-bold">Choice-{selectedChoice}:</span> {selectedChoice ? declarationText[selectedChoice as number] : ''}
                                </div>
                            </div>
                            
                            <div className="text-sm space-y-2 mb-4 text-[#d48806]">
                                <p><span className="font-bold">Implication:</span> You have successfully recorded Choice-{selectedChoice}. Your seat status and participation in further rounds will be processed according to KEA guidelines for this choice.</p>
                                <p className="font-bold mt-4">Additional Instructions for Choice-{selectedChoice}:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    {selectedChoice === 1 && (
                                        <>
                                            <li>a. Pay the prescribed fees for the allotted seat.</li>
                                            <li>b. Download the admission order and report to the college.</li>
                                        </>
                                    )}
                                    {selectedChoice === 2 && (
                                        <>
                                            <li>a. The candidate who exercises Choice-2 should compulsorily pay the fees for the allotted seat in the second round.</li>
                                            <li>b. Candidates who exercise Choice-2 are participating in the 3rd round by holding the seat allotted to them in the second round. If higher order options are allotted to them in the 3rd round, the seat allotted during second round will automatically stand cancelled. OR if any of the Higher Order Options are not allotted in the 3rd round, then the seat allotted to them at the second round will remain with the candidate.</li>
                                            <li>c. Higher order options remain; lower order options get deleted automatically.</li>
                                            <li>d. Candidates are advised to retain only such options... if the seat is allotted, they have to compulsorily join the allotted college.</li>
                                        </>
                                    )}
                                    {selectedChoice === 3 && (
                                        <>
                                            <li>a. You are surrendering your allotted seat.</li>
                                            <li>b. You can participate in the next round with all previously entered options.</li>
                                        </>
                                    )}
                                    {selectedChoice === 4 && (
                                        <>
                                            <li>a. You have quit the counseling process.</li>
                                            <li>b. You will not be considered for further rounds.</li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <button onClick={() => window.print()} className="px-8 py-2 bg-[#0d6efd] hover:bg-blue-700 text-white rounded font-medium shadow-sm transition-colors text-sm">
                            Print My Choice
                        </button>

                        <div className="mt-8 w-full max-w-xl bg-[#fff9e6] py-5 text-center rounded shadow-sm mx-auto">
                            <h3 className="text-[17px] font-normal text-gray-800">THE SELECTED CHOICE-{selectedChoice} IS FINAL</h3>
                        </div>

                        <button onClick={() => onNavigate('landing')} className="mt-8 text-blue-600 underline font-medium">
                            Return to Dashboard
                        </button>
                    </div>
                )}

                <div className="mt-8 bg-[#e0f2f1] border border-[#b2dfdb] rounded p-5 mb-10">
                    <h3 className="font-bold text-[#00695c] text-sm mb-2">NOTE: TO SEAT "ALLOTTED" CANDIDATES:</h3>
                    <p className="text-sm text-[#004d40]">
                        If a candidate fails to exercise any of the above 4 choices within the stipulated date and time, then the seat allotted to such candidate stands cancelled automatically without any further notice. They will not be allowed to participate in further rounds.
                    </p>
                </div>
            </div>

            {showConfirm && localChoice && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-[550px] w-full shadow-2xl">
                        <h3 className="text-2xl font-normal text-[#c00000] mb-6 text-center border-b pb-2">Caution</h3>
                        
                        <div className="mb-8 flex items-center gap-3 justify-center">
                            <span className="text-4xl">⚠️</span>
                            <h4 className="text-xl font-normal text-[#c00000]">Are you sure select CHOICE-{localChoice}</h4>
                        </div>
                        
                        <div className="mb-8 flex items-start gap-3">
                            <input 
                                type="checkbox" 
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1 w-5 h-5 cursor-pointer"
                            />
                            <p className="text-[12px] text-gray-700 leading-relaxed text-justify">
                                {declarationText[localChoice as number]}
                            </p>
                        </div>

                        <div className="flex justify-center gap-2">
                            <button onClick={confirmSubmit} className="px-6 py-1.5 bg-[#0d6efd] hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors">Confirm</button>
                            <button onClick={() => setShowConfirm(false)} className="px-6 py-1.5 bg-[#0d6efd] hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

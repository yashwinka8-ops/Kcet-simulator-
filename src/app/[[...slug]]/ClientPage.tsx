'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { exportChoiceEntryToPDF } from '@/lib/utils/choice-report';
import { exportAllotmentToPDF } from '@/lib/utils/allotment-report';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import {
    Menu,
    X,
    Home,
    BookOpen,
    Building2,
    LogOut,
    ChevronDown,
    Monitor,
    ShieldCheck,
    HelpCircle,
    FileText,
    User as UserIcon,
    MousePointer2,
    AlertTriangle,
    CheckCircle,
    Zap,
    Clock,
    GraduationCap,
    GripVertical,
    Lock,
    Trash2,
    RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';

// --- LOGOS ---
const KEALogo = ({ className }: { className?: string }) => (
    <img
        src="https://cetonline.karnataka.gov.in/kea/assets/images/kea-logo-kan.png"
        alt="KEA Logo"
        className={cn("object-fill", className)}
    />
);

const NICLogo = () => (
    <img src="/NIC.png" alt="NIC Logo" className="h-6 md:h-8 object-contain opacity-80" />
);

const RanksDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    const streams = [
        "Medical", "Dental", "Ayush", "Yoga & Naturopathy", "Architecture",
        "Engineering", "Agri(Bsc)(Theory)", "Agriculture(Pract.)", "Food Sci(Pract.)",
        "Food Sci(Theory)", "Nursing", "Veter Sci(Theory)", "Veter Sci(Pract.)",
        "Sericulture(Theory)", "Sericulture(Pract.)", "D-Pharma", "B-Pharma"
    ];

    return (
        <div className="relative inline-block mt-1 z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 border-[1px] border-black px-[6px] py-[1px] rounded-[2px] text-[11px] font-bold bg-[#0000e6] text-white shadow-sm"
            >
                Rank <ChevronDown className="w-[10px] h-[10px] text-white" />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-400 shadow-2xl w-[250px]">
                    <div className="flex bg-white text-[10px] font-bold border-b border-gray-300 px-3 py-1">
                        <div className="flex-1">Stream</div>
                        <div className="w-16 text-center">Rank</div>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto">
                        {streams.map((stream, idx) => (
                            <div key={idx} className="flex text-[10px] text-black font-medium border-b border-gray-100 last:border-0 px-3 py-1 hover:bg-gray-50">
                                <div className="flex-1">{stream}</div>
                                <div className="w-16 text-center">
                                    {stream === 'Engineering' ? '12500' : ''}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const CAPLogo = () => (
    <div className="flex flex-col shrink-0">
        <div className="flex items-end relative -mb-0.5">
            <div className="text-[#CE1126] font-sans font-bold text-[32px] md:text-[38px] tracking-tighter leading-none">CA</div>
            <div className="relative">
                {/* The Cap */}
                <div className="absolute -top-[14px] -left-[10px] md:-top-[16px] md:-left-[12px] text-[#111] z-10 transform -rotate-[12deg]">
                    <GraduationCap size={30} className="md:w-8 md:h-8 w-[26px] h-[26px]" fill="currentColor" strokeWidth={0.5} />
                </div>
                <div className="text-[#CE1126] font-sans font-bold text-[32px] md:text-[38px] tracking-tighter leading-none relative z-0">P</div>
            </div>
            <div className="text-[#111] font-sans font-medium text-[10px] md:text-[12px] uppercase mb-[4px] ml-1 leading-none tracking-tight">NIC</div>
        </div>
        <div className="text-gray-600 font-sans text-[7px] md:text-[8px] leading-[1.1] font-medium max-w-[140px] tracking-tight">
            Centralised Seat Allotment Process<br />for Professional Degree Courses
        </div>
    </div>
);

const GraduationCapIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
);

export default function CounselingSimulator() {
    const { user, isAdmin } = useAuth();
    const [step, setStepState] = useState<'login' | 'landing' | 'declaration' | 'profile' | 'entry' | 'courses' | 'colleges' | 'allotment_auth' | 'allotment_result'>('login');

    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname.split('/')[1] || '';
            let urlStep = path;
            if (path === 'dashboard') urlStep = 'landing';

            const hasCetNo = !!localStorage.getItem('sim_cet_no');
            if (urlStep) {
                if (!hasCetNo && urlStep !== 'login') {
                    setStepState('login');
                    window.history.replaceState({}, '', '/login');
                } else {
                    setStepState(urlStep as any);
                }
            } else {
                const defaultStep = hasCetNo ? 'landing' : 'login';
                setStepState(defaultStep);
                window.history.replaceState({}, '', `/${defaultStep === 'landing' ? 'dashboard' : 'login'}`);
            }
        };
        window.addEventListener('popstate', handlePopState);
        // Initialize from URL on mount
        if (typeof window !== 'undefined') {
            handlePopState();
        }
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const setStep = (newStep: string) => {
        setStepState(newStep as any);
        if (typeof window !== 'undefined') {
            const path = window.location.pathname.split('/')[1] || '';
            let currentUrlStep = path;
            if (path === 'dashboard') currentUrlStep = 'landing';

            if (currentUrlStep !== newStep) {
                let targetPath = newStep;
                if (newStep === 'landing') targetPath = 'dashboard';
                window.history.pushState({}, '', `/${targetPath}`);
            }
        }
    };

    // --- NON-ADMIN COMING SOON SCREEN ---
    if (false && !isAdmin) {
        return (
            <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-6 text-center space-y-8 relative overflow-hidden">
                {/* Background Animation Blobs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00529B] rounded-full blur-[100px] -z-10"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                        opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 12, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-500 rounded-full blur-[120px] -z-10"
                />

                <div className="space-y-4 relative z-10">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-[#00529B]/10 relative"
                    >
                        <Zap className="w-16 h-16 text-[#00529B] animate-pulse" />
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[-8px] border-2 border-dashed border-[#00529B]/30 rounded-full"
                        />
                    </motion.div>

                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-6xl font-black text-[#00529B] uppercase tracking-tighter">
                            Simulator <span className="text-gray-400">Loading...</span>
                        </h1>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center justify-center gap-3">
                            <Clock className="w-4 h-4" />
                            Activating on Results Day
                        </p>
                    </div>
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100 space-y-6"
                >
                    <div className="flex items-start gap-4 text-left">
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0 border border-rose-100">
                            <Monitor className="w-6 h-6 text-rose-500" />
                        </div>
                        <div>
                            <h4 className="font-black text-gray-800 uppercase text-xs tracking-wider mb-1">Interactive Mock Results</h4>
                            <p className="text-[11px] font-medium text-gray-500 leading-relaxed">Experience a pixel-perfect replica of the KEA portal. Practice option entry, see mock allotments, and master the Choice-1/2/3/4 system before the real window opens.</p>
                        </div>
                    </div>

                    <div className="pt-4 space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-[#00529B] uppercase tracking-[0.2em]">
                            <div className="flex-1 h-px bg-gray-100" />
                            Status: Locked by Admin
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>
                        <Link href="/">
                            <button className="w-full bg-[#00529B] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all">
                                Return to Home
                            </button>
                        </Link>
                    </div>
                </motion.div>

                <div className="flex items-center gap-8 opacity-40">
                    <KEALogo className="h-12 grayscale" />
                    <NICLogo />
                </div>
            </div>
        );
    }
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mockAllotment, setMockAllotment] = useState<any>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('sim_mock_allotment');
                if (saved) return JSON.parse(saved);
            } catch { }
        }
        return null;
    });
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState<number | null>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('sim_selected_choice');
                if (saved) return Number(saved);
            } catch { }
        }
        return null;
    });
    const [choiceSubmitted, setChoiceSubmitted] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('sim_choice_submitted') === 'true';
        }
        return false;
    });
    const [submittedRound, setSubmittedRound] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('sim_submitted_round');
                if (saved) return Number(saved);
            } catch { }
        }
        return 1;
    });
    const [previousAllotment, setPreviousAllotment] = useState<any>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('sim_previous_allotment');
                if (saved) return JSON.parse(saved);
            } catch { }
        }
        return null;
    });
    const [hasAgreedDeclaration, setHasAgreedDeclaration] = useState(false);
    const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);

    // Load data
    const data = require('@/lib/data/colleges_unified.json');
    const colleges = data.colleges;
    const allBranches = data.branches;

    // --- Candidate Profile ---
    const [userProfile, setUserProfile] = useState(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('sim_user_profile');
                if (saved) return JSON.parse(saved);
            } catch { }
        }
        return {
            studentName: '',
            kcetNumber: '',
            rank: '',
            category: 'GM',
            isKannadaMedium: false,
            isRural: false,
            isHydKar: false,
            gender: 'Male'
        };
    });

    const [cetNo, setCetNo] = useState<string>(() => {
        if (typeof window !== 'undefined') return localStorage.getItem('sim_cet_no') || '';
        return '';
    });
    const [cetNoInput, setCetNoInput] = useState('');
    const [isScanActive, setIsScanActive] = useState(false);
    const [isScraping, setIsScraping] = useState(false);

    const [authCetNo, setAuthCetNo] = useState('');
    const [authDob, setAuthDob] = useState('');
    const [authCaptcha, setAuthCaptcha] = useState('');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsScraping(true);

        try {
            // Dynamically load PDF.js from a stable CDN to completely bypass Next.js Webpack issues
            if (!(window as any).pdfjsLib) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
                    script.onload = () => {
                        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                        resolve(true);
                    };
                    script.onerror = reject;
                    document.body.appendChild(script);
                });
            }

            const pdfjsLib = (window as any).pdfjsLib;
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join('\n');
                fullText += pageText + '\n';
            }

            let name = '';
            let cetNo = '';
            let rank = '';

            const cetMatch = fullText.match(/Application Number\s*\n\s*([A-Z0-9]+)/i) || fullText.match(/CET\s*(?:No\.?|Number)\s*[:\-]?\s*\n?\s*([A-Z0-9]{6,8})/i);
            if (cetMatch) cetNo = cetMatch[1].trim();

            const nameMatch = fullText.match(/Name\s*\n\s*([^\n]+)/i) || fullText.match(/(?:Candidate'?s?\s*Name)\s*[:\-]?\s*\n?\s*([A-Za-z\s\.]+)/i);
            if (nameMatch) name = nameMatch[1].trim();

            const rankMatch = fullText.match(/Engineering\s*\n?\s*([0-9]+)/i);
            if (rankMatch) rank = rankMatch[1].trim();

            // Fallback for weird formatting
            if (!name || name === "Rank Details") {
                const strings = fullText.split('\n').map((s: string) => s.trim()).filter((s: string) => s);
                const nameIdx = strings.findIndex((s: string) => s.toLowerCase() === 'name');
                if (nameIdx !== -1 && nameIdx + 1 < strings.length) name = strings[nameIdx + 1];

                const appIdx = strings.findIndex((s: string) => s.toLowerCase() === 'application number');
                if (appIdx !== -1 && appIdx + 1 < strings.length) cetNo = strings[appIdx + 1];

                const engIdx = strings.findIndex((s: string) => s.toLowerCase().startsWith('engineering'));
                if (engIdx !== -1) {
                    const match = strings[engIdx].match(/Engineering\s*([0-9]+)/i);
                    if (match) rank = match[1];
                    else if (engIdx + 1 < strings.length) {
                        const matchNext = strings[engIdx + 1].match(/^([0-9]+)/);
                        if (matchNext) rank = matchNext[1];
                    }
                }
            }

            if (name || cetNo || rank) {
                const newProfile = {
                    ...userProfile,
                    studentName: name || userProfile.studentName,
                    kcetNumber: cetNo || userProfile.kcetNumber,
                    rank: rank || userProfile.rank,
                };

                setUserProfile(newProfile);

                // Immediately save to Firestore/backend so it persists!
                await saveSimulationState('profile', { userProfile: newProfile });

                alert('Successfully extracted details from PDF and saved to your profile!');
            } else {
                alert('Could not extract details. Please enter manually.');
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error parsing PDF. Please try again.");
        } finally {
            setIsScraping(false);
            if (e.target) e.target.value = '';
        }
    };

    // --- Auto-save to localStorage ---
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sim_user_profile', JSON.stringify(userProfile));
        }
    }, [userProfile]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (mockAllotment) localStorage.setItem('sim_mock_allotment', JSON.stringify(mockAllotment));
            else localStorage.removeItem('sim_mock_allotment');
        }
    }, [mockAllotment]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (selectedChoice !== null) localStorage.setItem('sim_selected_choice', String(selectedChoice));
            else localStorage.removeItem('sim_selected_choice');
        }
    }, [selectedChoice]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sim_choice_submitted', String(choiceSubmitted));
        }
    }, [choiceSubmitted]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sim_submitted_round', String(submittedRound));
        }
    }, [submittedRound]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (previousAllotment) localStorage.setItem('sim_previous_allotment', JSON.stringify(previousAllotment));
            else localStorage.removeItem('sim_previous_allotment');
        }
    }, [previousAllotment]);


    // Login is now managed entirely via `step === 'login'`
    // --- Persistence Logic ---
    useEffect(() => {
        const loadSavedData = async () => {
            const userId = user?.id || cetNo;
            if (!userId) return;
            try {
                const docRef = doc(db, 'users', userId, 'simulation', 'state');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const saved = docSnap.data();
                    if (saved.userProfile) setUserProfile(saved.userProfile);
                    if (saved.options) setOptions(saved.options);
                    if (saved.mockAllotment) setMockAllotment(saved.mockAllotment);
                    if (saved.selectedChoice) setSelectedChoice(saved.selectedChoice);
                    if (saved.choiceSubmitted) setChoiceSubmitted(saved.choiceSubmitted);
                    if (saved.submittedRound) setSubmittedRound(saved.submittedRound);
                    if (saved.previousAllotment) setPreviousAllotment(saved.previousAllotment);

                    // Auto-advance logic
                    if (saved.step) {
                        setStep(saved.step as any);
                    } else if (saved.userProfile?.rank) {
                        setStep('entry');
                    }
                }
            } catch (err) {
                console.error("Error loading simulation:", err);
            }
        };
        loadSavedData();
    }, [user, cetNo]);

    const saveSimulationState = async (currentStep: string, extraData = {}) => {
        const userId = user?.id || cetNo;
        if (!userId) return;
        try {
            await setDoc(doc(db, 'users', userId, 'simulation', 'state'), {
                userId: userId,
                email: user?.email || '',
                userProfile,
                options,
                mockAllotment,
                step: currentStep,
                currentRound: globalConfig?.currentRound || 1,
                submittedRound: submittedRound,
                previousAllotment: previousAllotment,
                updatedAt: serverTimestamp(),
                ...extraData
            }, { merge: true });
        } catch (err) {
            console.error("Error saving simulation:", err);
        }
    };

    // --- Global Config Fetching ---
    const [globalConfig, setGlobalConfig] = useState<any>({
        currentRound: 1,
        isResultsLive: true,
        resultsReleaseDate: "2025-06-15T10:00:00Z",
        nextRoundStartDate: "2025-06-20T10:00:00Z"
    });

    useEffect(() => {
        const configRef = doc(db, 'config', 'simulation_state');
        const unsubscribe = onSnapshot(configRef, (snapshot) => {
            if (snapshot.exists()) {
                setGlobalConfig(snapshot.data());
            }
        }, (err) => {
            console.error("Real-time config error:", err);
        });

        return () => unsubscribe();
    }, []);

    // --- Simulator State ---
    const [selectedStream, setSelectedStream] = useState<'course' | 'college'>('course');
    const [selectedBranch, setSelectedBranch] = useState('CSE');
    const [selectedCollege, setSelectedCollege] = useState(colleges[0]?.college_id || '');
    const [options, setOptions] = useState<Record<string, string>>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('sim_options');
                if (saved) return JSON.parse(saved);
            } catch { }
        }
        return {};
    }); // key: collegeId-branchId, value: priority string
    const [draftOptions, setDraftOptions] = useState<Record<string, string>>({});

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sim_options', JSON.stringify(options));
        }
    }, [options]);

    const representativeBranches = [
        { code: 'CSE', name: 'COMPUTER SCIENCE & ENGG' },
        { code: 'ISE', name: 'INFORMATION SCIENCE & ENGG' },
        { code: 'ECE', name: 'ELECTRONICS & COMMUNICATION ENGG' },
        { code: 'AIML', name: 'AI & MACHINE LEARNING' },
        { code: 'AIDS', name: 'AI & DATA SCIENCE' },
        { code: 'EEE', name: 'ELECTRICAL & ELECTRONICS ENGG' },
        { code: 'MECH', name: 'MECHANICAL ENGG' },
        { code: 'CIVIL', name: 'CIVIL ENGG' },
        { code: 'BT', name: 'BIO-TECHNOLOGY' },
        { code: 'CHEM', name: 'CHEMICAL ENGINEERING' },
        { code: 'CYBER', name: 'CYBER SECURITY ENGG' },
        { code: 'DS', name: 'DATA SCIENCES' },
        { code: 'EIE', name: 'ELECTRONICS & INSTRUMENTATION ENGG' },
        { code: 'ETE', name: 'ELECTRONICS & TELECOMMUNICATION ENGG' },
        { code: 'AERO', name: 'AERONAUTICAL ENGINEERING' },
        { code: 'ASE', name: 'AEROSPACE ENGINEERING' },
        { code: 'AUTO', name: 'AUTOMOBILE ENGINEERING' },
        { code: 'IEM', name: 'INDUSTRIAL ENGG & MANAGEMENT' },
        { code: 'RAI', name: 'ROBOTICS & ARTIFICIAL INTELLIGENCE' },
        { code: 'TT', name: 'TEXTILES TECHNOLOGY' }
    ];

    // Helper to find all raw IDs for a representative code
    const getRawBranchIds = (repCode: string) => {
        const branchIds: string[] = [repCode];
        if (repCode === 'CSE') branchIds.push('CS', 'BCS', 'BTCS', 'BTCS & EAI&ML');
        if (repCode === 'ISE') branchIds.push('IS', 'BIS');
        if (repCode === 'ECE') branchIds.push('EC', 'BEC', 'BTE & CE');
        if (repCode === 'AIML') branchIds.push('AI', 'ML', 'BTCS & EAI&ML');
        return branchIds;
    };

    // Derived: Selected Options for right pane
    const selectedOptions = Object.entries(options)
        .filter(([_, priority]) => priority !== '')
        .map(([key, priority]) => {
            const parts = key.split(':::');
            const cId = parts[0];
            const bId = parts[1];
            const college = colleges.find((c: any) => c.college_id === cId);
            const branch = representativeBranches.find(rb => rb.code === bId) || allBranches.find((b: any) => (b.branch_code || b.branch_id) === bId);
            return {
                priority: parseInt(priority),
                collegeId: cId,
                branchId: bId,
                collegeName: college?.full_name || college?.name || '',
                branchName: branch?.name || branch?.branch_name || bId,
                fees: college?.fees || 'N/A'
            };
        })
        .sort((a, b) => a.priority - b.priority);

    const handlePriorityChange = (collegeId: string, branchId: string, value: string) => {
        if (value !== '' && !/^\d+$/.test(value)) return;

        const targetKey = `${collegeId}:::${branchId}`;

        if (value === '') {
            handleDeleteOption(collegeId, branchId);
            return;
        }

        const newPrio = parseInt(value, 10);
        if (newPrio === 0) {
            handleDeleteOption(collegeId, branchId);
            return;
        }
        if (newPrio < 0) return;

        setOptions(prev => {
            const entries = Object.entries(prev)
                .filter(([k, v]) => k !== targetKey && v !== '')
                .map(([k, v]) => ({ key: k, prio: parseInt(v, 10) }))
                .sort((a, b) => a.prio - b.prio);

            const targetIndex = Math.min(newPrio - 1, entries.length);
            entries.splice(targetIndex, 0, { key: targetKey, prio: newPrio });

            const next: Record<string, string> = {};
            entries.forEach((item, index) => {
                next[item.key] = (index + 1).toString();
            });

            return next;
        });
    };

    const handleDeleteOption = (collegeId: string, branchId: string) => {
        setOptions(prev => {
            const next = { ...prev };
            delete next[`${collegeId}:::${branchId}`];
            // Auto-compress remaining options
            const remaining = Object.entries(next)
                .filter(([_, priority]) => priority !== '')
                .sort((a, b) => parseInt(a[1]) - parseInt(b[1]));

            const compressed: Record<string, string> = {};
            remaining.forEach(([k, _], i) => {
                compressed[k] = (i + 1).toString();
            });
            return compressed;
        });
    };

    const handleDraftChange = (collegeId: string, branchId: string, value: string) => {
        if (value !== '' && !/^\d+$/.test(value)) return;
        setDraftOptions(prev => ({ ...prev, [`${collegeId}:::${branchId}`]: value }));
    };

    const handleUpdateList = async () => {
        setIsSubmitting(true);
        setTimeout(async () => {
            // Start with current sorted list
            let ordered = [...selectedOptions]; // already sorted by priority

            // First, handle deletions (value=0 or empty)
            for (const key in draftOptions) {
                const val = draftOptions[key];
                if (val === '0' || val === '') {
                    ordered = ordered.filter(o => `${o.collegeId}:::${o.branchId}` !== key);
                }
            }

            // Then handle reorders: for each changed item, remove it and insert at new position
            for (const key in draftOptions) {
                const val = draftOptions[key];
                if (val === '0' || val === '') continue;
                const newPrio = parseInt(val, 10);
                if (isNaN(newPrio) || newPrio <= 0) continue;
                if (draftOptions[key] === options[key]) continue; // not changed

                // Remove the item from its current position
                const itemIdx = ordered.findIndex(o => `${o.collegeId}:::${o.branchId}` === key);
                if (itemIdx === -1) continue;
                const [item] = ordered.splice(itemIdx, 1);

                // Insert at the new target position (1-based → 0-based index)
                const insertAt = Math.min(Math.max(newPrio - 1, 0), ordered.length);
                ordered.splice(insertAt, 0, item);
            }

            // Compress: re-assign sequential priorities
            const compressed: Record<string, string> = {};
            ordered.forEach((item, index) => {
                compressed[`${item.collegeId}:::${item.branchId}`] = (index + 1).toString();
            });

            setOptions(compressed);
            await saveSimulationState('entry', { options: compressed });

            setDraftOptions({});
            setIsSubmitting(false);
        }, 500);
    };

    const handleFinalSubmit = () => {
        if (selectedOptions.length === 0) {
            alert('Please select at least one option before submitting.');
            return;
        }

        // Check for duplicate priorities
        const priorities = selectedOptions.map(o => o.priority);
        const uniquePriorities = new Set(priorities);
        if (uniquePriorities.size !== priorities.length) {
            alert('❌ Duplicate Option Numbers Found!\n\nYou have assigned the same priority number to multiple courses. Please ensure every course has a unique priority number.');
            return;
        }

        // Auto-compress gaps (e.g. 1, 2, 5 becomes 1, 2, 3)
        let hasGaps = false;
        const compressedOptions: Record<string, string> = {};
        selectedOptions.forEach((opt, index) => {
            const newPriority = index + 1;
            if (opt.priority !== newPriority) hasGaps = true;
            compressedOptions[`${opt.collegeId}:::${opt.branchId}`] = newPriority.toString();
        });

        if (hasGaps) {
            setOptions(compressedOptions);
        }

        setShowSubmitConfirm(true);
    };

    const handleFinalConfirm = async () => {
        setIsSubmitting(true);
        setShowSubmitConfirm(false);
        setTimeout(async () => {
            setIsSubmitting(false);
            // Calculate the allotment immediately on submit
            let allottedSeat = null;
            const userRank = parseInt(userProfile.rank?.replace(/,/g, ''));
            for (const opt of selectedOptions) {
                const col = colleges.find((c: any) => c.college_id === opt.collegeId);
                if (!col) continue;
                const branchCutoffs = col.kcet_cutoffs.filter((cut: any) =>
                    cut.branch_id === opt.branchId ||
                    getRawBranchIds(opt.branchId).includes(cut.branch_id)
                );
                const gmCutoff = branchCutoffs.find((cut: any) => cut.category === 'GM');
                const gmRank = gmCutoff?.r1 || gmCutoff?.r2 || gmCutoff?.r3 || null;
                const catCutoff = branchCutoffs.find((cut: any) => cut.category === userProfile.category);
                const catRank = catCutoff?.r1 || catCutoff?.r2 || catCutoff?.r3 || null;
                if ((gmRank && userRank <= gmRank) || (catRank && userRank <= catRank)) {
                    allottedSeat = {
                        collegeId: opt.collegeId,
                        collegeName: opt.collegeName,
                        branchId: opt.branchId,
                        branchName: opt.branchName,
                        cutoffRank: gmRank && userRank <= gmRank ? gmRank : catRank,
                        collegeFees: col.fees || "96,000",
                        choiceNo: opt.priority
                    };
                    break;
                }
            }
            setMockAllotment(allottedSeat);
            await saveSimulationState('landing', { mockAllotment: allottedSeat });
            setStep('landing');
        }, 1500);
    };

    const handleDownloadReport = () => {
        exportChoiceEntryToPDF(selectedOptions, {
            name: user?.name || 'CANDIDATE NAME',
            cetNo: cetNo,
            rank: `${userProfile.rank} (${userProfile.category})`
        });
    };

    const handleDownloadAllotment = () => {
        let allotment = mockAllotment;

        // Recalculate on the fly if it's missing just to be safe
        if (!allotment && selectedOptions.length > 0) {
            const userRank = parseInt(userProfile.rank?.replace(/,/g, '') || "0");
            for (const opt of selectedOptions) {
                const col = colleges.find((c: any) => c.college_id === opt.collegeId);
                if (!col) continue;
                const branchCutoffs = col.kcet_cutoffs.filter((cut: any) =>
                    cut.branch_id === opt.branchId ||
                    getRawBranchIds(opt.branchId).includes(cut.branch_id)
                );
                const gmCutoff = branchCutoffs.find((cut: any) => cut.category === 'GM');
                const gmRank = gmCutoff?.r1 || gmCutoff?.r2 || gmCutoff?.r3 || null;
                const catCutoff = branchCutoffs.find((cut: any) => cut.category === userProfile.category);
                const catRank = catCutoff?.r1 || catCutoff?.r2 || catCutoff?.r3 || null;
                if ((gmRank && userRank <= gmRank) || (catRank && userRank <= catRank)) {
                    allotment = {
                        collegeId: opt.collegeId,
                        collegeName: opt.collegeName || col.name,
                        branchId: opt.branchId,
                        branchName: opt.branchName,
                        cutoffRank: gmRank && userRank <= gmRank ? gmRank : catRank,
                        collegeFees: col.fees || "96,000",
                        choiceNo: opt.priority
                    };
                    break;
                }
            }
            if (allotment) {
                setMockAllotment(allotment);
                saveSimulationState('landing', { mockAllotment: allotment });
            }
        }

        if (!allotment) {
            alert('Unfortunately, your rank was too high to clear the cutoffs for any of your selected options. No seat could be allotted.');
            return;
        }

        exportAllotmentToPDF(allotment, {
            name: userProfile?.name || 'CANDIDATE',
            cetNo: userProfile?.kcetNumber || cetNo,
            rank: userProfile?.rank || 'N/A',
            category: userProfile?.category || 'GM'
        });
    };

    const handleCheckAllotment = async (downloadOnly = false) => {
        setIsSubmitting(true);
        setTimeout(async () => {
            let allottedSeat = null;

            // Find the best seat based on priority
            for (const opt of selectedOptions) {
                const col = colleges.find((c: any) => c.college_id === opt.collegeId);
                if (!col) continue;

                const branchCutoffs = col.kcet_cutoffs.filter((cut: any) =>
                    cut.branch_id === opt.branchId ||
                    getRawBranchIds(opt.branchId).includes(cut.branch_id)
                );

                const gmCutoff = branchCutoffs.find((cut: any) => cut.category === 'GM');
                const gmRank = gmCutoff?.r1 || gmCutoff?.r2 || gmCutoff?.r3;

                const catCutoff = branchCutoffs.find((cut: any) => cut.category === userProfile.category);
                const catRank = catCutoff?.r1 || catCutoff?.r2 || catCutoff?.r3;

                const userRank = Number(userProfile.rank);

                if ((gmRank && userRank <= gmRank) || (catRank && userRank <= catRank)) {
                    allottedSeat = {
                        collegeId: opt.collegeId,
                        collegeName: col.name,
                        branchId: opt.branchId,
                        branchName: opt.branchName,
                        cutoffRank: gmRank && userRank <= gmRank ? gmRank : catRank,
                        collegeFees: col.fees || "96,000",
                        choiceNo: opt.priority
                    };
                    break;
                }
            }

            setMockAllotment(allottedSeat);
            setIsSubmitting(false);
            await saveSimulationState('allotted', { mockAllotment: allottedSeat });

            if (downloadOnly) {
                exportAllotmentToPDF(allottedSeat, {
                    name: userProfile?.name || 'CANDIDATE',
                    cetNo: userProfile?.kcetNumber || cetNo,
                    rank: userProfile?.rank || 'N/A'
                });
            } else {
                setStep('allotment_result');
            }
        }, 1500);
    };

    const handleSubmitChoice = async () => {
        if (!selectedChoice) {
            alert('Please select a choice before submitting.');
            return;
        }
        setChoiceSubmitted(true);
        setSubmittedRound(globalConfig.currentRound);

        // If they choose Option 2, the current mock allotment becomes their "previous" held seat
        let updateData: any = {
            selectedChoice,
            choiceSubmitted: true,
            submittedRound: globalConfig.currentRound
        };

        if (selectedChoice === 2) {
            setPreviousAllotment(mockAllotment);
            updateData.previousAllotment = mockAllotment;
        } else if (selectedChoice === 3) {
            setPreviousAllotment(null);
            updateData.previousAllotment = null;
        }

        await saveSimulationState('allotted', updateData);
    };

    const choiceDescriptions = [
        {
            id: 1,
            title: "Choice 1 - FREEZE",
            desc: "Fully satisfied with the allotted seat. Ready to pay fees and report to college.",
            badge: "Out of Further Rounds",
            color: "emerald"
        },
        {
            id: 2,
            title: "Choice 2 - ACCEPT & UPGRADE",
            desc: `Satisfied with current seat but want to participate in Round ${globalConfig?.currentRound === 3 ? 'Counseling' : (globalConfig?.currentRound || 1) + 1} for higher options.`,
            badge: globalConfig?.currentRound === 3 ? "Invalid for Final Round" : `Round ${(globalConfig?.currentRound || 1) + 1} Eligible`,
            color: "blue"
        },
        {
            id: 3,
            title: "Choice 3 - REJECT & UPGRADE",
            desc: `Not satisfied with current seat. Rejecting it and participating in Round ${globalConfig?.currentRound === 3 ? 'Counseling' : (globalConfig?.currentRound || 1) + 1} directly.`,
            badge: globalConfig?.currentRound === 3 ? "Invalid for Final Round" : "Current Seat Lost",
            color: "amber"
        },
        {
            id: 4,
            title: "Choice 4 - EXIT",
            desc: "Not satisfied and leaving the counseling process completely.",
            badge: "Quit Counseling",
            color: "rose"
        }
    ];

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userProfile.rank || isNaN(Number(userProfile.rank))) {
            alert('Please enter a valid rank.');
            return;
        }
        setStep('landing');
        await saveSimulationState('landing');
    };

    const categories = ['GM', 'GMR', 'GMK', '1G', '1R', '1K', '2AG', '2AR', '2AK', '2BG', '2BR', '2BK', '3AG', '3AR', '3AK', '3BG', '3BR', '3BK', 'SCG', 'SCR', 'SCK', 'STG', 'STR', 'STK'];

    // Auth Check
    const { loginWithGoogle, setAsGuest, isLoading: authLoading, isGuest } = useAuth();

    useEffect(() => {
        if (user && step === 'login') {
            if (!cetNo) {
                const mockNo = `25U${user.id.slice(0, 4).toUpperCase()}${Math.floor(Math.random() * 99)}`;
                setCetNo(mockNo);
                localStorage.setItem('sim_cet_no', mockNo);
            }
            setStep('landing');
        }
    }, [user, step]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#00529B] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-bold text-[#00529B] animate-pulse">Establishing secure connection...</p>
                </div>
            </div>
        );
    }

    if (step === 'allotment_auth') {
        return (
            <div className="min-h-screen bg-white font-sans flex flex-col relative">
                {/* Header bar */}
                <div className="border-b-[3px] border-[#800000] p-4 flex items-center justify-center relative">
                    <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 flex flex-col items-center">
                        <CAPLogo />
                    </div>
                    <h1 className="text-[#800000] text-lg md:text-xl font-bold uppercase tracking-wide text-center max-w-[70%]">
                        ADMISSION TO UGCET & OTHER PROFESSIONAL COURSES- 2025
                    </h1>
                </div>

                <div className="max-w-3xl mx-auto mt-8 border border-gray-300 rounded shadow-sm w-full">
                    <div className="bg-[#0d6efd] text-white text-center py-4 px-2">
                        <h2 className="text-sm md:text-[15px] font-bold uppercase tracking-wide">UGCET/NEET & OTHER PROFESSIONAL COURSES -2025</h2>
                        <h3 className="text-sm md:text-[15px] font-bold uppercase tracking-wide mt-1">FIRST ROUND PROVISIONAL ALLOTMENT RESULTS (01-08-2025)</h3>
                    </div>
                    <div className="p-6 md:p-10 space-y-6 bg-white">
                        <div className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] items-center gap-4">
                            <label className="text-[13px] font-bold text-gray-800">CET No:</label>
                            <input type="text" value={authCetNo} onChange={e => setAuthCetNo(e.target.value)} className="border border-gray-300 rounded px-3 py-1.5 w-full max-w-md text-sm outline-none focus:border-blue-500" />
                        </div>

                        <div className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] items-center gap-4">
                            <label className="text-[13px] font-bold text-gray-800">Date Of Birth:</label>
                            <input type="date" value={authDob} onChange={e => setAuthDob(e.target.value)} className="border border-gray-300 rounded px-3 py-1.5 w-full max-w-[180px] text-sm text-gray-600 outline-none focus:border-blue-500" />
                        </div>

                        <div className="space-y-3 mt-8">
                            <label className="text-[13px] font-bold text-gray-800">Enter the text shown below:</label>
                            <div className="flex items-center gap-4 pl-8">
                                <div className="bg-white border border-gray-300 line-through tracking-[0.3em] text-lg font-mono italic px-6 py-2 select-none text-black relative overflow-hidden">
                                    C7YV9
                                </div>
                                <button className="bg-[#0d6efd] p-1.5 rounded hover:bg-blue-700 shadow flex items-center justify-center">
                                    <RefreshCw className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>

                        <div className="pt-2">
                            <input type="text" placeholder="Enter CAPTCHA" value={authCaptcha} onChange={e => setAuthCaptcha(e.target.value)} className="border border-gray-300 rounded px-3 py-2 w-full max-w-full text-sm focus:border-blue-500 focus:outline-none" />
                        </div>

                        <div className="flex justify-center pt-6 pb-2">
                            <button onClick={() => {
                                handleCheckAllotment(false);
                            }} className="bg-[#198754] hover:bg-[#157347] text-white font-bold py-2 px-8 rounded shadow text-[15px]">
                                Check
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto mt-6 border border-gray-300 p-6 bg-white shadow-sm mb-12">
                    <h4 className="text-gray-800 text-[15px] mb-4">NOTE:</h4>
                    <p className="text-[13px] font-bold text-gray-800 leading-relaxed">
                        1. AS this is First Round Provisional Seat Allotment result the candidate need not has to report to the allotted college.
                    </p>
                </div>

                <div className="absolute top-4 right-4 md:top-6 md:right-8">
                    <button
                        onClick={() => setStep('landing')}
                        className="text-gray-500 hover:text-blue-600 text-sm font-bold underline"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'allotment_result') {
        const today = new Date();
        const dateStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
        
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center py-10 px-4" style={{ fontFamily: 'Arial, sans-serif' }}>
                <div className="bg-white border border-gray-200 rounded-[4px] shadow-sm w-full max-w-[800px] p-4 md:p-8 relative">
                    
                    {/* CONGRATULATIONS BOX */}
                    <div className="bg-[#D1E7DD] rounded-[4px] py-3 mb-4 flex justify-center items-center">
                        <span className="text-[#0a58ca] text-[15px] md:text-[16px] font-bold tracking-wide">
                            🎉 CONGRATULATIONS
                        </span>
                    </div>

                    {/* HEADER BOX */}
                    <div className="bg-[#198754] rounded-[4px] py-2 mb-8">
                        <h2 className="text-white text-center text-[13px] md:text-[14px] font-bold tracking-wider">
                            UGCET/NEET -2025 MOCK ALLOTMENT RESULTS DT: {dateStr}
                        </h2>
                    </div>

                    {/* DETAILS TABLE */}
                    <div className="px-2 md:px-6 space-y-[16px]">
                        <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                            <div className="text-[14px] font-bold text-gray-900">CET No:</div>
                            <div className="text-[14px] text-[#0056b3]">{userProfile?.kcetNumber || cetNo}</div>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                            <div className="text-[14px] font-bold text-gray-900">Name of the Candidate:</div>
                            <div className="text-[14px] text-[#0056b3] uppercase">{userProfile?.studentName || 'CANDIDATE'}</div>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                            <div className="text-[14px] font-bold text-gray-900">Verified Category:</div>
                            <div className="text-[14px] text-[#0056b3] uppercase">{userProfile?.category || '2AG'}</div>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                            <div className="text-[14px] font-bold text-gray-900">Rank:</div>
                            <div className="text-[14px] text-[#0056b3]">Engineering - {userProfile?.rank}.00000000</div>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                            <div className="text-[14px] font-bold text-gray-900">Discipline:</div>
                            <div className="text-[14px] text-[#0056b3]">Engineering</div>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                            <div className="text-[14px] font-bold text-gray-900">College Allotted:</div>
                            <div className="text-[14px] text-[#0056b3] leading-relaxed uppercase pr-4">
                                {mockAllotment?.collegeName || 'NO SEAT ALLOTTED'}
                            </div>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                            <div className="text-[14px] font-bold text-gray-900">Course Allotted:</div>
                            <div className="text-[14px] text-[#0056b3] uppercase">
                                {mockAllotment ? `${mockAllotment.branchName} (${mockAllotment.branchId})` : 'N/A'}
                            </div>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                            <div className="text-[14px] font-bold text-gray-900">Category Allotted:</div>
                            <div className="text-[14px] text-[#0056b3] uppercase">{userProfile?.category || 'GM'}</div>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                            <div className="text-[14px] font-bold text-gray-900">Allotted Option Serial No:</div>
                            <div className="text-[14px] text-[#0056b3]">{mockAllotment?.choiceNo || 'N/A'}</div>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] md:grid-cols-[220px_1fr] items-start gap-2">
                            <div className="text-[14px] font-bold text-gray-900">Course Fees:</div>
                            <div className="text-[14px] text-[#0056b3]">
                                {mockAllotment?.collegeFees?.replace(/,/g, '') || '0'}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-12 mb-2 print:hidden">
                        <button
                            onClick={() => setStep('landing')}
                            className="bg-[#6c757d] hover:bg-[#5a6268] text-white text-[13px] px-6 py-1 rounded-[4px] shadow-sm flex items-center"
                        >
                            ...Back
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white text-[13px] px-6 py-1 rounded-[4px] shadow-sm flex items-center"
                        >
                            Print
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'login') {
        const handleCetLogin = () => {
            let trimmed = cetNoInput.trim().toUpperCase();
            if (!trimmed) {
                // Auto-generate a mock CET number if they just click login
                trimmed = `25U${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
            }
            localStorage.setItem('sim_cet_no', trimmed);
            setCetNo(trimmed);
            setAsGuest();
            setStep('landing');
        };

        return (
            <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: 'Arial, sans-serif' }}>
                {/* Header bar */}
                <div className="flex items-center justify-between px-4 md:px-8 py-3 bg-white border-b border-gray-200">
                    {/* Left: CAP Logo */}
                    <div className="flex flex-col shrink-0">
                        <div className="flex items-end relative -mb-0.5">
                            <div className="text-[#CE1126] font-sans font-bold text-[32px] md:text-[38px] tracking-tighter leading-none">CA</div>
                            <div className="relative">
                                {/* The Cap */}
                                <div className="absolute -top-[14px] -left-[10px] md:-top-[16px] md:-left-[12px] text-[#111] z-10 transform -rotate-[12deg]">
                                    <GraduationCap size={30} className="md:w-8 md:h-8 w-[26px] h-[26px]" fill="currentColor" strokeWidth={0.5} />
                                </div>
                                <div className="text-[#CE1126] font-sans font-bold text-[32px] md:text-[38px] tracking-tighter leading-none relative z-0">P</div>
                            </div>
                            <div className="text-[#111] font-sans font-medium text-[10px] md:text-[12px] uppercase mb-[4px] ml-1 leading-none tracking-tight">NIC</div>
                        </div>
                        <div className="text-gray-600 font-sans text-[7px] md:text-[8px] leading-[1.1] font-medium max-w-[140px] tracking-tight">
                            Centralised Seat Allotment Process<br />for Professional Degree Courses
                        </div>
                    </div>

                    {/* Center: Title */}
                    <div className="text-center flex-1 mx-4 pr-8 md:pr-[140px]">
                        <p className="text-[#8B2065] text-[13px] md:text-[16px] lg:text-[18px] uppercase leading-tight font-semibold" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                            ADMISSION TO UGCET &amp; OTHER PROFESSIONAL COURSES-
                        </p>
                        <p className="text-[#8B2065] text-[14px] md:text-[18px] lg:text-[20px] mt-0.5 font-semibold" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                            2026
                        </p>
                    </div>
                </div>

                {/* Bottom black line */}
                <div className="h-[2px] bg-black" />

                {/* Main content */}
                <div className="flex-1 flex items-center justify-center py-10 px-4">
                    <div className="w-full max-w-xs">
                        {/* Logos */}
                        <div className="flex items-center justify-center mb-0 w-full px-2">
                            <img
                                src="/ChatGPT%20Image%20Jun%207,%202026,%2011_35_02%20AM.png"
                                alt="KEA Banner"
                                className="w-full h-auto object-contain max-h-24"
                            />
                        </div>

                        {/* Heading */}
                        <h1 className="text-[22px] font-bold text-center text-[#0a3161] mb-6 -mt-3">Option Entry Login</h1>

                        {/* Step 1 */}
                        <div className="flex flex-col items-center gap-1.5 mb-3">
                            <div className="w-7 h-7 rounded-full bg-[#8B2065] text-white flex items-center justify-center text-sm font-bold shadow">
                                1
                            </div>
                            <p className="font-bold text-gray-700 text-sm text-center">Scan QR / Enter CETNO</p>
                            <p className="text-[11px] text-gray-500 text-center leading-snug">
                                You can find the QR, Application No, Cet No on<br />your verification slip.
                            </p>
                        </div>

                        {/* Input / Scan Area */}
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

                        {/* Start Scan */}
                        <button
                            onClick={() => setIsScanActive(v => !v)}
                            className="w-full bg-[#8B2065] hover:bg-[#701A51] text-white py-2 rounded text-sm font-semibold mb-1 transition-colors"
                        >
                            {isScanActive ? 'Scanning...' : 'Start Scan'}
                        </button>

                        {/* Stop Scan */}
                        <div className="text-center mb-2">
                            <button
                                onClick={() => setIsScanActive(false)}
                                className="text-xs text-gray-600 hover:text-gray-800 underline-offset-2 hover:underline"
                            >
                                Stop Scan
                            </button>
                        </div>

                        {/* Login with CETNO */}
                        <button
                            onClick={handleCetLogin}
                            className="w-full bg-[#8B2065] hover:bg-[#701A51] text-white py-2 rounded text-sm font-semibold transition-colors"
                        >
                            Login with CETNO
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3 my-4">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">or</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Google Login */}
                        <button
                            onClick={loginWithGoogle}
                            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:border-gray-400 py-2 rounded text-sm font-medium text-gray-700 transition-colors"
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                            Sign in with Google
                        </button>
                    </div>
                </div>

                {/* Bottom footer */}
                <div className="border-t-[2px] border-black py-4 px-4 md:px-12 w-full mt-auto">
                    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Left: KEA Logo */}
                        <div className="shrink-0 hidden md:block">
                            <KEALogo className="h-8 md:h-10 w-[100px] md:w-[130px] object-fill" />
                        </div>

                        {/* Center: Text */}
                        <div className="text-center flex-1 space-y-[2px]">
                            <p className="text-[10px] text-[#A60000] font-bold tracking-tight">
                                HELPLINE NUMBER <span className="font-sans">080-23460460 (10:30am-7:30pm)</span>
                            </p>
                            <p className="text-[9px] text-black font-bold mt-1">Brought to you by</p>
                            <p className="text-[9px] text-black font-bold">Executive Director, KEA</p>
                            <p className="text-[9px] text-black font-medium tracking-tight">Tel: 080-23460460, 23564583</p>
                            <p className="text-[9px] text-black font-medium tracking-tight">
                                Website: <span className="text-[#000080] font-bold underline">cetonline.karnataka.gov.in</span> / Version 1.0, Server-09
                            </p>
                            <p className="text-[8px] md:text-[9px] text-red-600 font-bold uppercase tracking-tight mt-2">
                                Disclaimer: This site is just a mock and is not affiliated with KEA in any way
                            </p>
                        </div>

                        {/* Right: NIC Logo */}
                        <div className="shrink-0 hidden md:block">
                            <NICLogo />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Landing page (Main Dashboard)
    if (step === 'landing') {
        return (
            <div className="min-h-screen bg-white flex flex-col font-sans" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
                {/* Dashboard Header */}
                <div className="border-b-[2px] border-gray-300 py-3 px-4 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    {/* Left: CAP Logo */}
                    <div className="shrink-0 mt-1">
                        <CAPLogo />
                    </div>

                    {/* Center: Title & Ranks */}
                    <div className="flex flex-col items-center flex-1 pt-1">
                        <h1 className="text-[#3b1222] text-[13px] md:text-[16px] lg:text-[17px] font-bold tracking-tight uppercase text-center" style={{ fontWeight: 800 }}>
                            ADMISSION TO UGCET &amp; OTHER PROFESSIONAL COURSES- 2026
                        </h1>
                        <RanksDropdown />
                    </div>

                    {/* Right: Nav Buttons */}
                    <div className="flex items-center gap-[4px] shrink-0 mt-2 md:mt-0">
                        <button onClick={() => setStep('landing')} className="px-[10px] py-[2px] text-[11px] font-bold border border-[#7A7A7A] rounded-[3px] bg-white text-[#000080] hover:bg-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">Home</button>
                        <button onClick={() => setStep('courses')} className="px-[10px] py-[2px] text-[11px] font-bold border border-[#7A7A7A] rounded-[3px] bg-white text-[#000080] hover:bg-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">Courses</button>
                        <button onClick={() => setStep('colleges')} className="px-[10px] py-[2px] text-[11px] font-bold border border-[#7A7A7A] rounded-[3px] bg-white text-[#000080] hover:bg-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">Colleges</button>
                        <button
                            className="px-[10px] py-[2px] text-[11px] font-bold border border-[#7A7A7A] rounded-[3px] bg-white text-[#000080] hover:bg-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                            onClick={() => {
                                setCetNo('');
                                localStorage.removeItem('sim_cet_no');
                                setStep('login');
                            }}
                        >
                            Log Out
                        </button>
                    </div>
                </div>

                {/* Dashboard Main Content */}
                <div className="w-full max-w-[1300px] mx-auto p-4 md:p-8 mt-2 flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Box 1: OPTION ENTRY */}
                        <div className="border border-gray-400 flex flex-col bg-white">
                            <div className="bg-[#0000FF] text-white text-center py-2 font-bold text-[13px] uppercase">
                                OPTION ENTRY
                            </div>
                            <div className="p-4 flex flex-col gap-5 text-[11px] font-bold text-black mt-2">
                                <div>
                                    <button onClick={() => {
                                        if (hasAgreedDeclaration) {
                                            if (userProfile.kcetNumber && userProfile.studentName && userProfile.rank) {
                                                setStep('entry');
                                            } else {
                                                setStep('profile');
                                            }
                                        } else {
                                            setStep('declaration');
                                        }
                                    }} className="text-blue-700 underline hover:text-blue-900 cursor-pointer text-left">
                                        Candidates Option Entry
                                    </button>
                                    <p className="text-black font-normal mt-1 mb-2">
                                        Please complete the payment to enable option entry.
                                    </p>
                                    <div className="h-px bg-gray-300 w-[85%]" />
                                </div>
                                <div>
                                    <a href="#" className="text-black hover:text-gray-700 cursor-pointer">Option Entry Example</a>
                                    <div className="h-px bg-gray-300 w-[85%] mt-3" />
                                </div>
                                <div>
                                    <a href="#" className="text-black hover:text-gray-700 cursor-pointer">Detailed Option Work Sheet</a>
                                    <div className="h-px bg-gray-300 w-[85%] mt-3" />
                                </div>
                                <div className="pb-4">
                                    <a href="#" className="text-black hover:text-gray-700 cursor-pointer">Print Option Report</a>
                                    <p className="mt-3">
                                        <a href="#" className="text-black hover:text-gray-700 cursor-pointer">Download Option Entry Report</a>
                                    </p>
                                    <p className="text-black font-normal mt-5 leading-relaxed pr-4">
                                        Click the 'Download Option Entry Report' link to download the option entry printout, which closes on 2026/06/25 00:00:00
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Middle Column */}
                        <div className="flex flex-col gap-6 md:gap-8">
                            {/* Box 2: ALLOTMENT */}
                            <div className="border border-gray-300 rounded shadow-sm flex flex-col bg-white">
                                <div className="bg-[#198754] text-white py-2 font-bold text-[14px] uppercase text-center flex justify-center items-center gap-2">
                                    ALLOTMENT
                                </div>
                                <div className="p-3 text-[11px] leading-relaxed">
                                    {mockAllotment ? (
                                        <div className="flex flex-col space-y-2.5 font-sans">
                                            <div className="grid grid-cols-[105px_1fr] gap-1">
                                                <div className="text-gray-800">Allotment<br />Session:</div>
                                                <div className="text-gray-600">1</div>
                                            </div>
                                            <div className="grid grid-cols-[105px_1fr] gap-1">
                                                <div className="text-gray-800">Candidate<br />Name:</div>
                                                <div className="text-gray-600 uppercase">{userProfile?.name || 'CANDIDATE'}</div>
                                            </div>
                                            <div className="grid grid-cols-[105px_1fr] gap-1">
                                                <div className="text-gray-800">Candidate<br />Category:</div>
                                                <div className="text-gray-600 uppercase">{userProfile?.category || 'GM'}</div>
                                            </div>
                                            <div className="grid grid-cols-[105px_1fr] gap-1">
                                                <div className="text-gray-800">College<br />Name:</div>
                                                <div className="text-gray-600 uppercase">{mockAllotment.collegeName}</div>
                                            </div>
                                            <div className="grid grid-cols-[105px_1fr] gap-1">
                                                <div className="text-gray-800">Course<br />Name:</div>
                                                <div className="text-gray-600 uppercase">{mockAllotment.branchName} ({mockAllotment.branchId})</div>
                                            </div>
                                            <div className="grid grid-cols-[105px_1fr] gap-1">
                                                <div className="text-gray-800 font-bold mt-1">Fees:</div>
                                                <div className="text-gray-600 mt-1">Rs. {mockAllotment.collegeFees?.replace(/,/g, '') || '0'}</div>
                                            </div>
                                            <div className="grid grid-cols-[105px_1fr] gap-1">
                                                <div className="text-gray-800 font-bold">Fees Paid:</div>
                                                <div className="text-gray-600">Rs. 0</div>
                                            </div>
                                            <div className="grid grid-cols-[105px_1fr] gap-1">
                                                <div className="text-gray-800 font-bold">Balance<br />Fees:</div>
                                                <div className="text-gray-600">Rs. {mockAllotment.collegeFees?.replace(/,/g, '') || '0'}</div>
                                            </div>
                                            <div className="mt-4 flex justify-center border-t border-gray-100 pt-3">
                                                <button onClick={() => setStep('allotment_auth')} className="text-blue-700 underline hover:text-blue-900 cursor-pointer text-[10px]">
                                                    First Round Provisional Allotment Results
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center min-h-[140px]">
                                            <div className="bg-[#f2f2f2] border border-gray-300 text-black text-[11px] font-bold px-4 py-4 text-center w-full max-w-[90%] shadow-inner rounded-sm">
                                                <button onClick={() => setStep('allotment_auth')} className="text-blue-700 underline hover:text-blue-900 cursor-pointer">
                                                    First Round Provisional Allotment Results
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Box 3: ADMISSION */}
                            <div className="border border-gray-400 flex flex-col bg-white">
                                <div className="bg-[#1C2833] text-white text-center py-2 font-bold text-[13px] uppercase">
                                    ADMISSION
                                </div>
                                <div className="p-5 flex flex-col gap-4 text-[11px] font-bold min-h-[140px]">
                                    <a href="#" className="text-blue-700 underline hover:text-blue-900 w-fit">Pay Online</a>
                                    <div className="h-px bg-gray-200 w-full my-1" />
                                    <a href="#" className="text-blue-700 underline hover:text-blue-900 w-fit">Payment Details</a>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div>
                            {/* Box 4: ACCOUNT SETTINGS */}
                            <div className="border border-gray-400 flex flex-col bg-white min-h-[180px]">
                                <div
                                    className="bg-[#FFA500] hover:bg-[#CC8400] text-white text-center py-2 font-bold text-[13px] uppercase cursor-pointer transition-colors"
                                    onClick={() => setStep('profile')}
                                >
                                    ACCOUNT SETTINGS
                                </div>
                                <div className="p-4 flex-1 flex flex-col gap-2 text-[11px] font-bold text-black mt-2 px-6">
                                    <div className="flex">
                                        <span className="w-24">CET No</span>
                                        <span>: {userProfile.kcetNumber || cetNo || 'Not set'}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-24">Name</span>
                                        <span className="truncate">: {userProfile.studentName || 'Not set'}</span>
                                    </div>
                                    <div className="flex">
                                        <span className="w-24">Rank</span>
                                        <span>: {userProfile.rank || 'Not set'}</span>
                                    </div>
                                    <div className="flex mt-2 text-blue-700 italic font-normal text-[10px]">
                                        Click 'Account Settings' above to edit.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Component inside Dashboard */}
                <div className="border-t-[2px] border-black py-4 px-4 md:px-12 w-full mt-auto">
                    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Left: KEA Logo */}
                        <div className="shrink-0 hidden md:block">
                            <KEALogo className="h-8 md:h-10 w-[100px] md:w-[130px] object-fill" />
                        </div>

                        {/* Center: Text */}
                        <div className="text-center flex-1 space-y-[2px]">
                            <p className="text-[10px] text-[#A60000] font-bold tracking-tight">
                                HELPLINE NUMBER <span className="font-sans">080-23460460 (10:30am-7:30pm)</span>
                            </p>
                            <p className="text-[9px] text-black font-bold mt-1">Brought to you by</p>
                            <p className="text-[9px] text-black font-bold">Executive Director, KEA</p>
                            <p className="text-[9px] text-black font-medium tracking-tight">Tel: 080-23460460, 23564583</p>
                            <p className="text-[9px] text-black font-medium tracking-tight">
                                Website: <span className="text-[#000080] font-bold underline">cetonline.karnataka.gov.in</span> / Version 1.0, Server-09
                            </p>
                            <p className="text-[8px] md:text-[9px] text-red-600 font-bold uppercase tracking-tight mt-2">
                                Disclaimer: This site is just a mock and is not affiliated with KEA in any way
                            </p>
                        </div>

                        {/* Right: NIC Logo */}
                        <div className="shrink-0 hidden md:block">
                            <NICLogo />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-[#B3D4FC]">
            {/* --- TOP HEADER BAR --- */}
            <header className="border-b border-gray-200 bg-[#F8F9FA] px-4 md:px-10 py-4">
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Left: CAP & Welcome */}
                    <div className="flex items-center gap-8">
                        <CAPLogo />
                    </div>

                    {/* Middle: Title */}
                    <div className="text-center">
                        <h1 className="text-[#A52A2A] text-lg md:text-2xl font-bold leading-tight tracking-tight uppercase max-w-md" style={{ fontWeight: 800 }}>
                            ADMISSION TO UGCET & OTHER PROFESSIONAL COURSES- 2026
                        </h1>
                    </div>

                    {/* Right: Nav Buttons */}
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-[4px] shrink-0 mt-2 md:mt-0">
                            <button
                                onClick={() => setStep('landing')}
                                className="px-[10px] py-[2px] text-[11px] font-bold border border-[#7A7A7A] rounded-[3px] bg-white text-[#000080] hover:bg-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                            >
                                Home
                            </button>
                            <button
                                onClick={() => setStep('courses')}
                                className={cn("px-[10px] py-[2px] text-[11px] font-bold border border-[#7A7A7A] rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors", step === 'courses' ? "bg-[#000080] text-white" : "bg-white text-[#000080] hover:bg-gray-50")}
                            >
                                Courses
                            </button>
                            <button
                                onClick={() => setStep('colleges')}
                                className={cn("px-[10px] py-[2px] text-[11px] font-bold border border-[#7A7A7A] rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors", step === 'colleges' ? "bg-[#000080] text-white" : "bg-white text-[#000080] hover:bg-gray-50")}
                            >
                                Colleges
                            </button>
                            <button
                                onClick={() => {
                                    setCetNo('');
                                    localStorage.removeItem('sim_cet_no');
                                    setStep('login');
                                }}
                                className="px-[10px] py-[2px] text-[11px] font-bold border border-[#7A7A7A] rounded-[3px] bg-white text-[#000080] hover:bg-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                            >
                                Log Out
                            </button>
                        </div>
                        <RanksDropdown />
                    </div>
                </div>
            </header>

            {/* --- MAIN LAYOUT --- */}
            <div className="flex min-h-[calc(100vh-200px)]">
                {/* CONTENT AREA */}
                <main className="flex-1 bg-white p-6 md:p-12 relative">
                    <AnimatePresence mode="wait">
                        {step === 'declaration' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full"
                            >
                                {/* Declaration Box */}
                                <div className="bg-white border border-gray-200 p-4 md:p-6 mt-2">
                                    <div className="flex gap-2 items-start">
                                        <input type="checkbox" className="mt-1 shrink-0" checked={isDeclarationChecked} onChange={e => setIsDeclarationChecked(e.target.checked)} />
                                        <p className="text-black text-[12px] font-bold leading-relaxed">
                                            I am aware that the options entered by me for the first round will continue as it is for all the subsequent rounds of online seat allotment. I also know that I will not be allowed to add the options again in next round, but I know that there is a provision to delete or alter or modify the order of options.
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            onClick={() => {
                                                if (!isDeclarationChecked) {
                                                    alert("Please check the declaration box before proceeding.");
                                                    return;
                                                }
                                                setHasAgreedDeclaration(true);
                                                if (userProfile.kcetNumber && userProfile.studentName && userProfile.rank) {
                                                    setStep('entry');
                                                } else {
                                                    setStep('profile');
                                                }
                                            }}
                                            className="bg-[#0000FF] hover:bg-blue-700 text-white px-5 py-[4px] rounded-[3px] font-bold text-[13px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all"
                                        >
                                            I Agree
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 'profile' && (
                            <div className="w-full max-w-4xl mx-auto mt-4">
                                <div className="border border-gray-400 flex flex-col bg-white">
                                    <div className="bg-[#FFA500] text-white py-[6px] px-4 font-bold text-[13px] uppercase flex justify-between items-center">
                                        <span>Account Settings - Candidate Profile</span>
                                    </div>

                                    <form onSubmit={handleProfileSubmit} className="p-6">
                                        <div className="flex justify-end mb-4">
                                            <label className="bg-[#0000FF] hover:bg-blue-700 text-white cursor-pointer px-3 py-[4px] text-[11px] font-bold rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all">
                                                {isScraping ? 'Scraping...' : 'Upload KCET Result PDF (Auto Scrape)'}
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    className="hidden"
                                                    onChange={handleFileUpload}
                                                    disabled={isScraping}
                                                />
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-[12px] font-bold text-black">Student Name</label>
                                                <input
                                                    type="text"
                                                    value={userProfile.studentName}
                                                    onChange={(e) => setUserProfile({ ...userProfile, studentName: e.target.value })}
                                                    className="w-full border border-gray-400 px-2 py-1 text-[12px] focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-[12px] font-bold text-black">KCET Number</label>
                                                <input
                                                    type="text"
                                                    value={userProfile.kcetNumber}
                                                    onChange={(e) => setUserProfile({ ...userProfile, kcetNumber: e.target.value })}
                                                    className="w-full border border-gray-400 px-2 py-1 text-[12px] focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-[12px] font-bold text-black">General Rank *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={userProfile.rank}
                                                    onChange={(e) => setUserProfile({ ...userProfile, rank: e.target.value })}
                                                    className="w-full border border-gray-400 px-2 py-1 text-[12px] focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-[12px] font-bold text-black">Reservation Category</label>
                                                <select
                                                    value={userProfile.category}
                                                    onChange={(e) => setUserProfile({ ...userProfile, category: e.target.value })}
                                                    className="w-full border border-gray-400 px-2 py-1 text-[12px] focus:outline-none focus:border-blue-500"
                                                >
                                                    {categories.map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <label className="text-[12px] font-bold text-black mb-2 block">Other Details</label>
                                            <div className="flex flex-col gap-2">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={userProfile.isKannadaMedium}
                                                        onChange={(e) => setUserProfile({ ...userProfile, isKannadaMedium: e.target.checked })}
                                                        className="mt-[1px]"
                                                    />
                                                    <span className="text-[12px] font-bold text-black">Kannada Medium Candidate</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={userProfile.isRural}
                                                        onChange={(e) => setUserProfile({ ...userProfile, isRural: e.target.checked })}
                                                        className="mt-[1px]"
                                                    />
                                                    <span className="text-[12px] font-bold text-black">Rural Candidate</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex justify-center">
                                            <button
                                                type="submit"
                                                className="bg-[#0000FF] hover:bg-blue-700 text-white px-6 py-[4px] rounded-[3px] font-bold text-[13px] shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-all"
                                            >
                                                Save & Continue
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {step === 'entry' && (
                            <div className="space-y-8 pb-32">
                                {/* Round & Seat Status Banner */}
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border-2 border-gray-100 p-6 rounded-3xl shadow-sm">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shadow-inner">
                                            <Zap className="w-8 h-8 text-[#00529B]" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Round {globalConfig.currentRound} Option Entry</h2>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Counseling Phase :: Live</p>
                                        </div>
                                    </div>

                                    {previousAllotment && (
                                        <div className="bg-emerald-50 border-2 border-emerald-100 px-6 py-4 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
                                            <div className="p-2 bg-emerald-500 rounded-lg text-white">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Seat Held from Round {submittedRound}</p>
                                                <p className="text-sm font-black text-emerald-900">{previousAllotment.collegeName}</p>
                                                <p className="text-[9px] font-bold text-emerald-600 uppercase">{previousAllotment.branchName}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="w-full flex gap-2"
                                >
                                    {/* --- LEFT SIDE: OPTION ENTRY (50%) --- */}
                                    <div className={cn("border border-[#b0b0b0] flex flex-col bg-white", globalConfig.currentRound === 1 ? "w-1/2" : "w-[60%] items-center justify-center p-12 text-center")}>
                                        {globalConfig.currentRound === 1 ? (
                                            <>
                                                {/* Header Tab */}
                                                <div className="bg-[#00BFFF] text-white px-3 py-1.5 text-[13px] font-bold flex justify-between items-center border-b border-[#b0b0b0]">
                                                    <span>Option Entry</span>
                                                    <a href="#" className="font-normal underline cursor-pointer hover:text-blue-100">View more about college details</a>
                                                </div>

                                                {/* Filters Panel */}
                                                <div className="p-2 bg-white border-b border-[#b0b0b0] flex flex-col gap-2">
                                                    {/* Row 1 */}
                                                    <div className="flex items-center gap-6">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[12px] font-bold text-black">Select Discipline:</span>
                                                            <select className="border border-gray-400 rounded-sm px-1 py-0.5 text-[12px] text-black w-48 shadow-inner bg-white">
                                                                <option>Engineering</option>
                                                            </select>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[12px] font-bold text-black">Filter by:</span>
                                                            <select className="border border-gray-400 rounded-sm px-1 py-0.5 text-[12px] text-black w-48 shadow-inner bg-white">
                                                                <option>Select</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    {/* Row 2 */}
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[12px] font-bold text-black">Select Stream:</span>
                                                            <label className="flex items-center gap-1 text-[12px] font-bold text-black cursor-pointer">
                                                                <input type="radio" name="stream" checked={selectedStream === 'course'} onChange={() => setSelectedStream('course')} className="accent-[#00529B]" /> Course
                                                            </label>
                                                            <label className="flex items-center gap-1 text-[12px] font-bold text-black cursor-pointer ml-2">
                                                                <input type="radio" name="stream" checked={selectedStream === 'college'} onChange={() => setSelectedStream('college')} className="accent-[#00529B]" /> College
                                                            </label>
                                                        </div>
                                                        <select
                                                            value={selectedStream === 'course' ? selectedBranch : selectedCollege}
                                                            onChange={(e) => selectedStream === 'course' ? setSelectedBranch(e.target.value) : setSelectedCollege(e.target.value)}
                                                            className="border border-gray-400 rounded-sm px-2 py-0.5 text-[12px] text-black flex-1 max-w-xl shadow-inner bg-white"
                                                        >
                                                            {selectedStream === 'course' ? (
                                                                representativeBranches.map((rb) => (
                                                                    <option key={rb.code} value={rb.code}>{rb.code} - {rb.name}</option>
                                                                ))
                                                            ) : (
                                                                colleges.map((c: any) => (
                                                                    <option key={c.college_id} value={c.college_id}>{c.college_id} - {c.name}</option>
                                                                ))
                                                            )}
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Table Header */}
                                                <div className="bg-[#E0FFFF] border-b border-[#b0b0b0] flex text-[12px] font-bold text-black items-stretch">
                                                    <div className="w-12 text-center py-2 border-r border-[#b0b0b0] flex items-center justify-center">SL.No.</div>
                                                    <div className="flex-1 px-4 py-2 border-r border-[#b0b0b0] flex items-center">College Course</div>
                                                    <div className="w-48 text-center py-2 border-r border-[#b0b0b0] flex items-center justify-center leading-tight">Course Fees per Annum (Rs.)</div>
                                                    <div className="w-20 text-center py-2 flex items-center justify-center leading-tight">Option<br />No</div>
                                                </div>

                                                {/* List Items */}
                                                <div className="flex-1 overflow-y-auto max-h-[600px] divide-y divide-gray-100 bg-gray-50/20">
                                                    {(() => {
                                                        let filteredRows: any[] = [];

                                                        if (selectedStream === 'course') {
                                                            const aliases = getRawBranchIds(selectedBranch);
                                                            const matchingColleges = colleges.filter((c: any) =>
                                                                c.kcet_cutoffs.some((cut: any) => aliases.includes(cut.branch_id) || cut.branch_id.startsWith(selectedBranch))
                                                            ).slice(0, 100);

                                                            const repBranch = representativeBranches.find(rb => rb.code === selectedBranch);

                                                            filteredRows = matchingColleges.map((c: any) => ({
                                                                college: c,
                                                                branch: repBranch || { code: selectedBranch, name: selectedBranch },
                                                                courseCode: c.kcet_cutoffs.find((cut: any) => aliases.includes(cut.branch_id) || cut.branch_id.startsWith(selectedBranch))?.branch_id || ''
                                                            }));
                                                        } else {
                                                            const targetColId = selectedCollege || colleges[0]?.college_id;
                                                            const col = colleges.find((c: any) => c.college_id === targetColId);

                                                            if (col) {
                                                                // Get all unique branch IDs available in this college
                                                                const rawBranchIds = Array.from(new Set(col.kcet_cutoffs.map((cut: any) => cut.branch_id))) as string[];

                                                                filteredRows = rawBranchIds.map(id => {
                                                                    // Priority finding: 1. Exact/Alias, 2. Partial prefix (with caution)
                                                                    let rep = representativeBranches.find(rb => id === rb.code || getRawBranchIds(rb.code).includes(id));

                                                                    // Fallback to prefix if no direct match, but avoid greedy 'BT' matches for B.Tech
                                                                    if (!rep && !id.startsWith('BTCS') && !id.startsWith('BTE')) {
                                                                        rep = representativeBranches.find(rb => id.startsWith(rb.code));
                                                                    }

                                                                    // Prefer the raw name from the dataset if available for accuracy
                                                                    const branchData = allBranches.find((b: any) => (b.branch_code || b.branch_id) === id);
                                                                    const displayName = branchData?.branch_name || (rep ? rep.name : id);

                                                                    return {
                                                                        college: col,
                                                                        branch: {
                                                                            code: rep?.code || id,
                                                                            name: displayName
                                                                        },
                                                                        courseCode: id
                                                                    };
                                                                });
                                                            }
                                                        }

                                                        if (filteredRows.length === 0) {
                                                            return (
                                                                <div className="p-20 text-center text-gray-400 font-medium italic">
                                                                    No data found for the selected criteria.
                                                                </div>
                                                            );
                                                        }

                                                        return filteredRows.map((row, i) => {
                                                            const bCode = row.branch.code || row.branch.branch_code || row.branch.branch_id;
                                                            const bName = row.branch.name || row.branch.branch_name || bCode;
                                                            const key = `${row.college.college_id}:::${bCode}`;

                                                            return (
                                                                <div key={key} className="flex border-b border-[#E0E0E0] hover:bg-[#F0FFFF] transition-colors items-stretch">
                                                                    <div className="w-12 text-center py-2 border-r border-[#E0E0E0] text-[12px] text-black flex items-center justify-center">{i + 1}</div>
                                                                    <div className="flex-1 px-4 py-2 border-r border-[#E0E0E0] text-[12px] text-black leading-snug">
                                                                        <span className="font-bold">{row.college.college_id} - {row.college.name}</span><br />
                                                                        {bCode} - {bName}
                                                                    </div>
                                                                    <div className="w-48 text-center py-2 border-r border-[#E0E0E0] text-[12px] font-bold text-black flex items-center justify-center">
                                                                        {row.college.fees || '0'}
                                                                    </div>
                                                                    <div className="w-20 flex flex-col items-center justify-center p-1 bg-[#E0FFFF]/30">
                                                                        <input
                                                                            type="text"
                                                                            value={options[key] || ''}
                                                                            onChange={(e) => handlePriorityChange(row.college.college_id, bCode, e.target.value)}
                                                                            className="w-10 h-6 border border-gray-400 text-center text-[12px] font-bold text-black focus:bg-[#FFFACD] outline-none shadow-inner"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            );
                                                        });
                                                    })()}
                                                </div>

                                                {/* Footer Action */}
                                                <div className="p-4 bg-white border-t border-[#b0b0b0] text-center flex flex-col items-center gap-1">
                                                    <button
                                                        onClick={handleFinalSubmit}
                                                        disabled={isSubmitting}
                                                        className="bg-[#0099FF] hover:bg-[#007acc] text-white px-4 py-1.5 font-bold text-[13px] rounded-sm transition-all"
                                                    >
                                                        {isSubmitting ? 'Verifying...' : 'Save & Submit'}
                                                    </button>
                                                    <p className="text-[11px] text-[#8B0000] font-bold mt-1">Please click on the Save and Submit button every 2 minutes to save your options</p>
                                                    <p className="text-[11px] text-[#8B0000] font-bold">NOTE: N/A Fees shall be updated shortly.</p>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
                                                <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-amber-100/50">
                                                    <Lock className="w-10 h-10 text-amber-500" />
                                                </div>
                                                <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest mb-2">Fresh Entry Disabled</h3>
                                                <p className="text-sm font-bold text-gray-500 max-w-md leading-relaxed">
                                                    As per KEA rules, fresh option entry is not allowed in Round {globalConfig.currentRound}. You can only re-order or delete your existing options using the panel on the right.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* --- RIGHT SIDE: SELECTED OPTIONS (50%) --- */}
                                    <div className={cn("border border-[#b0b0b0] flex flex-col bg-white transition-all", globalConfig.currentRound === 1 ? "w-1/2" : "w-[40%]")}>
                                        <div className="bg-[#006400] text-white px-3 py-1.5 text-[13px] font-bold border-b border-[#b0b0b0]">
                                            Modify Selected Options
                                        </div>

                                        {/* Table Header */}
                                        <div className="bg-[#E8F5E9] border-b border-[#b0b0b0] flex text-[11px] font-bold text-black items-stretch">
                                            <div className="w-14 text-center py-1 border-r border-[#b0b0b0] leading-tight flex items-center justify-center">College<br />Course</div>
                                            <div className="w-12 text-center py-1 border-r border-[#b0b0b0] leading-tight flex items-center justify-center">Option<br />No</div>
                                            <div className="flex-1 text-center py-1 border-r border-[#b0b0b0] flex items-center justify-center">College Name</div>
                                            <div className="w-32 text-center py-1 border-r border-[#b0b0b0] flex items-center justify-center">Course Name</div>
                                            <div className="w-16 text-center py-1 flex items-center justify-center">Fees</div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto bg-white">
                                            {selectedOptions.length === 0 ? (
                                                <div className="p-8 text-center text-[12px] text-gray-500 italic">No options selected yet.</div>
                                            ) : (
                                                <div className="space-y-0">
                                                    <Reorder.Group
                                                        axis="y"
                                                        values={selectedOptions.map(opt => `${opt.collegeId}:::${opt.branchId}`)}
                                                        onReorder={(newOrder: string[]) => {
                                                            const newOptions = { ...options };
                                                            newOrder.forEach((key, index) => {
                                                                newOptions[key] = (index + 1).toString();
                                                            });
                                                            setOptions(newOptions);
                                                        }}
                                                        className="divide-y divide-[#E0E0E0]"
                                                    >
                                                        {selectedOptions.map((opt) => {
                                                            const itemKey = `${opt.collegeId}:::${opt.branchId}`;
                                                            return (
                                                                <Reorder.Item
                                                                    key={itemKey}
                                                                    value={itemKey}
                                                                    className="flex items-stretch text-[11px] text-black bg-white hover:bg-gray-50 cursor-grab active:cursor-grabbing border-b border-[#E0E0E0] group relative"
                                                                >
                                                                    <div className="w-14 text-center py-2 border-r border-[#E0E0E0] bg-[#E8F5E9] flex flex-col items-center justify-center font-bold text-[10px]">
                                                                        {opt.collegeId}<br />{opt.branchId}
                                                                    </div>
                                                                    <div className="w-12 text-center py-2 border-r border-[#E0E0E0] bg-[#E8F5E9] flex flex-col items-center justify-center">
                                                                        <input
                                                                            type="text"
                                                                            value={draftOptions[`${opt.collegeId}:::${opt.branchId}`] ?? options[`${opt.collegeId}:::${opt.branchId}`] ?? ''}
                                                                            onChange={(e) => handleDraftChange(opt.collegeId, opt.branchId, e.target.value)}
                                                                            className="w-7 h-5 border border-gray-400 text-center text-[11px] font-bold bg-white focus:bg-[#FFFACD] outline-none shadow-inner"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 px-2 py-2 border-r border-[#E0E0E0] flex items-center">
                                                                        {opt.collegeName}
                                                                    </div>
                                                                    <div className="w-32 px-2 py-2 border-r border-[#E0E0E0] flex items-center">
                                                                        {opt.branchName}
                                                                    </div>
                                                                    <div className="w-16 text-center py-2 flex items-center justify-center text-[10px]">
                                                                        {opt.fees}
                                                                    </div>
                                                                </Reorder.Item>
                                                            );
                                                        })}
                                                    </Reorder.Group>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Side Footer */}
                                        <div className="bg-white border-t border-[#b0b0b0] p-3 text-center">
                                            <p className="text-[12px] text-[#800000] font-bold mb-2">You can re-order or delete options. Enter 0 to delete options.</p>
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={handleUpdateList}
                                                    disabled={isSubmitting}
                                                    className="bg-[#006400] text-white font-bold text-[13px] px-6 py-1 border-2 border-black rounded-[3px] shadow-sm hover:bg-[#004d00] transition-colors"
                                                >
                                                    {isSubmitting ? 'Updating...' : 'Update'}
                                                </button>
                                                <button
                                                    onClick={handleDownloadReport}
                                                    className="bg-[#006400] text-white font-bold text-[13px] px-4 py-1 border-2 border-black rounded-[3px] shadow-sm hover:bg-[#004d00] transition-colors flex items-center gap-2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                                    Download Option Entry Report
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {step === 'courses' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-6xl mx-auto space-y-8"
                            >
                                <div className="text-center">
                                    <h2 className="text-[#00529B] text-3xl font-bold">Engineering Course List</h2>
                                </div>

                                <div className="border border-gray-200 shadow-sm bg-white overflow-hidden">
                                    {/* Category Header */}
                                    <div className="bg-[#E9D8E2] px-6 py-2 border-b border-gray-200">
                                        <span className="text-[11px] font-black text-gray-700 uppercase tracking-widest">Engineering</span>
                                    </div>

                                    {/* 3-Column Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                                        {/* Column 1 */}
                                        <div className="flex flex-col">
                                            {[
                                                { code: 'CSE', name: 'COMPUTER SCIENCE & ENGG' },
                                                { code: 'ISE', name: 'INFORMATION SCIENCE & ENGG' },
                                                { code: 'ECE', name: 'ELECTRONICS & COMMUNICATION ENGG' },
                                                { code: 'AIML', name: 'AI & MACHINE LEARNING' },
                                                { code: 'AIDS', name: 'AI & DATA SCIENCE' },
                                                { code: 'EEE', name: 'ELECTRICAL & ELECTRONICS ENGG' },
                                                { code: 'MECH', name: 'MECHANICAL ENGG' }
                                            ].map((course, idx) => (
                                                <div key={idx} className="px-4 py-2 hover:bg-gray-50 flex gap-2 border-b border-gray-100 last:border-0">
                                                    <span className="text-[10px] font-black text-[#00529B] shrink-0">{course.code} -</span>
                                                    <span className="text-[10px] font-bold text-gray-600 leading-tight uppercase">{course.name}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Column 2 */}
                                        <div className="flex flex-col">
                                            {[
                                                { code: 'CIVIL', name: 'CIVIL ENGG' },
                                                { code: 'BT', name: 'BIO-TECHNOLOGY' },
                                                { code: 'CHEM', name: 'CHEMICAL ENGINEERING' },
                                                { code: 'CYBER', name: 'CYBER SECURITY ENGG' },
                                                { code: 'DS', name: 'DATA SCIENCES' },
                                                { code: 'EIE', name: 'ELECTRONICS & INSTRUMENTATION ENGG' },
                                                { code: 'ETE', name: 'ELECTRONICS & TELECOMMUNICATION ENGG' }
                                            ].map((course, idx) => (
                                                <div key={idx} className="px-4 py-2 hover:bg-gray-50 flex gap-2 border-b border-gray-100 last:border-0">
                                                    <span className="text-[10px] font-black text-[#00529B] shrink-0">{course.code} -</span>
                                                    <span className="text-[10px] font-bold text-gray-600 leading-tight uppercase">{course.name}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Column 3 */}
                                        <div className="flex flex-col">
                                            {[
                                                { code: 'AERO', name: 'AERONAUTICAL ENGINEERING' },
                                                { code: 'ASE', name: 'AEROSPACE ENGINEERING' },
                                                { code: 'AUTO', name: 'AUTOMOBILE ENGINEERING' },
                                                { code: 'IEM', name: 'INDUSTRIAL ENGG & MANAGEMENT' },
                                                { code: 'RAI', name: 'ROBOTICS & ARTIFICIAL INTELLIGENCE' },
                                                { code: 'TT', name: 'TEXTILES TECHNOLOGY' }
                                            ].map((course, idx) => (
                                                <div key={idx} className="px-4 py-2 hover:bg-gray-50 flex gap-2 border-b border-gray-100 last:border-0">
                                                    <span className="text-[10px] font-black text-[#00529B] shrink-0">{course.code} -</span>
                                                    <span className="text-[10px] font-bold text-gray-600 leading-tight uppercase">{course.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={() => setStep('entry')}
                                        className="text-[#00529B] text-xs font-bold underline hover:no-underline"
                                    >
                                        Return to Option Entry
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'colleges' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-7xl mx-auto space-y-4"
                            >
                                <div className="text-center space-y-2">
                                    <h2 className="text-[#00529B] text-2xl font-bold">Engineering College List</h2>
                                    <p className="text-[#6B2D8C] text-[10px] font-bold">
                                        Type = G-Government, A-Private Aided, B-Private Unaided, C-Deemed University, M-Minority (L,R)
                                    </p>
                                </div>

                                <div className="border border-gray-200 shadow-sm bg-white overflow-hidden flex flex-col max-h-[70vh]">
                                    <div className="overflow-y-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-[#E9D8E2] border-b border-gray-300 sticky top-0 z-10">
                                                <tr className="text-[10px] font-black text-gray-700 uppercase">
                                                    <th className="p-3 border-r border-gray-200 w-12 text-center">S/N</th>
                                                    <th className="p-3 border-r border-gray-200 w-12 text-center">Type</th>
                                                    <th className="p-3 border-r border-gray-200 w-16">Code</th>
                                                    <th className="p-3 border-r border-gray-200">College Name</th>
                                                    <th className="p-3 text-center">Courses</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {require('@/lib/data/colleges_unified.json').colleges
                                                    .map((college: any, idx: number) => {
                                                        const type = idx % 5 === 0 ? 'G' : idx % 5 === 1 ? 'A' : idx % 5 === 2 ? 'B' : idx % 5 === 3 ? 'C' : 'M';
                                                        const mockCourses = ['AD', 'CE', 'CS', 'EC', 'EE', 'IE', 'ME'];
                                                        return (
                                                            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#F8F9FA]"}>
                                                                <td className="p-3 border-r border-gray-200 text-center text-[11px] font-bold text-gray-400">{idx + 1}</td>
                                                                <td className="p-3 border-r border-gray-200 text-center text-[11px] font-black text-gray-600">{type}</td>
                                                                <td className="p-3 border-r border-gray-200 text-[11px] font-black text-[#00529B]">{college.college_id}</td>
                                                                <td className="p-3 border-r border-gray-200 text-[11px] font-bold text-gray-700 uppercase">{college.name}</td>
                                                                <td className="p-3">
                                                                    <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                                                                        {mockCourses.slice(0, 4 + (idx % 4)).map((c, i) => (
                                                                            <span key={i} className="text-[10px] font-black text-gray-600 border-b border-rose-400">
                                                                                {c}{i < 3 + (idx % 4) ? ',' : ''}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button
                                        onClick={() => setStep('entry')}
                                        className="text-[#00529B] text-xs font-bold underline hover:no-underline"
                                    >
                                        Return to Option Entry
                                    </button>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>


                    {/* --- Submission Confirmation Modal --- */}
                    <AnimatePresence>
                        {showSubmitConfirm && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowSubmitConfirm(false)}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                                >
                                    <div className="bg-[#008000] p-8 text-white text-center space-y-2">
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <ShieldCheck className="w-8 h-8 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-black uppercase tracking-tight">Final Submission</h2>
                                        <p className="text-green-100 text-[11px] font-bold">Review your choices before locking them in the database.</p>
                                    </div>

                                    <div className="p-8 space-y-8">
                                        <div className="bg-[#E8F5E9] border border-[#A5D6A7] p-5 rounded-2xl space-y-3">
                                            <div className="flex items-center gap-3 text-[#2E7D32]">
                                                <FileText className="w-5 h-5" />
                                                <span className="text-xs font-black uppercase tracking-widest">Pre-Submission Report</span>
                                            </div>
                                            <p className="text-[11px] text-[#388E3C] font-bold leading-relaxed">
                                                It is highly recommended to download and verify your options list one last time before final submission.
                                            </p>
                                            <button
                                                onClick={handleDownloadReport}
                                                className="w-full bg-white border-2 border-[#81C784] text-[#2E7D32] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#C8E6C9] transition-all shadow-sm"
                                            >
                                                Download Choice List (PDF)
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between px-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Choices</span>
                                                <span className="text-[10px] font-black text-[#008000] bg-green-50 px-2 py-0.5 rounded">{selectedOptions.length} Items</span>
                                            </div>
                                            <div className="max-h-40 overflow-y-auto border border-gray-100 rounded-xl bg-gray-50/50 p-2 custom-scrollbar space-y-1">
                                                {selectedOptions.map(opt => (
                                                    <div key={`${opt.collegeId}:::${opt.branchId}`} className="text-[9px] font-bold text-gray-600 flex gap-3 p-2 bg-white rounded border border-gray-100/50">
                                                        <span className="text-[#008000] font-black">{opt.priority}</span>
                                                        <span className="truncate">{opt.collegeName} - {opt.branchId}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-2">
                                            <button
                                                onClick={() => setShowSubmitConfirm(false)}
                                                className="flex-1 px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all"
                                            >
                                                Go Back
                                            </button>
                                            <button
                                                onClick={handleFinalConfirm}
                                                className="flex-3 bg-[#008000] hover:bg-[#006400] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-100 transition-all active:scale-95 flex items-center justify-center gap-3"
                                            >
                                                Declare & Submit
                                                <ChevronDown className="w-4 h-4 -rotate-90" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* --- FOOTER --- */}
            <div className="border-t-[2px] border-black py-4 px-4 md:px-12 w-full mt-auto bg-white">
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Left: KEA Logo */}
                    <div className="shrink-0 hidden md:block">
                        <KEALogo className="h-8 md:h-10 w-[100px] md:w-[130px] object-fill" />
                    </div>

                    {/* Center: Text */}
                    <div className="text-center flex-1 space-y-[2px]">
                        <p className="text-[10px] text-[#A60000] font-bold tracking-tight">
                            HELPLINE NUMBER <span className="font-sans">080-23460460 (10:30am-7:30pm)</span>
                        </p>
                        <p className="text-[9px] text-black font-bold mt-1">Brought to you by</p>
                        <p className="text-[9px] text-black font-bold">Executive Director, KEA</p>
                        <p className="text-[9px] text-black font-medium tracking-tight">Tel: 080-23460460, 23564583</p>
                        <p className="text-[9px] text-black font-medium tracking-tight">
                            Website: <span className="text-[#000080] font-bold underline">cetonline.karnataka.gov.in</span> / Version 1.0, Server-09
                        </p>
                        <p className="text-[8px] md:text-[9px] text-red-600 font-bold uppercase tracking-tight mt-2">
                            Disclaimer: This site is just a mock and is not affiliated with KEA in any way
                        </p>
                    </div>

                    {/* Right: NIC Logo */}
                    <div className="shrink-0 hidden md:block">
                        <NICLogo />
                    </div>
                </div>
            </div>
        </div>
    );
}

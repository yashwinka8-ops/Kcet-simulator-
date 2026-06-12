'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { exportChoiceEntryToPDF } from '@/lib/utils/choice-report';
import { exportAllotmentToPDF } from '@/lib/utils/allotment-report';
import allData from '@/lib/data/all_data.json';
import { getRawBranchIds, getRoundLabel } from '@/lib/utils/cutoff-link';
import { runKcetAllotment, type KcetRound } from '@/lib/utils/allotment-engine';

import {
    Zap,
    Clock,
    Monitor,
    ShieldCheck,
    FileText,
    ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';
import PageFooter from '@/components/PageFooter';
import { MainHeader } from '@/components/DashboardHeader';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import DeclarationPage from './pages/DeclarationPage';
import ProfilePage from './pages/ProfilePage';
import EntryPage from './pages/EntryPage';
import CoursesPage from './pages/CoursesPage';
import CollegesPage from './pages/CollegesPage';
import AllotmentAuthPage from './pages/AllotmentAuthPage';
import AllotmentResultPage from './pages/AllotmentResultPage';
import ChoiceEntryPage from './pages/ChoiceEntryPage';

type CollegeRecord = {
    college_id: string;
    name?: string;
    full_name?: string;
    fees?: string;
    kcet_cutoffs?: unknown;
} & Record<string, unknown>;

type BranchRecord = {
    branch_id?: string;
    branch_code?: string;
    branch_name?: string;
    name?: string;
};

const linkedCollegeData = allData as unknown as { colleges: CollegeRecord[]; branches: BranchRecord[] };
const linkedColleges = linkedCollegeData.colleges;

export default function CounselingSimulator() {
    const { user, isAdmin } = useAuth();
    const [step, setStepState] = useState<'login' | 'landing' | 'declaration' | 'profile' | 'entry' | 'courses' | 'colleges' | 'allotment_auth' | 'allotment_result' | 'choice_entry' | 'privacy'>('login');

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

    const [hasAgreedDeclaration, setHasAgreedDeclaration] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('sim_has_agreed_declaration') === 'true';
        }
        return false;
    });
    const [isDeclarationChecked, setIsDeclarationChecked] = useState(false);

    // Load data
    const colleges = linkedColleges;
    const allBranches = linkedCollegeData.branches;

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
            localStorage.setItem('sim_has_agreed_declaration', String(hasAgreedDeclaration));
        }
    }, [hasAgreedDeclaration]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (previousAllotment) localStorage.setItem('sim_previous_allotment', JSON.stringify(previousAllotment));
            else localStorage.removeItem('sim_previous_allotment');
        }
    }, [previousAllotment]);



    // --- Persistence Logic ---
    useEffect(() => {
        const loadSavedData = () => {
            const userId = user?.id || cetNo;
            if (!userId) return;
            try {
                const raw = localStorage.getItem('simulation_state_' + userId);
                if (!raw) return;
                const saved = JSON.parse(raw);
                if (saved.userProfile) setUserProfile(saved.userProfile);
                if (saved.options) setOptions(saved.options);
                if (saved.mockAllotment) setMockAllotment(saved.mockAllotment);
                if (saved.selectedChoice) setSelectedChoice(saved.selectedChoice);
                if (saved.choiceSubmitted) setChoiceSubmitted(saved.choiceSubmitted);
                if (saved.submittedRound !== undefined) setSubmittedRound(saved.submittedRound);
                if (saved.previousAllotment) setPreviousAllotment(saved.previousAllotment);


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
            const state = {
                userId: userId,
                email: user?.email || '',
                userProfile,
                options,
                mockAllotment,
                step: currentStep,
                currentRound: globalConfig?.currentRound ?? 0,
                submittedRound: submittedRound,
                previousAllotment: previousAllotment,
                updatedAt: new Date().toISOString(),
                ...extraData
            };
            localStorage.setItem('simulation_state_' + userId, JSON.stringify(state));
        } catch (err) {
            console.error("Error saving simulation:", err);
        }
    };

    // --- Global Config ---
    const [globalConfig, setGlobalConfig] = useState<any>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('sim_global_config');
                if (saved) return JSON.parse(saved);
            } catch { }
        }
        return {
            currentRound: 0,
            isResultsLive: true,
            resultsReleaseDate: "2026-06-15T10:00:00Z",
            nextRoundStartDate: "2026-06-20T10:00:00Z"
        };
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sim_global_config', JSON.stringify(globalConfig));
        }
    }, [globalConfig]);

    // --- Simulator State ---
    const [selectedStream, setSelectedStream] = useState<'course' | 'college'>('course');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedCollege, setSelectedCollege] = useState('');
    const [options, setOptions] = useState<Record<string, string>>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('sim_options');
                if (saved) return JSON.parse(saved);
            } catch { }
        }
        return {};
    });
    const [draftOptions, setDraftOptions] = useState<Record<string, string>>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('sim_draft_options');
                if (saved) return JSON.parse(saved);
            } catch { }
        }
        return {};
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sim_options', JSON.stringify(options));
        }
    }, [options]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('sim_draft_options', JSON.stringify(draftOptions));
        }
    }, [draftOptions]);

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

    // Derived: Selected Options for right pane
    const selectedOptions = Object.entries(options)
        .filter(([_, priority]) => priority !== '')
        .map(([key, priority]) => {
            const parts = key.split(':::');
            const cId = parts[0];
            const bId = parts[1];
            const college = colleges.find((c: any) => c.college_id === cId);
            const repBranch = representativeBranches.find(rb => rb.code === bId);
            const rawBranch = allBranches.find((b: any) => (b.branch_code || b.branch_id) === bId);
            const rawName = (rawBranch as any)?.branch_name || (rawBranch as any)?.name || '';
            const cleanedRawName = rawName.replace(/\s+/g, ' ').trim();
            const branchName = repBranch?.name || cleanedRawName || (bId.startsWith('NEW_') ? 'OTHER ENGINEERING' : bId);
            return {
                priority: parseInt(priority),
                collegeId: cId,
                branchId: bId,
                collegeName: college?.full_name || college?.name || '',
                branchName: branchName || bId,
                fees: college?.fees || 'N/A'
            };
        })
        .sort((a, b) => a.priority - b.priority);

    /**
     * Runs the KEA-accurate allotment engine.
     * Uses the round-specific JSON file (Mock / R1 / R2 / R3) so data
     * never mixes between rounds.
     * Returns null if no option clears the cutoff.
     */
    const findAllotmentFromOptions = async () => {
        const studentRank = parseInt(String(userProfile.rank || '').replace(/,/g, ''), 10);
        if (!studentRank || isNaN(studentRank)) return null;

        return runKcetAllotment({
            options: selectedOptions.map(o => ({
                priority:    o.priority,
                collegeId:   o.collegeId,
                collegeName: o.collegeName,
                branchId:    o.branchId,
                branchName:  o.branchName,
                fees:        o.fees,
            })),
            studentRank,
            category:        userProfile.category || 'GM',
            isRural:         !!userProfile.isRural,
            isKannadaMedium: !!userProfile.isKannadaMedium,
            round:           (globalConfig?.currentRound ?? 0) as KcetRound,
        });
    };

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
            let ordered = [...selectedOptions];

            for (const key in draftOptions) {
                const val = draftOptions[key];
                if (val === '0' || val === '') {
                    ordered = ordered.filter(o => `${o.collegeId}:::${o.branchId}` !== key);
                }
            }

            for (const key in draftOptions) {
                const val = draftOptions[key];
                if (val === '0' || val === '') continue;
                const newPrio = parseInt(val, 10);
                if (isNaN(newPrio) || newPrio <= 0) continue;
                if (draftOptions[key] === options[key]) continue;

                const itemIdx = ordered.findIndex(o => `${o.collegeId}:::${o.branchId}` === key);
                if (itemIdx === -1) continue;
                const [item] = ordered.splice(itemIdx, 1);

                const insertAt = Math.min(Math.max(newPrio - 1, 0), ordered.length);
                ordered.splice(insertAt, 0, item);
            }

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

        const priorities = selectedOptions.map(o => o.priority);
        const uniquePriorities = new Set(priorities);
        if (uniquePriorities.size !== priorities.length) {
            alert('❌ Duplicate Option Numbers Found!\n\nYou have assigned the same priority number to multiple courses. Please ensure every course has a unique priority number.');
            return;
        }

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

        const confirmed = window.confirm("DECLARATION:\n\nI have verified all my options and I am ready to submit. I understand that these choices will be considered for the mock allotment based on 2025 cutoffs.\n\nProceed with Final Submission?");
        if (confirmed) {
            handleFinalConfirm();
        }
    };

    const handleFinalConfirm = async () => {
        setIsSubmitting(true);
        setTimeout(async () => {
            setIsSubmitting(false);
            setStep('landing');
        }, 1500);
    };

    const handleCheckAllotment = async (downloadOnly = false) => {
        if (selectedOptions.length === 0 && !previousAllotment && !mockAllotment) {
            alert('Please complete your Option Entry first before checking the allotment result.');
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        setTimeout(async () => {
            const allottedSeat = await findAllotmentFromOptions();

            setMockAllotment(allottedSeat);
            setIsSubmitting(false);
            await saveSimulationState('landing', { mockAllotment: allottedSeat });

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

    const handleDownloadReport = () => {
        exportChoiceEntryToPDF(selectedOptions, {
            name: userProfile.studentName || user?.name || 'CANDIDATE NAME',
            cetNo: userProfile.kcetNumber || cetNo,
            rank: `${userProfile.rank} (${userProfile.category})`
        });
    };

    const handleDownloadAllotment = async () => {
        if (selectedOptions.length === 0 && !mockAllotment && !previousAllotment) {
            alert('Please complete your Option Entry first before downloading the allotment result.');
            return;
        }

        let allotment = mockAllotment;

        if (!allotment && selectedOptions.length > 0) {
            allotment = await findAllotmentFromOptions();
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

    const handleSubmitChoice = async () => {
        if (!selectedChoice) {
            alert('Please select a choice before submitting.');
            return;
        }
        setChoiceSubmitted(true);
        setSubmittedRound(globalConfig.currentRound);

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

        await saveSimulationState('landing', updateData);
    };

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
    const { loginWithGoogle, logout, setAsGuest, isLoading: authLoading, isGuest } = useAuth();

    useEffect(() => {
        if (user && step === 'login') {
            if (!cetNo) {
                const mockNo = `25U${user.id.slice(0, 4).toUpperCase()}${Math.floor(Math.random() * 99)}`;
                setCetNo(mockNo);
                localStorage.setItem('sim_cet_no', mockNo);
            }
            setStep('profile');
        }
    }, [user, step]);

    const handleLogin = (cetId: string) => {
        localStorage.setItem('sim_cet_no', cetId);
        setCetNo(cetId);
        setAsGuest();
        setStep('profile');
    };

    const handleLogout = () => {
        const confirmed = window.confirm(
            '⚠️ WARNING: Are you sure you want to logout?\n\n' +
            'Logging out will effectively RESET ALL DATA if you are using a randomly generated CET Number. ' +
            'This means you will lose access to:\n\n' +
            '• All your Option Entries\n' +
            '• All Provisional Allotment Results\n' +
            '• All Submitted Choices\n' +
            '• Your Candidate Profile\n\n' +
            'Click OK to proceed and start fresh.'
        );
        if (!confirmed) return;

        setCetNo('');
        localStorage.removeItem('sim_cet_no');
        logout();
        setStep('login');
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
                    <img
                        src="https://cetonline.karnataka.gov.in/kea/assets/images/kea-logo-kan.png"
                        alt="KEA Logo"
                        className="h-12 grayscale object-fill"
                    />
                    <img src="/NIC.png" alt="NIC Logo" className="h-10 md:h-12 object-contain opacity-80" />
                </div>
            </div>
        );
    }

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
            <AllotmentAuthPage
                onNavigate={setStep}
                authCetNo={authCetNo}
                setAuthCetNo={setAuthCetNo}
                authDob={authDob}
                setAuthDob={setAuthDob}
                authCaptcha={authCaptcha}
                setAuthCaptcha={setAuthCaptcha}
                handleCheckAllotment={handleCheckAllotment}
                currentRound={globalConfig?.currentRound ?? 0}
            />
        );
    }

    if (step === 'allotment_result') {
        return (
            <AllotmentResultPage
                userProfile={userProfile}
                cetNo={cetNo}
                mockAllotment={mockAllotment}
                onNavigate={setStep}
                currentRound={globalConfig?.currentRound ?? 0}
            />
        );
    }

    if (step === 'login') {
        return <LoginPage onLogin={handleLogin} />;
    }

    if (step === 'privacy') {
        return <PrivacyPolicyPage onNavigate={setStep} userProfile={userProfile} />;
    }

    if (step === 'landing') {
        return (
            <LandingPage
                onNavigate={setStep}
                onLogout={handleLogout}
                userProfile={userProfile}
                mockAllotment={mockAllotment}
                hasAgreedDeclaration={hasAgreedDeclaration}
                globalConfig={globalConfig}
                setGlobalConfig={setGlobalConfig}
                setMockAllotment={setMockAllotment}
                selectedChoice={selectedChoice}
                setSelectedChoice={setSelectedChoice}
                choiceSubmitted={choiceSubmitted}
                setChoiceSubmitted={setChoiceSubmitted}
                setPreviousAllotment={setPreviousAllotment}
                setOptions={setOptions}
                setUserProfile={setUserProfile}
                handleDownloadReport={handleDownloadReport}
            />
        );
    }

    const hasProfile = !!(userProfile.kcetNumber && userProfile.studentName && userProfile.rank);

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-[#B3D4FC]">
            {/* --- TOP HEADER BAR --- */}
            <MainHeader
                step={step}
                userProfile={userProfile}
                onNavigate={setStep}
                onLogout={() => {
                    setCetNo('');
                    localStorage.removeItem('sim_cet_no');
                    setStep('login');
                }}
            />

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
                                <DeclarationPage
                                    isDeclarationChecked={isDeclarationChecked}
                                    setIsDeclarationChecked={setIsDeclarationChecked}
                                    setHasAgreedDeclaration={setHasAgreedDeclaration}
                                    onNavigate={setStep}
                                    hasProfile={hasProfile}
                                />
                            </motion.div>
                        )}

                        {step === 'profile' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <ProfilePage
                                    userProfile={userProfile}
                                    setUserProfile={setUserProfile}
                                    onNavigate={setStep}
                                    handleFileUpload={handleFileUpload}
                                    isScraping={isScraping}
                                    categories={categories}
                                    handleProfileSubmit={handleProfileSubmit}
                                    globalConfig={globalConfig}
                                    setGlobalConfig={setGlobalConfig}
                                    setMockAllotment={setMockAllotment}
                                    setSelectedChoice={setSelectedChoice}
                                    setChoiceSubmitted={setChoiceSubmitted}
                                    setPreviousAllotment={setPreviousAllotment}
                                    setOptions={setOptions}
                                />
                            </motion.div>
                        )}

                        {step === 'entry' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <EntryPage
                                    globalConfig={globalConfig}
                                    previousAllotment={previousAllotment}
                                    submittedRound={submittedRound}
                                    selectedStream={selectedStream}
                                    setSelectedStream={setSelectedStream}
                                    selectedBranch={selectedBranch}
                                    setSelectedBranch={setSelectedBranch}
                                    selectedCollege={selectedCollege}
                                    setSelectedCollege={setSelectedCollege}
                                    options={options}
                                    draftOptions={draftOptions}
                                    setDraftOptions={setDraftOptions}
                                    representativeBranches={representativeBranches}
                                    getRawBranchIds={getRawBranchIds}
                                    colleges={colleges}
                                    allBranches={allBranches}
                                    handlePriorityChange={handlePriorityChange}
                                    handleDraftChange={handleDraftChange}
                                    handleUpdateList={handleUpdateList}
                                    handleFinalSubmit={handleFinalSubmit}
                                    handleDownloadReport={handleDownloadReport}
                                    selectedOptions={selectedOptions}
                                    isSubmitting={isSubmitting}
                                    choiceSubmitted={choiceSubmitted}
                                />
                            </motion.div>
                        )}

                        {step === 'courses' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <CoursesPage onNavigate={setStep} />
                            </motion.div>
                        )}

                        {step === 'colleges' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <CollegesPage onNavigate={setStep} colleges={colleges} />
                            </motion.div>
                        )}

                        {step === 'choice_entry' && (
                            <ChoiceEntryPage 
                                mockAllotment={mockAllotment}
                                selectedChoice={selectedChoice}
                                setSelectedChoice={setSelectedChoice}
                                choiceSubmitted={choiceSubmitted}
                                setChoiceSubmitted={setChoiceSubmitted}
                                onNavigate={setStep}
                                globalConfig={globalConfig}
                            />
                        )}

                    </AnimatePresence>
                </main>
            </div>

            {/* --- FOOTER --- */}
            <PageFooter />
        </div>
    );
}

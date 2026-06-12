'use client';

import React from 'react';
import { motion, Reorder } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Zap, ShieldCheck, Lock } from 'lucide-react';
import { getRoundLabel } from '@/lib/utils/cutoff-link';

interface EntryPageProps {
    globalConfig: any;
    previousAllotment: any;
    submittedRound: number;
    selectedStream: 'course' | 'college';
    setSelectedStream: (v: 'course' | 'college') => void;
    selectedBranch: string;
    setSelectedBranch: (v: string) => void;
    selectedCollege: string;
    setSelectedCollege: (v: string) => void;
    options: Record<string, string>;
    draftOptions: Record<string, string>;
    setDraftOptions: (v: Record<string, string>) => void;
    representativeBranches: { code: string; name: string }[];
    getRawBranchIds: (code: string) => string[];
    colleges: any[];
    allBranches: any[];
    handlePriorityChange: (collegeId: string, branchId: string, value: string) => void;
    handleDraftChange: (collegeId: string, branchId: string, value: string) => void;
    handleUpdateList: () => Promise<void>;
    handleFinalSubmit: () => void;
    handleDownloadReport: () => void;
    selectedOptions: any[];
    isSubmitting: boolean;
    choiceSubmitted?: boolean;
}

export default function EntryPage({
    globalConfig,
    previousAllotment,
    submittedRound,
    selectedStream,
    setSelectedStream,
    selectedBranch,
    setSelectedBranch,
    selectedCollege,
    setSelectedCollege,
    options,
    draftOptions,
    setDraftOptions,
    representativeBranches,
    getRawBranchIds,
    colleges,
    allBranches,
    handlePriorityChange,
    handleDraftChange,
    handleUpdateList,
    handleFinalSubmit,
    handleDownloadReport,
    selectedOptions,
    isSubmitting,
    choiceSubmitted = false,
}: EntryPageProps) {
    const currentRound = globalConfig?.currentRound ?? 0;
    const canAddFreshOptions = currentRound <= 1 && !choiceSubmitted;

    return (
        <div className="space-y-8 pb-32">


            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full flex gap-2"
            >
                {/* --- LEFT SIDE: OPTION ENTRY (50%) --- */}
                <div className={cn("border border-[#b0b0b0] flex flex-col bg-white", canAddFreshOptions ? "w-1/2" : "w-[60%] items-center justify-center p-12 text-center")}>
                    {canAddFreshOptions ? (
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
                                            <option value="">Select</option>
                                            <option value="Engineering">Engineering</option>
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
                                        <option value="">-- Select {selectedStream === 'course' ? 'Course' : 'College'} --</option>
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

                                    if (selectedStream === 'course' && selectedBranch) {
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
                                    } else if (selectedStream === 'college' && selectedCollege) {
                                        const targetColId = selectedCollege;
                                        const col = colleges.find((c: any) => c.college_id === targetColId);

                                        if (col) {
                                            const rawBranchIds = Array.from(new Set(col.kcet_cutoffs.map((cut: any) => cut.branch_id))) as string[];

                                             filteredRows = rawBranchIds.map(id => {
                                                let rep = representativeBranches.find(rb => id === rb.code || getRawBranchIds(rb.code).includes(id));

                                                if (!rep && !id.startsWith('BTCS') && !id.startsWith('BTE')) {
                                                    rep = representativeBranches.find(rb => id.startsWith(rb.code));
                                                }

                                                const branchData = allBranches.find((b: any) => (b.branch_code || b.branch_id) === id);
                                                // Clean up condensed names (PDF extraction sometimes strips spaces between words)
                                                const rawName = branchData?.branch_name || branchData?.name || '';
                                                const cleanedName = rawName.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\s+/g, ' ').trim();
                                                // Never show NEW_X as display text — use cleaned name or rep branch name
                                                const displayName = cleanedName || (rep ? rep.name : id.startsWith('NEW_') ? 'OTHER ENGINEERING' : id);

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

                                    if (!selectedBranch && !selectedCollege) {
                                        return (
                                            <div className="p-20 text-center text-gray-500 font-medium">
                                                Please select a Course or College from the dropdown above to view options.
                                            </div>
                                        );
                                    }

                                    // Deduplicate by representative code (bCode) per college
                                    const seenKeys = new Set();
                                    filteredRows = filteredRows.filter(row => {
                                        const bCode = row.branch.code || row.branch.branch_code || row.branch.branch_id;
                                        const key = `${row.college.college_id}:::${bCode}`;
                                        if (seenKeys.has(key)) return false;
                                        seenKeys.add(key);
                                        return true;
                                    });

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
                                As per KEA rules, fresh option entry is not allowed in {choiceSubmitted ? getRoundLabel(2, 'long') : getRoundLabel(currentRound, 'long')}. You can only re-order or delete your existing options using the panel on the right.
                            </p>
                        </div>
                    )}
                </div>

                {/* --- RIGHT SIDE: SELECTED OPTIONS (50%) --- */}
                <div className={cn("border border-[#b0b0b0] flex flex-col bg-white transition-all", canAddFreshOptions ? "w-1/2" : "w-[40%]")}>
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
    );
}

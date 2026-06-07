const fs = require('fs');
let code = fs.readFileSync('src/app/[[...slug]]/ClientPage.tsx', 'utf8');

// Replace Chunk 1: Left Container, Header, Filter Bar
code = code.replace(
/className="w-full flex gap-1"\s*>\s*{\/\* --- LEFT SIDE: OPTION ENTRY \(70%\) --- \*\/}\s*<div className={cn\("border border-gray-200 shadow-sm flex flex-col bg-white", globalConfig\.currentRound === 1 \? "w-\[70%\]" : "w-\[60%\] items-center justify-center p-12 text-center"\)}>\s*{globalConfig\.currentRound === 1 \? \(\s*<>\s*{\/\* Header Tab \*\/}\s*<div className="bg-\[#4FC3F7\] text-white px-4 py-2 text-xs font-bold shadow-sm">\s*Option Entry\s*<\/div>\s*{\/\* Filters Panel \*\/}\s*<div className="p-4 bg-\[#F8F9FA\] border-b border-gray-200 space-y-4">\s*{\/\* IMPORTANT NOTE \*\/}[\s\S]*?<\/div>\s*<select\s*value={selectedStream === 'course' \? selectedBranch : selectedCollege}[\s\S]*?<\/select>\s*<\/div>\s*<\/div>/,
`className="w-full flex gap-2"
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
                                        <div className="p-2 bg-white border-b border-[#b0b0b0] flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[12px] font-bold text-black">Select Discipline:</span>
                                                <select className="border border-gray-400 rounded-sm px-1 py-0.5 text-[12px] text-black w-48 shadow-inner bg-white">
                                                    <option>Select</option>
                                                    <option>Engineering</option>
                                                </select>
                                            </div>
                                            
                                            {/* Minimal stream/college selector */}
                                            <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
                                                <span className="text-[10px] font-bold text-gray-500">Filter:</span>
                                                <div className="flex items-center gap-2">
                                                    <label className="flex items-center gap-1 text-[10px] font-bold cursor-pointer">
                                                        <input type="radio" name="stream" checked={selectedStream === 'course'} onChange={() => setSelectedStream('course')} className="accent-[#00529B]" /> Course
                                                    </label>
                                                    <label className="flex items-center gap-1 text-[10px] font-bold cursor-pointer">
                                                        <input type="radio" name="stream" checked={selectedStream === 'college'} onChange={() => setSelectedStream('college')} className="accent-[#00529B]" /> College
                                                    </label>
                                                </div>
                                                <select 
                                                    value={selectedStream === 'course' ? selectedBranch : selectedCollege}
                                                    onChange={(e) => selectedStream === 'course' ? setSelectedBranch(e.target.value) : setSelectedCollege(e.target.value)}
                                                    className="border border-gray-400 rounded-sm px-1 py-0.5 text-[12px] text-black w-32 shadow-inner bg-white"
                                                >
                                                    {selectedStream === 'course' ? (
                                                        representativeBranches.map((rb) => (
                                                            <option key={rb.code} value={rb.code}>{rb.code}</option>
                                                        ))
                                                    ) : (
                                                        colleges.map((c) => (
                                                            <option key={c.college_id} value={c.college_id}>{c.college_id}</option>
                                                        ))
                                                    )}
                                                </select>
                                            </div>
                                        </div>`
);

// Replace Chunk 2: Left Table Header
code = code.replace(
/<div className="bg-\[#D8EDF9\] border-b border-gray-300 flex text-\[10px\] font-black text-\[#00529B\] uppercase px-4 py-2">\s*<div className="w-12 text-center">Sl\.No\.<\/div>\s*<div className="flex-1 px-4">College Course<\/div>\s*<div className="w-48 text-center">Course Fees per Annum \(Rs\)<\/div>\s*<div className="w-20 text-center">Option No<\/div>\s*<\/div>/,
`<div className="bg-[#E0FFFF] border-b border-[#b0b0b0] flex text-[12px] font-bold text-black items-stretch">
                                            <div className="w-12 text-center py-2 border-r border-[#b0b0b0] flex items-center justify-center">SL.No.</div>
                                            <div className="flex-1 px-4 py-2 border-r border-[#b0b0b0] flex items-center">College Course</div>
                                            <div className="w-48 text-center py-2 border-r border-[#b0b0b0] flex items-center justify-center leading-tight">Course Fees per Annum (Rs.)</div>
                                            <div className="w-20 text-center py-2 flex items-center justify-center leading-tight">Option<br/>No</div>
                                        </div>`
);

// Replace Chunk 3: Left Table Row (inside the map)
code = code.replace(
/<div key={key} className="p-4 bg-white hover:bg-blue-50\/50 transition-colors border-l-4 border-transparent hover:border-blue-400">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
`<div key={key} className="flex border-b border-[#E0E0E0] hover:bg-[#F0FFFF] transition-colors items-stretch">
                                                            <div className="w-12 text-center py-2 border-r border-[#E0E0E0] text-[12px] text-black flex items-center justify-center">{i + 1}</div>
                                                            <div className="flex-1 px-4 py-2 border-r border-[#E0E0E0] text-[12px] text-black leading-snug">
                                                                <span className="font-bold">{row.college.college_id} - {row.college.name}</span><br/>
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
                                                        </div>`
);

// Replace Chunk 4: Left Footer Action
code = code.replace(
/<div className="p-6 bg-white border-t border-gray-200 text-center space-y-4">\s*<button\s*onClick={handleFinalSubmit}\s*disabled={isSubmitting}\s*className="bg-\[#4FC3F7\] hover:bg-\[#29B6F6\] text-white px-12 py-2\.5 rounded font-bold text-sm shadow-md transition-all active:scale-\[0\.98\] disabled:opacity-50 flex items-center gap-3 mx-auto"\s*>\s*{isSubmitting \? 'Verifying Choices\.\.\.' : 'Save & Submit'}\s*<\/button>\s*<div className="space-y-1">\s*<p className="text-\[10px\] text-rose-500 font-bold">Please click on the Save and Submit button every 2 minutes to save your options<\/p>\s*<p className="text-\[9px\] text-\[#A52A2A\] font-bold">NOTE: N\/A-Fees shall be updated shortly<\/p>\s*<\/div>\s*<\/div>/,
`<div className="p-4 bg-white border-t border-[#b0b0b0] text-center flex flex-col items-center gap-1">
                                            <button 
                                                onClick={handleFinalSubmit}
                                                disabled={isSubmitting}
                                                className="bg-[#0099FF] hover:bg-[#007acc] text-white px-4 py-1.5 font-bold text-[13px] rounded-sm transition-all"
                                            >
                                                {isSubmitting ? 'Verifying...' : 'Save & Submit'}
                                            </button>
                                            <p className="text-[11px] text-[#8B0000] font-bold mt-1">Please click on the Save and Submit button every 2 minutes to save your options</p>
                                            <p className="text-[11px] text-[#8B0000] font-bold">NOTE: N/A Fees shall be updated shortly.</p>
                                        </div>`
);

// Replace Chunk 5: Right Side Header and Table Header
code = code.replace(
/{\/\* --- RIGHT SIDE: SELECTED OPTIONS \(30%\) --- \*\/}\s*<div className={cn\("border border-gray-200 shadow-sm flex flex-col bg-white transition-all", globalConfig\.currentRound === 1 \? "w-\[30%\]" : "w-\[40%\]"\)}>\s*<div className="bg-\[#1B703F\] text-white px-4 py-2 text-xs font-bold shadow-sm">\s*Selected Options\s*<\/div>\s*<div className="flex-1 p-4 overflow-y-auto bg-gray-50\/30">\s*{selectedOptions\.length === 0 \? \([\s\S]*?<\/div>\s*\) : \(\s*<div className="space-y-2">\s*<div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">\s*<span className="text-\[10px\] font-black text-gray-500 uppercase">Selected Options<\/span>\s*<span className="bg-\[#1B703F\] text-white text-\[9px\] font-black px-1\.5 py-0\.5 rounded">{selectedOptions\.length}<\/span>\s*<\/div>/,
`{/* --- RIGHT SIDE: SELECTED OPTIONS (50%) --- */}
                                 <div className={cn("border border-[#b0b0b0] flex flex-col bg-white transition-all", globalConfig.currentRound === 1 ? "w-1/2" : "w-[40%]")}>
                                        <div className="bg-[#006400] text-white px-3 py-1.5 text-[13px] font-bold border-b border-[#b0b0b0]">
                                            Modify Selected Options
                                        </div>
                                        
                                        {/* Table Header */}
                                        <div className="bg-[#E8F5E9] border-b border-[#b0b0b0] flex text-[11px] font-bold text-black items-stretch">
                                            <div className="w-14 text-center py-1 border-r border-[#b0b0b0] leading-tight flex items-center justify-center">College<br/>Course</div>
                                            <div className="w-12 text-center py-1 border-r border-[#b0b0b0] leading-tight flex items-center justify-center">Option<br/>No</div>
                                            <div className="flex-1 text-center py-1 border-r border-[#b0b0b0] flex items-center justify-center">College Name</div>
                                            <div className="w-32 text-center py-1 border-r border-[#b0b0b0] flex items-center justify-center">Course Name</div>
                                            <div className="w-16 text-center py-1 flex items-center justify-center">Fees</div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto bg-white">
                                            {selectedOptions.length === 0 ? (
                                                <div className="p-8 text-center text-[12px] text-gray-500 italic">No options selected yet.</div>
                                            ) : (
                                                <div className="space-y-0">`
);

// Replace Chunk 6: Right Side Row Item
code = code.replace(
/<Reorder\.Item\s*key={itemKey}\s*value={itemKey}\s*className="bg-white border border-gray-200 rounded p-2 shadow-sm flex gap-3 items-center hover:border-emerald-200 transition-colors cursor-grab active:cursor-grabbing"[\s\S]*?<\/Reorder\.Item>/,
`<Reorder.Item 
                                                                    key={itemKey} 
                                                                    value={itemKey}
                                                                    className="flex items-stretch text-[11px] text-black bg-white hover:bg-gray-50 cursor-grab active:cursor-grabbing border-b border-[#E0E0E0] group relative"
                                                                >
                                                                    <div className="w-14 text-center py-2 border-r border-[#E0E0E0] bg-[#E8F5E9] flex flex-col items-center justify-center font-bold text-[10px]">
                                                                        {opt.collegeId}<br/>{opt.branchId}
                                                                    </div>
                                                                    <div className="w-12 text-center py-2 border-r border-[#E0E0E0] bg-[#E8F5E9] flex flex-col items-center justify-center">
                                                                        <input 
                                                                            type="text" 
                                                                            value={opt.priority}
                                                                            readOnly
                                                                            className="w-7 h-5 border border-gray-400 text-center text-[11px] font-bold bg-white shadow-inner"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 px-2 py-2 border-r border-[#E0E0E0] flex items-center">
                                                                        {opt.collegeName}
                                                                    </div>
                                                                    <div className="w-32 px-2 py-2 border-r border-[#E0E0E0] flex items-center">
                                                                        {opt.branchName}
                                                                    </div>
                                                                    <div className="w-16 text-center py-2 flex items-center justify-center">
                                                                        0
                                                                    </div>
                                                                    <button 
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteOption(opt.collegeId, opt.branchId);
                                                                        }}
                                                                        className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 bg-white rounded p-1"
                                                                        title="Delete Option"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                                                    </button>
                                                                </Reorder.Item>`
);

// Final cleanup: change <Reorder.Group className="space-y-2"> to className="divide-y divide-[#b0b0b0]"
code = code.replace(
/className="space-y-2"\s*>\s*{\s*selectedOptions\.map/,
`className="divide-y divide-[#E0E0E0]"
                                                    >
                                                        {selectedOptions.map`
);

fs.writeFileSync('src/app/[[...slug]]/ClientPage.tsx', code);
console.log('Replacements completed successfully.');

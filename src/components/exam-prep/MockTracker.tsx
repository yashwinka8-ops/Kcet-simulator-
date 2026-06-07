'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Target, Plus, Trash2, TrendingUp, Calendar, Book } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function MockTracker() {
  const { user, profile, updateProfile } = useAuth();
  const [tests, setTests] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('Full Length');
  const [examType, setExamType] = useState('KCET');
  const [score, setScore] = useState('');
  const [total, setTotal] = useState('180');
  const [totalGuesses, setTotalGuesses] = useState('0');
  const [correctGuesses, setCorrectGuesses] = useState('0');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (profile?.mockTests) {
      setTests(profile.mockTests);
    }
  }, [profile]);

  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to save your mock tests.");
      return;
    }

    const newTest = {
      id: uuidv4(),
      date,
      subject,
      examType,
      score: Number(score),
      total: Number(total),
      totalGuesses: Number(totalGuesses),
      correctGuesses: Number(correctGuesses),
      notes
    };

    const newTests = [newTest, ...tests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setTests(newTests);
    await updateProfile({ mockTests: newTests });
    
    setIsAdding(false);
    setScore('');
    setNotes('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this test record?")) return;
    
    const newTests = tests.filter(t => t.id !== id);
    setTests(newTests);
    await updateProfile({ mockTests: newTests });
  };

  const averageScore = tests.length > 0 
    ? Math.round(tests.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0) / tests.length) 
    : 0;

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/20 rounded-xl">
            <Target className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Mock Test Tracker</h2>
            <p className="text-sm text-muted-foreground">Log scores and track improvement</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-white/90 transition-colors"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Test</>}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-white mb-1">{tests.length}</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tests Taken</span>
        </div>
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-emerald-400 mb-1">{averageScore}%</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Average Score</span>
        </div>
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <TrendingUp className="w-8 h-8 text-blue-400 mb-2" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Keep pushing!</span>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleAddTest} className="bg-black/40 border border-white/10 rounded-xl p-5 mb-8 space-y-4">
          <h3 className="font-bold text-white mb-4">Log New Mock Test</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase">Date</label>
              <input 
                type="date" 
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase">Subject/Type</label>
              <div className="flex gap-2">
                <select 
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-1/3 bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                >
                  <option value="KCET">KCET</option>
                  <option value="COMEDK">COMEDK</option>
                  <option value="JEE">JEE Main</option>
                </select>
                <select 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-2/3 bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                >
                  <option value="Full Length">Full Length</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                  <option value="Part Test">Part Test</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase">Score obtained</label>
              <input 
                type="number" 
                required
                placeholder="e.g. 145"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase">Total Marks</label>
              <input 
                type="number" 
                required
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase">Total Guesses</label>
              <input 
                type="number"
                min="0"
                value={totalGuesses}
                onChange={(e) => setTotalGuesses(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase">Correct Guesses</label>
              <input 
                type="number"
                min="0"
                value={correctGuesses}
                onChange={(e) => setCorrectGuesses(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase">Analysis / Notes (Optional)</label>
            <textarea 
              rows={2}
              placeholder="What went wrong? Which topics need revision?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary resize-none"
            />
          </div>
          
          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="bg-primary hover:bg-primary/90 text-black px-6 py-2 rounded-full text-sm font-bold transition-colors"
            >
              Save Test Record
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        <h3 className="font-bold text-white mb-4">Past Tests</h3>
        
        {tests.length === 0 ? (
          <div className="text-center py-10 border border-white/5 border-dashed rounded-xl">
            <p className="text-muted-foreground text-sm">No mock tests logged yet.</p>
          </div>
        ) : (
          tests.map((test) => {
            const percentage = Math.round((test.score / test.total) * 100);
            let scoreColor = 'text-rose-400';
            if (percentage >= 80) scoreColor = 'text-emerald-400';
            else if (percentage >= 60) scoreColor = 'text-yellow-400';
            else if (percentage >= 40) scoreColor = 'text-orange-400';

            return (
              <div key={test.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl hover:bg-white/5 transition-colors gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <span className={`font-black ${scoreColor}`}>{percentage}%</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-widest">
                        {test.examType || 'KCET'}
                      </span>
                      <span className="font-bold text-white">{test.subject}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">{test.date}</span>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-3">
                      <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" /> Score: {test.score}/{test.total}</span>
                      {(test.totalGuesses > 0) && (
                        <span className="flex items-center gap-1">
                          • Guess Accuracy: {Math.round((test.correctGuesses / test.totalGuesses) * 100)}%
                        </span>
                      )}
                    </div>
                    {test.notes && (
                      <p className="text-xs text-white/50 mt-2 bg-black/30 p-2 rounded border border-white/5">
                        {test.notes}
                      </p>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDelete(test.id)}
                  className="sm:opacity-0 group-hover:opacity-100 p-2 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-all"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

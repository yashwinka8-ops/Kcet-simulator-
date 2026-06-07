'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardList, RotateCcw, Play, CheckCircle2 } from 'lucide-react';

export function OMRSimulator() {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute drill
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  const totalQuestions = 60; // Standard KCET subject has 60 questions

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      alert(`Time's up! You bubbled ${Object.keys(answers).length} out of 60 questions in 1 minute.`);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, answers]);

  const toggleOption = (q: number, option: string) => {
    if (!isActive) return;
    setAnswers(prev => ({
      ...prev,
      [q]: prev[q] === option ? '' : option // Toggle off if clicked again
    }));
  };

  const startDrill = () => {
    setAnswers({});
    setTimeLeft(60);
    setIsActive(true);
  };

  const resetDrill = () => {
    setAnswers({});
    setTimeLeft(60);
    setIsActive(false);
  };

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500/20 rounded-xl">
            <ClipboardList className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">OMR Speed Drill</h2>
            <p className="text-sm text-muted-foreground">Practice bubbling speed (60 Qs under 1 min)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl border border-white/10 font-bold text-lg tabular-nums ${timeLeft <= 10 ? 'text-red-500 bg-red-500/10' : 'text-white bg-black/40'}`}>
            00:{timeLeft.toString().padStart(2, '0')}
          </div>
          
          {!isActive ? (
            <button 
              onClick={startDrill}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors"
            >
              <Play className="w-4 h-4" /> Start Drill
            </button>
          ) : (
            <button 
              onClick={resetDrill}
              className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/20 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          )}
        </div>
      </div>

      {Object.keys(answers).length > 0 && !isActive && timeLeft === 0 && (
        <div className="mb-8 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <p className="text-sm font-medium">
            <strong>Drill Complete!</strong> You bubbled {Object.keys(answers).length} questions. In the real exam, budgeting 5-7 minutes solely for bubbling is recommended.
          </p>
        </div>
      )}

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4 transition-opacity ${!isActive && timeLeft === 60 ? 'opacity-50 pointer-events-none' : ''}`}>
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const qNum = idx + 1;
          const selected = answers[qNum];
          return (
            <div key={qNum} className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-sm font-medium text-muted-foreground w-6">{qNum}.</span>
              <div className="flex gap-2">
                {['A', 'B', 'C', 'D'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => toggleOption(qNum, opt)}
                    disabled={!isActive}
                    className={`w-8 h-8 rounded-full border-2 text-xs font-bold transition-all flex items-center justify-center ${
                      selected === opt 
                        ? 'bg-orange-500 border-orange-500 text-white' 
                        : 'border-white/20 text-white hover:border-orange-500/50 hover:bg-orange-500/10'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

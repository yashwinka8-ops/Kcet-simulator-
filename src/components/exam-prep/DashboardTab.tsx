'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Trophy, CalendarDays, Flame, BrainCircuit, Target, CheckCircle2, Printer, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// Set KCET Date (e.g., April 18, 2027)
const KCET_DATE = new Date('2027-04-18T00:00:00').getTime();

export function DashboardTab() {
  const { profile } = useAuth();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = KCET_DATE - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const totalStudyHours = profile?.studyHours ? Math.floor(profile.studyHours / 60) : 0;
  const mockTestsCount = profile?.mockTests?.length || 0;
  const totalSyllabusCompleted = Object.values(profile?.syllabusProgress || {}).flat().length;

  const mockData = profile?.mockTests?.map(test => ({
    name: test.date.split('-').slice(1).join('/'),
    score: Math.round((test.score / test.total) * 100)
  })).reverse() || [];

// Advanced Logic
  const errorLogs = profile?.errorLog || [];
  const subjectErrors: Record<string, number> = {};
  errorLogs.forEach((log: any) => {
    if (!log.isResolved) {
      subjectErrors[log.subject] = (subjectErrors[log.subject] || 0) + 1;
    }
  });
  
  const weakestSubject = Object.keys(subjectErrors).length > 0 
    ? Object.keys(subjectErrors).reduce((a, b) => subjectErrors[a] > subjectErrors[b] ? a : b)
    : null;

  const isBurnoutRisk = totalStudyHours > 40; // If they have > 40 hours logged, simulate a warning.

  const handleExportData = () => {
    if (!profile) return;
    const dataStr = JSON.stringify(profile, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kcet_god_mode_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0 print:bg-white print:text-black">
      <div className="flex justify-end items-center gap-2 print:hidden">
        <button 
          onClick={handleExportData}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors"
          title="Export Data as JSON"
        >
          <Download className="w-4 h-4" /> Export Data
        </button>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors"
        >
          <Printer className="w-4 h-4" /> Print Report
        </button>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Countdown */}
        <div className="bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/30 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/20 blur-2xl rounded-full" />
          <div className="flex items-center gap-2 text-rose-400 mb-2">
            <CalendarDays className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">Exam Countdown</span>
          </div>
          <div className="flex items-end gap-2 text-white">
            <span className="text-4xl font-black">{timeLeft.days}</span>
            <span className="text-sm text-rose-200 mb-1 font-medium">days to go</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Flame className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">Deep Work</span>
          </div>
          <div className="flex items-end gap-2 text-white">
            <span className="text-4xl font-black">{totalStudyHours}</span>
            <span className="text-sm text-purple-200 mb-1 font-medium">hours focused</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">Syllabus</span>
          </div>
          <div className="flex items-end gap-2 text-white">
            <span className="text-4xl font-black">{totalSyllabusCompleted}</span>
            <span className="text-sm text-emerald-200 mb-1 font-medium">chapters done</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Target className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-wider">Mock Tests</span>
          </div>
          <div className="flex items-end gap-2 text-white">
            <span className="text-4xl font-black">{mockTestsCount}</span>
            <span className="text-sm text-blue-200 mb-1 font-medium">tests attempted</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-zinc-900 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Trophy className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Performance Trajectory</h2>
              <p className="text-xs text-muted-foreground">Your mock test scores over time (%)</p>
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            {mockData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#34d399', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#34d399" strokeWidth={3} dot={{ fill: '#18181b', stroke: '#34d399', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center border border-white/5 border-dashed rounded-xl">
                <Target className="w-8 h-8 text-white/20 mb-2" />
                <p className="text-sm text-white/40">Log your first mock test to see your trajectory.</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full" />
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Smart Insights</h2>
          </div>
          
          <div className="space-y-4 relative z-10">
            {mockTestsCount === 0 && !weakestSubject && !isBurnoutRisk ? (
              <p className="text-sm text-indigo-200">Start logging your mock tests, errors, and study hours to unlock personalized AI insights and rank predictions.</p>
            ) : (
              <>
                {mockTestsCount > 0 && (
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                    <p className="text-sm text-white">You've attempted <strong className="text-indigo-400">{mockTestsCount} mocks</strong>. Keep up the momentum to stabilize your scores.</p>
                  </div>
                )}
                
                {weakestSubject ? (
                  <div className="bg-black/40 p-4 rounded-xl border border-red-500/20">
                    <p className="text-sm text-white">
                      <strong>Weakest Link Alert:</strong> You have {subjectErrors[weakestSubject]} unresolved errors in <strong className="text-red-400">{weakestSubject}</strong>. Target this subject heavily this week.
                    </p>
                  </div>
                ) : (
                  <div className="bg-black/40 p-4 rounded-xl border border-emerald-500/20">
                    <p className="text-sm text-emerald-200">Your error log is clear! Great accuracy.</p>
                  </div>
                )}
                
                {isBurnoutRisk ? (
                  <div className="bg-black/40 p-4 rounded-xl border border-orange-500/20">
                    <p className="text-sm text-orange-200">
                      <strong>Burnout Warning:</strong> With {totalStudyHours} hours logged, you are pushing hard. Ensure you are taking adequate 5-minute breaks!
                    </p>
                  </div>
                ) : (
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                    <p className="text-sm text-white">Your consistency is great. Try a 25-minute Pomodoro session now to review your last mistake log.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PieChart, Pie } from 'recharts';
import { Layers } from 'lucide-react';

const WEIGHTAGE_DATA = {
  physics: [
    { topic: "Current Electricity", weight: 8 },
    { topic: "Oscillations & Waves", weight: 7 },
    { topic: "Electrostatics", weight: 6 },
    { topic: "Optics", weight: 6 },
    { topic: "Thermodynamics", weight: 5 },
    { topic: "Magnetic Effects", weight: 5 },
    { topic: "Dual Nature", weight: 4 },
    { topic: "Kinematics", weight: 4 },
  ],
  chemistry: [
    { topic: "Coordination Compounds", weight: 7 },
    { topic: "p-Block Elements", weight: 6 },
    { topic: "Thermodynamics", weight: 6 },
    { topic: "Chemical Kinetics", weight: 5 },
    { topic: "Equilibrium", weight: 5 },
    { topic: "Solutions", weight: 5 },
    { topic: "Electrochemistry", weight: 4 },
    { topic: "Aldehydes & Ketones", weight: 4 },
  ],
  maths: [
    { topic: "Calculus (Integrals & Derivatives)", weight: 15 },
    { topic: "Vectors & 3D Geometry", weight: 10 },
    { topic: "Probability", weight: 6 },
    { topic: "Matrices & Determinants", weight: 5 },
    { topic: "Trigonometric Functions", weight: 5 },
    { topic: "Straight Lines & Conics", weight: 4 },
    { topic: "Sequence & Series", weight: 3 },
  ]
};

export function WeightageViewer() {
  const [subject, setSubject] = useState<'physics' | 'chemistry' | 'maths'>('physics');

  const data = WEIGHTAGE_DATA[subject];
  
  const colors = {
    physics: '#3b82f6', // blue-500
    chemistry: '#10b981', // emerald-500
    maths: '#6366f1' // indigo-500
  };

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/20 rounded-xl">
            <Layers className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Chapter Weightage</h2>
            <p className="text-sm text-muted-foreground">Historical analysis of KCET question distribution</p>
          </div>
        </div>
        
        <div className="flex gap-2 bg-black/40 p-1 rounded-full border border-white/5">
          {(['physics', 'chemistry', 'maths'] as const).map(sub => (
            <button
              key={sub}
              onClick={() => setSubject(sub)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                subject === sub 
                  ? sub === 'physics' ? 'bg-blue-500 text-white' : sub === 'chemistry' ? 'bg-emerald-500 text-white' : 'bg-indigo-500 text-white'
                  : 'text-muted-foreground hover:text-white hover:bg-white/5'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis 
              dataKey="topic" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a1a1aa', fontSize: 12 }} 
              width={180}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              formatter={(value: any) => [`${value} Questions`, 'Expected Weight']}
            />
            <Bar dataKey="weight" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[subject]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
        <p className="text-sm text-indigo-200">
          <strong>Pro Tip:</strong> Focus heavily on the top 3 chapters of each subject. Historically, mastering just the top 30% of the syllabus covers over 50% of the exam's total marks.
        </p>
      </div>
    </div>
  );
}

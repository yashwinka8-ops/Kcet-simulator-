'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Check, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';

const SYLLABUS = {
  physics: [
    "Physical World and Measurement",
    "Kinematics",
    "Laws of Motion",
    "Work, Energy and Power",
    "Motion of System of Particles and Rigid Body",
    "Gravitation",
    "Properties of Bulk Matter",
    "Thermodynamics",
    "Behavior of Perfect Gases and Kinetic Theory of Gases",
    "Oscillations and Waves",
    "Electrostatics",
    "Current Electricity",
    "Magnetic Effects of Current and Magnetism",
    "Electromagnetic Induction and Alternating Currents",
    "Electromagnetic Waves",
    "Optics",
    "Dual Nature of Radiation and Matter",
    "Atoms and Nuclei",
    "Electronic Devices",
    "Communication Systems"
  ],
  chemistry: [
    "Some Basic Concepts of Chemistry",
    "Structure of Atom",
    "Classification of Elements and Periodicity in Properties",
    "Chemical Bonding and Molecular Structure",
    "States of Matter: Gases and Liquids",
    "Thermodynamics",
    "Equilibrium",
    "Redox Reactions",
    "Hydrogen",
    "s-Block Elements (Alkali and Alkaline earth metals)",
    "Some p-Block Elements",
    "Organic Chemistry - Some Basic Principles and Techniques",
    "Hydrocarbons",
    "Environmental Chemistry",
    "Solid State",
    "Solutions",
    "Electrochemistry",
    "Chemical Kinetics",
    "Surface Chemistry",
    "General Principles and Processes of Isolation of Elements",
    "p-Block Elements",
    "d and f Block Elements",
    "Coordination Compounds",
    "Haloalkanes and Haloarenes",
    "Alcohols, Phenols and Ethers",
    "Aldehydes, Ketones and Carboxylic Acids",
    "Organic Compounds Containing Nitrogen",
    "Biomolecules",
    "Polymers",
    "Chemistry in Everyday Life"
  ],
  maths: [
    "Sets, Relations and Functions",
    "Trigonometric Functions",
    "Principle of Mathematical Induction",
    "Complex Numbers and Quadratic Equations",
    "Linear Inequalities",
    "Permutations and Combinations",
    "Binomial Theorem",
    "Sequence and Series",
    "Straight Lines",
    "Conic Sections",
    "Introduction to Three-dimensional Geometry",
    "Limits and Derivatives",
    "Mathematical Reasoning",
    "Statistics",
    "Probability",
    "Relations and Functions",
    "Inverse Trigonometric Functions",
    "Matrices",
    "Determinants",
    "Continuity and Differentiability",
    "Applications of Derivatives",
    "Integrals",
    "Applications of the Integrals",
    "Differential Equations",
    "Vectors",
    "Three-dimensional Geometry",
    "Linear Programming"
  ],
  biology: [
    "Diversity in Living World",
    "Structural Organisation in Animals and Plants",
    "Cell Structure and Function",
    "Plant Physiology",
    "Human physiology",
    "Reproduction",
    "Genetics and Evolution",
    "Biology and Human Welfare",
    "Biotechnology and Its Applications",
    "Ecology and environment"
  ]
};

type Subject = keyof typeof SYLLABUS;

export function SyllabusTracker() {
  const { user, profile, updateProfile } = useAuth();
  const [expandedSubject, setExpandedSubject] = useState<Subject | null>('physics');
  const [progress, setProgress] = useState<Record<Subject, string[]>>({
    physics: [],
    chemistry: [],
    maths: [],
    biology: []
  });

  useEffect(() => {
    if (profile?.syllabusProgress) {
      setProgress({
        physics: profile.syllabusProgress.physics || [],
        chemistry: profile.syllabusProgress.chemistry || [],
        maths: profile.syllabusProgress.maths || [],
        biology: profile.syllabusProgress.biology || []
      });
    }
  }, [profile]);

  const toggleTopic = async (subject: Subject, topic: string) => {
    if (!user) {
      alert("Please login to save your progress.");
      return;
    }

    const currentSubjectProgress = progress[subject] || [];
    const newSubjectProgress = currentSubjectProgress.includes(topic)
      ? currentSubjectProgress.filter(t => t !== topic)
      : [...currentSubjectProgress, topic];

    const newProgress = {
      ...progress,
      [subject]: newSubjectProgress
    };

    setProgress(newProgress);
    await updateProfile({ syllabusProgress: newProgress });

    // Confetti Check
    const isNowChecked = !currentSubjectProgress.includes(topic);
    if (isNowChecked) {
      const subjectTopics = SYLLABUS[subject];
      if (newSubjectProgress.length === subjectTopics.length) {
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899']
          });
        });
      }
    }
  };

  const getSubjectProgress = (subject: Subject) => {
    const total = SYLLABUS[subject].length;
    const completed = progress[subject]?.length || 0;
    return { completed, total, percentage: total === 0 ? 0 : Math.round((completed / total) * 100) };
  };

  const subjects: { id: Subject; label: string; color: string }[] = [
    { id: 'physics', label: 'Physics', color: 'bg-blue-500' },
    { id: 'chemistry', label: 'Chemistry', color: 'bg-emerald-500' },
    { id: 'maths', label: 'Mathematics', color: 'bg-indigo-500' },
    { id: 'biology', label: 'Biology', color: 'bg-rose-500' },
  ];

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/20 rounded-xl">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Syllabus Tracker</h2>
          <p className="text-sm text-muted-foreground">Track your chapter-wise preparation</p>
        </div>
      </div>

      <div className="space-y-4">
        {subjects.map(({ id, label, color }) => {
          const stats = getSubjectProgress(id);
          const isExpanded = expandedSubject === id;

          return (
            <div key={id} className="border border-white/5 rounded-xl overflow-hidden bg-black/20">
              <button 
                onClick={() => setExpandedSubject(isExpanded ? null : id)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className="font-bold text-white min-w-[100px] text-left">{label}</span>
                  
                  <div className="flex-1 max-w-md hidden sm:flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${color} transition-all duration-500`}
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground min-w-[40px]">
                      {stats.percentage}%
                    </span>
                  </div>
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {stats.completed}/{stats.total}
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 border-t border-white/5 bg-black/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SYLLABUS[id].map((topic) => {
                      const isCompleted = progress[id]?.includes(topic);
                      return (
                        <button
                          key={topic}
                          onClick={() => toggleTopic(id, topic)}
                          className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                            isCompleted 
                              ? 'bg-primary/10 border-primary/30 text-primary' 
                              : 'bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/20'
                          }`}
                        >
                          <div className={`mt-0.5 shrink-0 w-5 h-5 rounded flex items-center justify-center border ${
                            isCompleted 
                              ? 'bg-primary border-primary text-black' 
                              : 'border-white/20 bg-black/50'
                          }`}>
                            {isCompleted && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span className="text-sm font-medium">{topic}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

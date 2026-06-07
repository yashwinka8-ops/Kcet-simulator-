'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { BrainCircuit, ChevronLeft, ChevronRight, RotateCcw, Filter } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

import FLASHCARDS_DATA from '@/data/flashcards.json';

export function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedChapter, setSelectedChapter] = useState('All');

  const subjects = useMemo(() => ['All', ...Array.from(new Set(FLASHCARDS_DATA.map(c => c.subject)))], []);
  
  const chapters = useMemo(() => {
    const filteredBySubject = selectedSubject === 'All' 
      ? FLASHCARDS_DATA 
      : FLASHCARDS_DATA.filter(c => c.subject === selectedSubject);
    return ['All', ...Array.from(new Set(filteredBySubject.map(c => c.chapter)))];
  }, [selectedSubject]);

  const filteredCards = useMemo(() => {
    return FLASHCARDS_DATA.filter(c => {
      const matchSubject = selectedSubject === 'All' || c.subject === selectedSubject;
      const matchChapter = selectedChapter === 'All' || c.chapter === selectedChapter;
      return matchSubject && matchChapter;
    });
  }, [selectedSubject, selectedChapter]);

  // Reset index when filters change
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedSubject, selectedChapter]);

  const nextCard = () => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }, 150);
  };

  const prevCard = () => {
    if (filteredCards.length === 0) return;
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }, 150);
  };

  const currentCard = filteredCards[currentIndex];

  const getSubjectColor = (subject: string) => {
    if (subject === 'Physics') return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    if (subject === 'Chemistry') return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
    if (subject === 'Mathematics') return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
    return 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30';
  };

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 md:p-10 max-w-4xl mx-auto flex flex-col h-[700px]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-pink-500/20 rounded-xl">
            <BrainCircuit className="w-6 h-6 text-pink-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Active Recall</h2>
            <p className="text-sm text-muted-foreground">Swipe and flip to memorize key formulas</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/10">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select 
              value={selectedSubject} 
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedChapter('All'); // Reset chapter on subject change
              }}
              className="bg-transparent text-sm text-white outline-none border-none cursor-pointer"
            >
              {subjects.map(s => <option key={s} value={s} className="bg-zinc-900">{s}</option>)}
            </select>
          </div>
          
          <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-white/10">
            <select 
              value={selectedChapter} 
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="bg-transparent text-sm text-white outline-none border-none cursor-pointer max-w-[120px] truncate"
            >
              {chapters.map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
            </select>
          </div>

          <div className="bg-black/40 px-4 py-2 rounded-xl border border-white/10">
            <span className="text-sm font-bold text-white">
              {filteredCards.length > 0 ? currentIndex + 1 : 0} / {filteredCards.length}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative perspective-1000">
        
        {filteredCards.length > 0 ? (
          <>
            {/* Flashcard Container */}
            <div 
              onClick={() => setIsFlipped(!isFlipped)}
              className={`relative w-full max-w-2xl h-[400px] cursor-pointer transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
            >
              {/* Front */}
              <div className="absolute inset-0 backface-hidden bg-black border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl shadow-pink-500/5 group hover:border-pink-500/30 transition-colors overflow-y-auto no-scrollbar">
                <div className="absolute top-6 left-6 flex flex-col gap-2 items-start">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${getSubjectColor(currentCard.subject)}`}>
                    {currentCard.subject}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1 rounded bg-white/5 border border-white/10">
                    {currentCard.chapter}
                  </span>
                </div>
                
                <span className="absolute top-6 right-6 text-xs text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1">
                  <RotateCcw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" /> Tap to flip
                </span>
                <div className="text-2xl md:text-3xl font-bold text-white mt-8 w-full">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {currentCard.front}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl shadow-pink-500/20 overflow-y-auto no-scrollbar">
                <span className="absolute top-6 right-6 text-xs text-pink-300 uppercase tracking-widest font-bold flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Tap to flip
                </span>
                <p className="text-sm text-pink-300 uppercase tracking-widest font-bold mb-4 shrink-0">Answer</p>
                <div className="text-2xl md:text-4xl font-black text-white w-full prose prose-invert prose-p:leading-relaxed prose-p:my-2">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {currentCard.back}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 mt-10">
              <button 
                onClick={prevCard}
                className="w-14 h-14 rounded-full bg-black border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-105 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button 
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-8 py-3 rounded-full bg-pink-500 text-white font-bold text-sm hover:bg-pink-600 hover:scale-105 transition-all shadow-lg shadow-pink-500/20"
              >
                {isFlipped ? "Show Question" : "Reveal Answer"}
              </button>

              <button 
                onClick={nextCard}
                className="w-14 h-14 rounded-full bg-black border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-105 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 bg-black/40 rounded-3xl border border-white/10 w-full max-w-2xl h-[400px]">
            <BrainCircuit className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">No Flashcards Found</h3>
            <p className="text-muted-foreground">Try changing your subject or chapter filters.</p>
            <button 
              onClick={() => { setSelectedSubject('All'); setSelectedChapter('All'); }}
              className="mt-6 px-6 py-2 rounded-full bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

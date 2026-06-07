'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPinOff, ArrowRight, Home, Zap, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname();

  // Try to intelligently guess what they were looking for
  const isLookingForRankPredictor = pathname.toLowerCase().includes('rank') || pathname.toLowerCase().includes('predictor');

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 selection:bg-primary/30 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center space-y-8"
      >
        <div className="flex justify-center mb-4">
          <motion.div 
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-xl"
          >
            <MapPinOff className="w-10 h-10 text-muted-foreground/50" />
          </motion.div>
        </div>

        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter drop-shadow-lg">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white/90">
            Lost in the Counseling Matrix?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto font-medium">
            We couldn't find the page <span className="text-white/70 font-mono bg-white/5 px-2 py-0.5 rounded-md">{pathname}</span>. 
            It might have been moved, or there's a typo in the URL.
          </p>
        </div>

        <div className="pt-8">
          {isLookingForRankPredictor && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-8 inline-block shadow-lg shadow-primary/5"
            >
              <p className="text-xs text-primary font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                <Search className="w-3.5 h-3.5" /> Did you mean to go here?
              </p>
              <Link href="/rank-predictor">
                <button className="bg-primary text-white px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all">
                  <Zap className="w-4 h-4 fill-current" />
                  Go To Rank Predictor
                </button>
              </Link>
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95">
                <Home className="w-4 h-4" />
                Return to Home
              </button>
            </Link>
            <Link href="/predictor" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-transparent hover:bg-white/5 text-white/70 hover:text-white px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                College Predictor <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

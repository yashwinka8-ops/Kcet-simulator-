'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, Heart, LogOut, User as UserIcon, Menu, X, ChevronDown, MapPin, Sparkles, Building } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [guideHovered, setGuideHovered] = useState(false);
  const pathname = usePathname();

  const closeMenu = () => setMobileMenuOpen(false);

  if (pathname === '/simulator') return null;

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-[100] px-3 md:px-6 py-4 flex justify-center pointer-events-none">
        <div className="bg-black/40 backdrop-blur-xl px-4 md:px-5 py-3 rounded-full flex items-center gap-3 border border-white/10 max-w-[1500px] w-full justify-between pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 -ml-2 text-white/70 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <Link href="/" className="flex items-center gap-2 shrink-0" onClick={closeMenu}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold tracking-tight text-lg hidden sm:block">KCET Predictor</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4 xl:gap-5 text-[13px] font-bold text-muted-foreground">
            <Link href="/rank-predictor" className="text-primary hover:text-primary/80 flex items-center gap-1.5 transition-colors">
              Rank Predictor
              <div className="bg-primary/20 text-[7px] px-1.5 py-0.5 rounded-md border border-primary/30">PRO</div>
            </Link>
            <Link href="/predictor" className="hover:text-white transition-colors">Predictor</Link>
            <Link href="/cutoffs" className="hover:text-white transition-colors">Cutoffs</Link>
            <Link href="/compare" className="hover:text-white transition-colors">Compare</Link>
            <Link href="/trends" className="hover:text-white transition-colors">Trends</Link>
            {/* Community & Map */}
            <Link href="/community" className="text-primary hover:text-white transition-colors flex items-center gap-1">
              Community
              <div className="bg-primary/20 text-[7px] px-1.5 py-0.5 rounded-md border border-primary/30 animate-pulse">NEW</div>
            </Link>
            <Link href="/commute" className="hover:text-white transition-colors flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Map
            </Link>


            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setGuideHovered(true)}
              onMouseLeave={() => setGuideHovered(false)}
            >
              <div className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer py-2">
                Resources
                <motion.div
                  animate={{ rotate: guideHovered ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </motion.div>
              </div>
              <AnimatePresence>
                {guideHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 pt-2 w-56 pointer-events-auto"
                  >
                    <div className="bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl overflow-hidden">
                      <Link href="/hostels" className="flex flex-col p-3 rounded-xl hover:bg-white/5 transition-colors group">
                        <span className="text-emerald-400 text-[11px] font-bold">Budget Hostels</span>
                        <span className="text-[8px] text-muted-foreground group-hover:text-emerald-300 transition-colors uppercase font-black tracking-widest">Stay & PG Search</span>
                      </Link>
                      <Link href="/commute-cost" className="flex flex-col p-3 rounded-xl hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400 text-[11px] font-bold">Commute Cost</span>
                          <span className="bg-yellow-500/20 text-[6px] px-1.5 py-0.5 rounded border border-yellow-500/30">NEW</span>
                        </div>
                        <span className="text-[8px] text-muted-foreground group-hover:text-yellow-300 transition-colors uppercase font-black tracking-widest">Bus Pass Estimator</span>
                      </Link>
                      <Link href="/tracker" className="flex flex-col p-3 rounded-xl hover:bg-white/5 transition-colors group">
                        <div className="flex items-center gap-2">
                          <span className="text-rose-400 text-[11px] font-bold">Live Tracker</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        </div>
                        <span className="text-[8px] text-muted-foreground group-hover:text-rose-300 transition-colors uppercase font-black tracking-widest">KEA Live Updates</span>
                      </Link>
                      <Link href="/instructions" className="flex flex-col p-3 rounded-xl hover:bg-white/5 transition-colors group">
                        <span className="text-white text-[11px] font-bold">How it Works</span>
                        <span className="text-[8px] text-muted-foreground group-hover:text-primary transition-colors uppercase font-black tracking-widest">Instructions</span>
                      </Link>
                      <Link href="/guide" className="flex flex-col p-3 rounded-xl hover:bg-white/5 transition-colors group border-t border-white/5">
                        <span className="text-white text-[11px] font-bold">Counselling Roadmap</span>
                        <span className="text-[8px] text-muted-foreground group-hover:text-primary/70 transition-colors uppercase font-black tracking-widest">Strategy</span>
                      </Link>
                      <Link href="/documents" className="flex flex-col p-3 rounded-xl hover:bg-white/5 transition-colors group">
                        <span className="text-white text-[11px] font-bold">Document Vault</span>
                        <span className="text-[8px] text-muted-foreground group-hover:text-emerald-400 transition-colors uppercase font-black tracking-widest">Full Checklist</span>
                      </Link>
                      <Link href="/exam-prep" className="flex flex-col p-3 rounded-xl hover:bg-white/5 transition-colors group border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400 text-[11px] font-bold">Exam Prep Hub</span>
                          <span className="bg-blue-500/20 text-[6px] px-1.5 py-0.5 rounded border border-blue-500/30">NEW</span>
                        </div>
                        <span className="text-[8px] text-muted-foreground group-hover:text-blue-300 transition-colors uppercase font-black tracking-widest">Syllabus & Mocks</span>
                      </Link>

                      <Link 
                        href="/simulator" 
                        className="flex flex-col p-3 rounded-xl transition-colors group border-t border-white/5 hover:bg-primary/10"
                      >
                        <div className="flex items-center justify-between">
                            <span className="text-white text-[11px] font-bold">
                              Counseling Simulator
                            </span>
                            <span className={cn(
                              "text-[6px] px-1 py-0.5 rounded border",
                              isAdmin ? "bg-primary/20 text-primary border-primary/30" : "bg-rose-500/20 text-rose-500 border-rose-500/30"
                            )}>
                              {isAdmin ? "MOCK" : "LIVE SOON"}
                            </span>
                        </div>
                        <span className="text-[8px] text-muted-foreground group-hover:text-primary transition-colors uppercase font-black tracking-widest">
                          Option Entry Prep
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>



            <Link href="/wishlist" className="hover:text-white transition-colors flex items-center gap-1.5 bg-rose-500/10 text-rose-400 px-2.5 py-1 rounded-full border border-rose-500/20 text-[11px] font-black uppercase tracking-widest">
              <Heart className="w-3 h-3 fill-current" />
              Wishlist
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2 md:gap-3 bg-white/5 pl-2 pr-1 py-1 rounded-full border border-white/10">
                {isAdmin && (
                  <Link href="/admin" onClick={closeMenu} className="hidden md:block ml-2 bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter hover:bg-orange-500 hover:text-white transition-all">
                    ADMIN
                  </Link>
                )}
                <span className="text-[10px] font-bold text-white/70 ml-1 md:ml-2 hidden md:block max-w-[80px] truncate">{user.name}</span>
                <Link href="/profile" onClick={closeMenu} className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border border-white/20 shrink-0 hover:border-primary transition-all">
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                </Link>
                <button 
                  onClick={logout}
                  className="p-1.5 md:p-2 hover:bg-rose-500/10 hover:text-rose-500 rounded-full transition-all text-muted-foreground"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 md:w-4 md:h-4" />
                </button>
              </div>
            ) : (
              <Link href="/predictor" onClick={closeMenu}>
                <button className="bg-primary hover:bg-primary/90 text-white px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-xl lg:hidden flex flex-col pt-24 px-6 pb-6 overflow-y-auto"
          >
            <div className="flex flex-col gap-4 text-xl font-bold">
              <Link href="/" onClick={closeMenu} className="py-3 border-b border-white/10 hover:text-primary transition-colors">Home</Link>
              <Link href="/rank-predictor" onClick={closeMenu} className="py-3 border-b border-white/10 text-primary flex items-center justify-between">
                Rank Predictor
                <span className="bg-primary/20 text-[10px] px-2 py-0.5 rounded-full border border-primary/30">NEW</span>
              </Link>
              <Link href="/predictor" onClick={closeMenu} className="py-3 border-b border-white/10 hover:text-primary transition-colors">Smart Predictor</Link>
              <Link href="/cutoffs" onClick={closeMenu} className="py-3 border-b border-white/10 hover:text-primary transition-colors">Cutoff Explorer</Link>
              <Link href="/compare" onClick={closeMenu} className="py-3 border-b border-white/10 hover:text-primary transition-colors">Compare Colleges</Link>
              <Link href="/trends" onClick={closeMenu} className="py-3 border-b border-white/10 hover:text-primary transition-colors">Trends</Link>
              <Link href="/community" onClick={closeMenu} className="py-3 border-b border-white/10 text-primary flex items-center justify-between">
                Community Hub
                <span className="bg-primary/20 text-[10px] px-2 py-0.5 rounded-full border border-primary/30 animate-pulse">NEW</span>
              </Link>
              <Link href="/commute" onClick={closeMenu} className="py-3 border-b border-white/10 hover:text-primary transition-colors flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Commute Map
              </Link>
              <Link href="/commute-cost" onClick={closeMenu} className="py-3 border-b border-white/10 text-yellow-400 flex items-center justify-between transition-colors">
                Commute Cost
                <span className="bg-yellow-500/20 text-[8px] px-2 py-0.5 rounded-full border border-yellow-500/30">NEW</span>
              </Link>
              <div className="flex flex-col border-b border-white/10">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-4 mb-2">Counselling Hub</span>
                <Link href="/tracker" onClick={closeMenu} className="py-3 pl-4 text-rose-400 flex items-center justify-between transition-colors">
                  KEA Live Tracker
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-4" />
                </Link>
                <Link href="/hostels" onClick={closeMenu} className="py-3 pl-4 text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2">
                  <Building className="w-4 h-4" /> Budget Hostels
                </Link>
                <Link href="/instructions" onClick={closeMenu} className="py-3 pl-4 hover:text-primary transition-colors">Instructions</Link>
                <Link href="/guide" onClick={closeMenu} className="py-3 pl-4 hover:text-primary transition-colors">Roadmap 2025</Link>
                <Link href="/documents" onClick={closeMenu} className="py-3 pl-4 hover:text-emerald-400 transition-colors">Document Vault</Link>
                <Link href="/exam-prep" onClick={closeMenu} className="py-3 pl-4 text-blue-400 flex items-center justify-between transition-colors">
                  Exam Prep Hub
                  <span className="bg-blue-500/20 text-[8px] px-2 py-0.5 rounded-full border border-blue-500/30 mr-4">NEW</span>
                </Link>

                <Link 
                  href="/simulator" 
                  onClick={closeMenu} 
                  className="py-3 pl-4 text-primary flex items-center justify-between transition-colors"
                >
                  Counseling Simulator
                  <span className={cn(
                    "text-[8px] px-2 py-0.5 rounded-full border mr-4",
                    isAdmin ? "bg-primary/20 border-primary/30 text-primary" : "bg-rose-500/20 border-rose-500/30 text-rose-500"
                  )}>
                    {isAdmin ? "MOCK" : "LIVE SOON"}
                  </span>
                </Link>
              </div>
              
              <Link href="/wishlist" onClick={closeMenu} className="py-4 mt-2 flex items-center justify-center gap-2 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20">
                <Heart className="w-5 h-5 fill-current" />
                My Wishlist
              </Link>

              {user && (
                <Link href="/profile" onClick={closeMenu} className="py-4 mt-2 flex items-center justify-center gap-2 bg-primary/10 text-primary rounded-2xl border border-primary/20">
                  <Sparkles className="w-5 h-5" />
                  Community Profile
                </Link>
              )}

              {user && isAdmin && (
                <Link href="/admin" onClick={closeMenu} className="py-4 mt-2 flex items-center justify-center gap-2 bg-orange-500 text-black rounded-2xl shadow-lg shadow-orange-500/20 uppercase tracking-widest text-sm">
                  Admin Console
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

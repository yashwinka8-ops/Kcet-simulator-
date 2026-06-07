'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, Zap, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose?: () => void;
    allowSkip?: boolean;
    title?: string;
    subtitle?: string;
}

export function AuthModal({ isOpen, onClose, allowSkip = true, title = "Sign in to Continue", subtitle = "Unlock personalized predictions and save your dream colleges." }: AuthModalProps) {
    const { loginWithGoogle, setAsGuest } = useAuth();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={allowSkip ? onClose : undefined}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative glass-card w-full max-w-md p-8 overflow-hidden"
                >
                    {/* Decorative Background */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                            </div>
                            {allowSkip && onClose && (
                                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold mb-2">{title}</h2>
                        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                            {subtitle}
                        </p>

                        <div className="space-y-4">
                            <button 
                                onClick={loginWithGoogle}
                                className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all active:scale-[0.98]"
                            >
                                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                                Continue with Google
                            </button>

                            {allowSkip && (
                                <button 
                                    onClick={() => {
                                        setAsGuest();
                                        if (onClose) onClose();
                                    }}
                                    className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-bold text-sm hover:bg-white/10 transition-all active:scale-[0.98]"
                                >
                                    Continue as Guest
                                </button>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground font-black">
                            <Zap className="w-3 h-3 text-primary" /> Premium Counseling Security
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

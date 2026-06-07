'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Play, Pause, RotateCcw, Clock, Coffee, Music } from 'lucide-react';

export function PomodoroTimer() {
  const { user, profile, updateProfile } = useAuth();
  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [ambientSound, setAmbientSound] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Track accumulated time locally to save to Firebase periodically
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isActive && ambientSound) {
        audioRef.current.src = ambientSound;
        audioRef.current.play().catch(e => console.log('Audio autoplay blocked'));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isActive, ambientSound]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
        if (mode === 'focus') {
          setSessionTime((st) => st + 1);
        }
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Timer finished
      if (mode === 'focus') {
        saveStudyTime(sessionTime);
        setMode('break');
        setTimeLeft(5 * 60); // 5 min break
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Focus Session Complete!', { body: 'Great job! Time for a 5-minute break.' });
        } else {
          alert('Focus session completed! Take a 5 minute break.');
        }
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Break Over!', { body: 'Ready to focus again?' });
        } else {
          alert('Break is over! Ready to focus again?');
        }
      }
      setIsActive(false);
      setSessionTime(0);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => {
    if (!isActive) {
      // Request notification permission when they start the timer
      if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
    setIsActive(!isActive);
  };

  const saveStudyTime = async (seconds: number) => {
    if (!user) return;
    const minutes = Math.floor(seconds / 60);
    if (minutes > 0) {
      const currentHours = profile?.studyHours || 0;
      await updateProfile({ studyHours: currentHours + minutes });
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'focus' && sessionTime > 60) {
      saveStudyTime(sessionTime); // Save whatever was tracked before resetting
    }
    setSessionTime(0);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const setModeManually = (newMode: 'focus' | 'break') => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalMinutes = profile?.studyHours || 0;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
      <audio ref={audioRef} loop />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Clock className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Focus Timer</h2>
            <p className="text-sm text-muted-foreground">Track your study hours</p>
          </div>
        </div>
        <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Total Focus</span>
          <span className="text-sm font-black text-white">{hours}h {minutes}m</span>
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-black/40 border border-white/5 rounded-full p-1 flex items-center">
          <button
            onClick={() => setModeManually('focus')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              mode === 'focus' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' : 'text-muted-foreground hover:text-white'
            }`}
          >
            Focus
          </button>
          <button
            onClick={() => setModeManually('break')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
              mode === 'break' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-muted-foreground hover:text-white'
            }`}
          >
            <Coffee className="w-4 h-4" /> Break
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-10">
        <div className="relative mb-10 group">
          <div className={`absolute inset-0 rounded-full blur-3xl opacity-20 transition-all duration-1000 ${
            isActive ? (mode === 'focus' ? 'bg-purple-500' : 'bg-emerald-500') : 'bg-transparent'
          }`} />
          <h1 className={`text-7xl md:text-9xl font-black tracking-tighter relative z-10 transition-colors ${
            mode === 'focus' ? 'text-white' : 'text-emerald-400'
          }`}>
            {formatTime(timeLeft)}
          </h1>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTimer}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isActive 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-white text-black hover:scale-105'
              }`}
            >
              {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>
            <button
              onClick={resetTimer}
              className="w-12 h-12 rounded-full bg-black/40 hover:bg-white/10 border border-white/5 text-muted-foreground hover:text-white flex items-center justify-center transition-all"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-full px-4 py-2 mt-4">
            <Music className="w-4 h-4 text-muted-foreground" />
            <select 
              value={ambientSound}
              onChange={(e) => setAmbientSound(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none"
            >
              <option value="">No Ambient Sound</option>
              <option value="https://cdn.pixabay.com/download/audio/2022/05/16/audio_9e3bd91523.mp3">Lofi Focus (Math/Physics)</option>
              <option value="https://cdn.pixabay.com/download/audio/2021/08/09/audio_dc39bde808.mp3">Alpha Waves (Chemistry)</option>
              <option value="https://cdn.pixabay.com/download/audio/2022/03/15/audio_249dfcd687.mp3">Exam Hall Noise</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

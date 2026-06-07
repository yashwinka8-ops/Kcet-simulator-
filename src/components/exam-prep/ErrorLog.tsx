'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { BookX, Plus, Trash2, CheckCircle, AlertCircle, Mic, MicOff } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function ErrorLog() {
  const { user, profile, updateProfile } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  // Form State
  const [subject, setSubject] = useState('Physics');
  const [topic, setTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [notes, setNotes] = useState('');
  
  // Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [activeField, setActiveField] = useState<'question' | 'notes' | null>(null);

  useEffect(() => {
    if (profile?.errorLog) {
      setLogs(profile.errorLog);
    }
  }, [profile]);

  const startListening = (field: 'question' | 'notes') => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      setIsRecording(true);
      setActiveField(field);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
        
      if (field === 'question') setQuestion(transcript);
      if (field === 'notes') setNotes(transcript);
    };
    
    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsRecording(false);
      setActiveField(null);
    };
    
    recognition.onend = () => {
      setIsRecording(false);
      setActiveField(null);
    };
    
    recognition.start();
  };

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to save your error logs.");
      return;
    }

    const newLog = {
      id: uuidv4(),
      subject,
      topic,
      question,
      notes,
      isResolved: false
    };

    const newLogs = [newLog, ...logs];
    setLogs(newLogs);
    await updateProfile({ errorLog: newLogs });
    
    setIsAdding(false);
    setTopic('');
    setQuestion('');
    setNotes('');
  };

  const toggleResolved = async (id: string) => {
    const newLogs = logs.map(l => l.id === id ? { ...l, isResolved: !l.isResolved } : l);
    setLogs(newLogs);
    await updateProfile({ errorLog: newLogs });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this error log?")) return;
    const newLogs = logs.filter(l => l.id !== id);
    setLogs(newLogs);
    await updateProfile({ errorLog: newLogs });
  };

  const unresolvedCount = logs.filter(l => !l.isResolved).length;

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/20 rounded-xl">
            <BookX className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Mistake Notebook</h2>
            <p className="text-sm text-muted-foreground">{unresolvedCount} unresolved concepts</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-white/90 transition-colors"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Mistake</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddLog} className="bg-black/40 border border-white/10 rounded-xl p-5 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase">Subject</label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Biology">Biology</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase">Topic / Chapter</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Rotational Motion"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
          
          <div className="space-y-1.5 relative">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground uppercase">Question / Concept</label>
              <button 
                type="button" 
                onClick={() => startListening('question')}
                className={`p-1 rounded-full ${isRecording && activeField === 'question' ? 'bg-red-500 text-white animate-pulse' : 'text-muted-foreground hover:text-white'}`}
              >
                {isRecording && activeField === 'question' ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
            </div>
            <textarea 
              rows={2}
              required
              placeholder="What was the question or concept you got wrong?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          <div className="space-y-1.5 relative">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground uppercase">Solution / Key Takeaway</label>
              <button 
                type="button" 
                onClick={() => startListening('notes')}
                className={`p-1 rounded-full ${isRecording && activeField === 'notes' ? 'bg-red-500 text-white animate-pulse' : 'text-muted-foreground hover:text-white'}`}
              >
                {isRecording && activeField === 'notes' ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
            </div>
            <textarea 
              rows={2}
              required
              placeholder="Why did you get it wrong? What is the correct approach?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 resize-none"
            />
          </div>
          
          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors"
            >
              Save to Notebook
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="text-center py-10 border border-white/5 border-dashed rounded-xl">
            <p className="text-muted-foreground text-sm">No mistakes logged. Great job!</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={`p-4 border rounded-xl transition-colors ${log.isResolved ? 'bg-white/5 border-white/5 opacity-70' : 'bg-black/40 border-white/10'}`}>
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                    log.subject === 'Physics' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                    log.subject === 'Chemistry' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    log.subject === 'Mathematics' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' :
                    'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  }`}>
                    {log.subject}
                  </span>
                  <span className="text-sm font-bold text-white/70">{log.topic}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleResolved(log.id)}
                    className={`p-1.5 rounded-lg transition-colors ${log.isResolved ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/10 text-white/50 hover:text-white'}`}
                    title={log.isResolved ? "Mark Unresolved" : "Mark Resolved"}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(log.id)}
                    className="p-1.5 rounded-lg bg-white/5 text-white/50 hover:bg-red-500/20 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex gap-3">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-white">{log.question}</p>
                </div>
                <div className="flex gap-3 bg-black/40 p-3 rounded-lg border border-white/5">
                  <div className="w-4 h-4 shrink-0 flex items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-bold mt-0.5">A</div>
                  <p className="text-sm text-emerald-100">{log.notes}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

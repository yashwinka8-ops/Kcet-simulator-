'use client';

import React, { useState } from 'react';
import { Bot, Send, User, Sparkles } from 'lucide-react';

export function AIInterviewer() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: "Hello! I'm your KCET AI Mentor. Do you want me to quiz you on a concept, or simulate a counselling interview?" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMsg.text);
      setMessages(prev => [...prev, { id: Date.now(), role: 'ai', text: aiResponse }]);
    }, 1000);
  };

  const generateAIResponse = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('counselling') || lower.includes('interview')) {
      return "Great. Let's practice. Why do you want to pursue Computer Science Engineering over Electronics and Communication? What are your career goals?";
    } else if (lower.includes('quiz') || lower.includes('concept')) {
      return "Alright! Let's talk about Physics. Can you explain the difference between electric potential and electric potential energy?";
    } else {
      return "Interesting. Tell me more, or let me know if you want to switch to a rapid-fire quiz on a specific subject!";
    }
  };

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 h-[80vh] flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-500/20 rounded-xl">
          <Bot className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            AI Mentor & Interviewer <Sparkles className="w-4 h-4 text-indigo-400" />
          </h2>
          <p className="text-sm text-muted-foreground">Practice viva voce, counseling Q&A, and concept quizzes</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
                <Bot className="w-4 h-4 text-indigo-400" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-black/40 text-white/90 border border-white/10 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="relative">
        <input 
          type="text" 
          placeholder="Type your answer here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

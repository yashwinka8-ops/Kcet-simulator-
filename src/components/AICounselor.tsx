"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, User, Loader2, ChevronDown, Cpu, Zap, BrainCircuit } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MODELS = [
  { id: "nvidia/nemotron-4-340b-instruct", name: "Nemotron-3 Super 120B", provider: "NVIDIA", icon: Cpu, color: "text-green-400" },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "Google", icon: Zap, color: "text-blue-400" },
  { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro (Future)", provider: "Google", icon: BrainCircuit, color: "text-purple-400" },
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B", provider: "Meta", icon: Bot, color: "text-indigo-400" },
  { id: "qwen/qwen3-32b", name: "Qwen 3.0 Instruct", provider: "Alibaba", icon: Cpu, color: "text-orange-400" },
];

export default function AICounselor() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[1]); // Default to Gemini 2.0 Flash
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const textToSend = overrideText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          modelId: selectedModel.id
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${error.message}. Please check your API key for ${selectedModel.provider}.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:scale-110 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] ${
            isOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        >
          <Sparkles className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[420px] h-[650px] max-h-[85vh] max-w-[calc(100vw-48px)] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        {/* Header with Model Selector */}
        <div className="p-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border-b border-white/5 backdrop-blur-md shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg">
                <selectedModel.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-none">Counseling AI</h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${selectedModel.color}`}>{selectedModel.provider} Intelligence</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Model Selector Trigger */}
          <div className="relative">
            <button 
              onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
              className="w-full flex items-center justify-between px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-2">
                <selectedModel.icon className={`w-3.5 h-3.5 ${selectedModel.color}`} />
                <span>{selectedModel.name}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isModelMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isModelMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model);
                      setIsModelMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-xs transition-colors hover:bg-white/5 ${
                      selectedModel.id === model.id ? 'bg-white/5 text-white' : 'text-white/60'
                    }`}
                  >
                    <model.icon className={`w-4 h-4 ${model.color}`} />
                    <div className="flex-1">
                      <div className="font-bold">{model.name}</div>
                      <div className="text-[10px] opacity-50">{model.provider}</div>
                    </div>
                    {selectedModel.id === model.id && <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
              <Sparkles className="w-12 h-12 text-purple-400" />
              <div>
                <p className="text-sm font-bold text-white mb-1">Select an AI Brain to begin.</p>
                <p className="text-xs text-muted-foreground">Each model offers a unique perspective on your KCET options.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <button onClick={() => handleSubmit(undefined, "Analyze my chances with rank 5000 in GM category.")} className="px-3 py-1.5 rounded-full bg-white/5 text-xs border border-white/10 hover:bg-white/10 transition-colors">Rank Analysis</button>
                <button onClick={() => handleSubmit(undefined, "Compare RVCE vs PESU for CS.")} className="px-3 py-1.5 rounded-full bg-white/5 text-xs border border-white/10 hover:bg-white/10 transition-colors">Compare Colleges</button>
              </div>
            </div>
          ) : (
            messages.map((message, i) => (
              <div
                key={i}
                className={`flex gap-3 max-w-[90%] ${
                  message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  message.role === "user" ? "bg-white/10" : "bg-gradient-to-r from-indigo-500 to-pink-500 shadow-md"
                }`}>
                  {message.role === "user" ? <User className="w-3.5 h-3.5 text-white/70" /> : <selectedModel.icon className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  message.role === "user" 
                    ? "bg-white/10 text-white rounded-tr-sm shadow-sm" 
                    : "bg-white/[0.03] border border-white/5 text-white/90 rounded-tl-sm"
                }`}>
                  {message.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3 max-w-[90%] mr-auto">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center shrink-0 mt-1">
                <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-1.5 rounded-tl-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white/[0.02] border-t border-white/5 shrink-0">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Message ${selectedModel.name}...`}
              className="w-full bg-black/60 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white disabled:opacity-50 disabled:grayscale transition-all hover:scale-105"
            >
              <Send className="w-4 h-4 -ml-0.5" />
            </button>
          </form>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </>
  );
}

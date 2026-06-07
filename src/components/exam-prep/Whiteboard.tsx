'use client';

import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Eraser, Trash2, Download } from 'lucide-react';

export function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set proper canvas resolution for high DPI displays
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#18181b'; // zinc-900
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = isEraser ? '#18181b' : color;
    ctx.lineWidth = isEraser ? lineWidth * 5 : lineWidth;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'kcet-scratchpad.png';
    link.href = dataUrl;
    link.click();
  };

  const colors = ['#ffffff', '#ef4444', '#10b981', '#3b82f6', '#f59e0b'];

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col h-[700px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/20 rounded-xl">
            <PenTool className="w-6 h-6 text-teal-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Rough Scratchpad</h2>
            <p className="text-sm text-muted-foreground">Solve math equations without leaving the app</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-black/40 p-2 rounded-xl border border-white/10 overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            {colors.map(c => (
              <button
                key={c}
                onClick={() => { setColor(c); setIsEraser(false); }}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${!isEraser && color === c ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
                title={`Color ${c}`}
              />
            ))}
          </div>
          
          <div className="w-px h-8 bg-white/10 mx-1" />
          
          <button 
            onClick={() => setIsEraser(!isEraser)}
            className={`p-2 rounded-lg transition-colors ${isEraser ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}
            title="Eraser"
          >
            <Eraser className="w-5 h-5" />
          </button>
          
          <div className="w-px h-8 bg-white/10 mx-1" />
          
          <button 
            onClick={clearCanvas}
            className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors"
            title="Clear All"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          
          <button 
            onClick={downloadCanvas}
            className="p-2 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            title="Download Notes"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full rounded-xl overflow-hidden border border-white/10 cursor-crosshair relative touch-none bg-[#18181b]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}

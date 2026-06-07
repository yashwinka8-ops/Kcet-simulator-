'use client';

import React, { useState } from 'react';
import { PlaySquare, MonitorPlay } from 'lucide-react';

export function YouTubePlayer() {
  const [videoId, setVideoId] = useState('jfKfPfyJRdk'); // Default to Lofi Girl
  const [inputUrl, setInputUrl] = useState('');

  const extractVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const handleLoad = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(inputUrl);
    if (id) {
      setVideoId(id);
      setInputUrl('');
    } else {
      alert("Invalid YouTube URL");
    }
  };

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 h-[80vh] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/20 rounded-xl">
            <MonitorPlay className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Distraction-Free YouTube</h2>
            <p className="text-sm text-muted-foreground">Watch lectures without comments or recommendations</p>
          </div>
        </div>
        
        <form onSubmit={handleLoad} className="flex items-center gap-2">
          <input 
            type="url" 
            placeholder="Paste YouTube Link..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 w-64"
          />
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors">
            <PlaySquare className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden border border-white/10 relative bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&autohide=1&showinfo=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        ></iframe>
      </div>
    </div>
  );
}

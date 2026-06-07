'use client';

import React, { useState } from 'react';
import { CheckSquare, Check } from 'lucide-react';

const INITIAL_ITEMS = [
  { id: 1, text: "Admit Card / Hall Ticket (Printed, 2 copies)", category: "Documents", checked: false },
  { id: 2, text: "Valid Photo ID (Aadhar / Passport / PAN)", category: "Documents", checked: false },
  { id: 3, text: "Recent Passport Size Photographs (2-3 copies)", category: "Documents", checked: false },
  { id: 4, text: "Blue/Black Ballpoint Pens (At least 3)", category: "Stationery", checked: false },
  { id: 5, text: "Transparent Water Bottle", category: "Essentials", checked: false },
  { id: 6, text: "Hand Sanitizer (Small transparent bottle)", category: "Essentials", checked: false },
  { id: 7, text: "Wristwatch (Analog, NOT digital/smart)", category: "Essentials", checked: false },
  { id: 8, text: "Printout of Route Map to Exam Center", category: "Miscellaneous", checked: false },
];

export function PackingList() {
  const [items, setItems] = useState(INITIAL_ITEMS);

  const toggleItem = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const progress = Math.round((items.filter(i => i.checked).length / items.length) * 100);

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto h-[600px] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-500/20 rounded-xl">
            <CheckSquare className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Exam Day Packing</h2>
            <p className="text-sm text-muted-foreground">Don't forget the essentials</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/10">
          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-bold text-white">{progress}%</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pr-2 space-y-6">
        {['Documents', 'Stationery', 'Essentials', 'Miscellaneous'].map(category => {
          const categoryItems = items.filter(i => i.category === category);
          if (categoryItems.length === 0) return null;
          
          return (
            <div key={category}>
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">{category}</h3>
              <div className="space-y-2">
                {categoryItems.map(item => (
                  <div 
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      item.checked 
                        ? 'bg-yellow-500/10 border-yellow-500/30' 
                        : 'bg-black/40 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      item.checked ? 'bg-yellow-500 border-yellow-500' : 'border-white/30'
                    }`}>
                      {item.checked && <Check className="w-3.5 h-3.5 text-black" />}
                    </div>
                    <span className={`text-sm transition-colors ${item.checked ? 'text-yellow-200 line-through opacity-70' : 'text-white'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

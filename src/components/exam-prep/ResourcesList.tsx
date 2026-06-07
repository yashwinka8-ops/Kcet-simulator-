'use client';

import React from 'react';
import { BookMarked, ExternalLink, FileText, Video } from 'lucide-react';

export function ResourcesList() {
  const resources = [
    {
      category: "Previous Year Papers",
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      items: [
        { title: "KCET 2023 - All Subjects", link: "#" },
        { title: "KCET 2022 - All Subjects", link: "#" },
        { title: "KCET 2021 - All Subjects", link: "#" },
      ]
    },
    {
      category: "Important Formulas",
      icon: <BookMarked className="w-5 h-5 text-emerald-400" />,
      items: [
        { title: "Physics Formula Sheet (Class 11 & 12)", link: "#" },
        { title: "Chemistry Reactions Cheat Sheet", link: "#" },
        { title: "Mathematics Quick Formulas", link: "#" },
      ]
    },
    {
      category: "Video Lectures",
      icon: <Video className="w-5 h-5 text-rose-400" />,
      items: [
        { title: "One Shot Physics KCET", link: "#" },
        { title: "Chemistry Important Concepts", link: "#" },
        { title: "Maths Shortcut Tricks", link: "#" },
      ]
    }
  ];

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-2">Preparation Resources</h2>
        <p className="text-sm text-muted-foreground">Quick access to important study materials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((group, index) => (
          <div key={index} className="bg-black/40 border border-white/5 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                {group.icon}
              </div>
              <h3 className="font-bold text-white text-sm">{group.category}</h3>
            </div>
            
            <ul className="space-y-3">
              {group.items.map((item, idx) => (
                <li key={idx}>
                  <a 
                    href={item.link} 
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-2 p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                      {item.title}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-xl text-center">
        <p className="text-sm text-primary font-medium">
          More resources and official KEA links will be added soon. Stay tuned!
        </p>
      </div>
    </div>
  );
}

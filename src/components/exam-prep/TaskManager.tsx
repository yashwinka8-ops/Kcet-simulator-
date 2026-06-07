'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { CheckSquare, Plus, Trash2, Calendar, Check } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function TaskManager() {
  const { user, profile, updateProfile } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  
  useEffect(() => {
    if (profile?.tasks) {
      setTasks(profile.tasks);
    }
  }, [profile]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to save tasks.");
      return;
    }
    if (!newTask.trim()) return;

    const taskObj = {
      id: uuidv4(),
      title: newTask,
      completed: false,
      date: new Date().toISOString()
    };

    const newTasks = [taskObj, ...tasks];
    setTasks(newTasks);
    await updateProfile({ tasks: newTasks });
    setNewTask('');
  };

  const toggleTask = async (id: string) => {
    const updatedTasks = tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
    await updateProfile({ tasks: updatedTasks });

    // Confetti Check
    const justCompleted = updatedTasks.find(t => t.id === id)?.completed;
    if (justCompleted) {
      const allDone = updatedTasks.every(t => t.completed);
      if (allDone && updatedTasks.length > 0) {
        import('canvas-confetti').then((confetti) => {
          confetti.default({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#10b981', '#f59e0b']
          });
        });
      }
    }
  };

  const deleteTask = async (id: string) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    await updateProfile({ tasks: updatedTasks });
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <CheckSquare className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Daily Goals</h2>
            <p className="text-sm text-muted-foreground">{completedCount} of {tasks.length} completed</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAddTask} className="mb-6 relative">
        <input 
          type="text" 
          placeholder="Add a new study goal..." 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button 
          type="submit"
          disabled={!newTask.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-500 text-white rounded-lg disabled:opacity-50 transition-all hover:bg-blue-600"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 space-y-2 no-scrollbar">
        {tasks.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground text-sm">No tasks added yet. Plan your day!</p>
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id} 
              className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
                task.completed ? 'bg-white/5 border-white/5 opacity-60' : 'bg-black/40 border-white/10 hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <button 
                  onClick={() => toggleTask(task.id)}
                  className={`shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    task.completed ? 'bg-blue-500 border-blue-500' : 'border-white/20 hover:border-blue-500'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
                <span className={`text-sm truncate ${task.completed ? 'line-through text-muted-foreground' : 'text-white'}`}>
                  {task.title}
                </span>
              </div>
              <button 
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

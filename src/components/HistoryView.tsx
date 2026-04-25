import React from 'react';
import { motion } from 'motion/react';
import { HistoryEntry } from '../types';
import { Play, ArrowLeft } from 'lucide-react';

export default function HistoryView({ history, onPlay, onBack }: { history: HistoryEntry[], onPlay: (entry: HistoryEntry) => void, onBack: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-md mx-auto p-8 bg-white/60 backdrop-blur-lg organic-card shadow-xl border border-white/50"
    >
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="p-3 bg-white/80 organic-shape-2 hover:bg-white text-stone-600 transition-colors shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-stone-700 ml-4">时光日记本</h2>
      </div>

      <div className="space-y-6 relative border-l-2 border-orange-200 ml-4 pl-6">
        {history.length === 0 ? (
          <p className="text-stone-500 text-sm py-10">还没有记录哦，去写下第一篇日记吧~</p>
        ) : (
          history.map(entry => (
            <div key={entry.id} className="relative">
              <div className="absolute -left-[33px] top-2 w-4 h-4 bg-orange-400 rounded-full border-4 border-white shadow-sm"></div>
              <div className="p-5 organic-card bg-white/80 shadow-sm border border-white/50 hover:bg-white transition-colors">
                <div className="text-sm font-bold text-orange-400 mb-3">{entry.date}</div>
                <ul className="text-sm text-stone-600 space-y-2 mb-5">
                  {entry.gratitudes.map((g, i) => <li key={i}>✨ {g}</li>)}
                </ul>
                <button 
                  onClick={() => onPlay(entry)}
                  className="flex items-center gap-2 text-sm text-white font-bold bg-blue-400/90 hover:bg-blue-500/90 px-5 py-3 organic-button transition-colors shadow-md shadow-blue-200"
                >
                  <Play size={16} fill="currentColor" /> 回顾 Vlog
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

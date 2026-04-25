import React, { useState } from 'react';
import { motion } from 'motion/react';

export default function JournalInput({ onSubmit }: { onSubmit: (gratitudes: string[]) => void }) {
  const [gratitudes, setGratitudes] = useState(['', '', '']);
  const [isClicked, setIsClicked] = useState(false);

  const updateGratitude = (index: number, value: string) => {
    const newG = [...gratitudes];
    newG[index] = value;
    setGratitudes(newG);
  };

  const isComplete = gratitudes.every(g => g.trim().length > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-md mx-auto p-8 bg-white/60 backdrop-blur-lg organic-card shadow-xl border border-white/50"
    >
      <h2 className="text-2xl font-bold text-stone-700 mb-2 text-center">今日感恩日记</h2>
      <p className="text-stone-500 text-sm text-center mb-8">记录今天值得感恩的三件小事</p>
      
      <div className="space-y-6">
        {[1, 2, 3].map((num, i) => (
          <div key={i} className="relative group">
            <div className="absolute -left-3 -top-3 w-8 h-8 bg-blue-100 text-blue-500 font-bold flex items-center justify-center organic-shape-3 shadow-sm z-10">
              {num}
            </div>
            <textarea 
              value={gratitudes[i]} 
              onChange={e => updateGratitude(i, e.target.value)} 
              placeholder={`今天发生的第 ${num} 件好事...`} 
              rows={2} 
              className="w-full p-5 pl-6 bg-white/80 border border-stone-100 focus:ring-2 focus:ring-blue-200 outline-none organic-input shadow-sm transition-all hover:bg-white resize-none" 
            />
          </div>
        ))}

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setIsClicked(true);
            onSubmit(gratitudes);
          }} 
          disabled={!isComplete || isClicked} 
          className={`w-full py-4 mt-4 text-white font-bold organic-button transition-colors shadow-lg flex items-center justify-center gap-2 ${isClicked ? 'bg-green-400 shadow-green-200/50' : 'bg-orange-300 shadow-orange-200/50 hover:bg-orange-400'}`}
        >
          {isClicked ? '✨ 正在准备...' : '✨ 生成我的治愈 Vlog'}
        </motion.button>
      </div>
    </motion.div>
  );
}

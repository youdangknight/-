import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CharacterProfile } from '../types';

export default function Onboarding({ onComplete }: { onComplete: (data: { character: CharacterProfile, futureGoals: string }) => void }) {
  const [character, setCharacter] = useState<CharacterProfile>({
    gender: '女',
    hairstyle: '短发',
    vibe: '温柔安静',
    clothing: '休闲毛衣'
  });
  const [futureGoals, setFutureGoals] = useState('');
  const [isClicked, setIsClicked] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-md mx-auto p-8 bg-white/60 backdrop-blur-lg organic-card shadow-xl border border-white/50"
    >
      <h2 className="text-2xl font-bold text-stone-700 mb-2 text-center">定制你的专属主角</h2>
      <p className="text-stone-500 text-sm text-center mb-8">这个角色将代替你，在Vlog中体验生活的美好</p>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-stone-600 ml-2">性别</label>
          <select 
            value={character.gender} 
            onChange={e => setCharacter({...character, gender: e.target.value})} 
            className="w-full p-4 bg-white/80 border border-stone-100 focus:ring-2 focus:ring-blue-200 outline-none organic-input shadow-sm transition-all hover:bg-white"
          >
            <option value="女">女</option>
            <option value="男">男</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-stone-600 ml-2">发型</label>
          <input 
            type="text" 
            value={character.hairstyle} 
            onChange={e => setCharacter({...character, hairstyle: e.target.value})} 
            placeholder="例如：黑色短发、棕色长卷发" 
            className="w-full p-4 bg-white/80 border border-stone-100 focus:ring-2 focus:ring-blue-200 outline-none organic-input shadow-sm transition-all hover:bg-white" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-stone-600 ml-2">气质</label>
          <input 
            type="text" 
            value={character.vibe} 
            onChange={e => setCharacter({...character, vibe: e.target.value})} 
            placeholder="例如：温柔安静、阳光开朗" 
            className="w-full p-4 bg-white/80 border border-stone-100 focus:ring-2 focus:ring-blue-200 outline-none organic-input shadow-sm transition-all hover:bg-white" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-stone-600 ml-2">穿搭</label>
          <input 
            type="text" 
            value={character.clothing} 
            onChange={e => setCharacter({...character, clothing: e.target.value})} 
            placeholder="例如：日系休闲、职场西装" 
            className="w-full p-4 bg-white/80 border border-stone-100 focus:ring-2 focus:ring-blue-200 outline-none organic-input shadow-sm transition-all hover:bg-white" 
          />
        </div>

        <div className="space-y-2 pt-4">
          <label className="text-sm font-bold text-stone-600 ml-2">未来的心愿 / 目标 🌟</label>
          <textarea 
            value={futureGoals} 
            onChange={e => setFutureGoals(e.target.value)} 
            placeholder="例如：成为一名优秀的产品经理，去冰岛看极光..." 
            rows={3} 
            className="w-full p-4 bg-white/80 border border-stone-100 focus:ring-2 focus:ring-blue-200 outline-none organic-input shadow-sm transition-all hover:bg-white resize-none" 
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setIsClicked(true);
            onComplete({ character, futureGoals });
          }} 
          disabled={!futureGoals || isClicked} 
          className={`w-full py-4 mt-6 text-white font-bold organic-button transition-colors shadow-lg ${isClicked ? 'bg-green-400 shadow-green-200/50' : 'bg-orange-300 shadow-orange-200/50 hover:bg-orange-400'}`}
        >
          {isClicked ? '准备中...' : '开始记录'}
        </motion.button>
      </div>
    </motion.div>
  );
}

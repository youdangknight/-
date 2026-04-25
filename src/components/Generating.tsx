import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { generateScript, generateImage, generateTTS } from '../lib/gemini';
import { UserData, VlogScript } from '../types';

const getAudioDuration = (src: string): Promise<number> => {
  return new Promise((resolve) => {
    if (!src) return resolve(5);
    const audio = new Audio(src);
    audio.onloadedmetadata = () => resolve(audio.duration);
    audio.onerror = () => resolve(5);
  });
};

export default function Generating({ gratitudes, userData, onComplete }: { gratitudes: string[], userData: UserData, onComplete: (script: VlogScript) => void }) {
  const [status, setStatus] = useState("正在构思分镜脚本...");
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    let isMounted = true;
    const run = async () => {
      try {
        const script = await generateScript(gratitudes, userData.character, userData.futureGoals);
        if (!isMounted) return;
        setProgress(30);
        setStatus("正在绘制治愈画面...");

        const imagesPromise = Promise.all(script.scenes.map(s => generateImage(s.imagePrompt)));
        
        const voiceName = userData.character.gender === '男' ? 'Zephyr' : 'Kore';
        const audiosPromise = Promise.all(script.scenes.map(s => generateTTS(s.voiceover, voiceName)));

        const [images, audios] = await Promise.all([imagesPromise, audiosPromise]);
        if (!isMounted) return;
        setProgress(80);
        setStatus("正在剪辑视频...");

        for (let i = 0; i < script.scenes.length; i++) {
          script.scenes[i].imageUrl = images[i];
          script.scenes[i].audioUrl = audios[i];
          script.scenes[i].duration = await getAudioDuration(audios[i] || '');
        }

        setProgress(100);
        setTimeout(() => {
          if (isMounted) onComplete(script);
        }, 1000);

      } catch (error) {
        console.error(error);
        if (isMounted) setStatus("生成失败，请重试");
      }
    };
    run();
    return () => { isMounted = false; };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="max-w-md mx-auto p-10 bg-white/60 backdrop-blur-lg organic-card shadow-xl border border-white/50 text-center"
    >
      <div className="w-32 h-32 mx-auto mb-8 relative flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-orange-200 organic-shape-1 opacity-50 blur-sm"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 bg-gradient-to-bl from-green-100 to-blue-100 organic-shape-2 opacity-60"
        />
        <div className="relative z-10 text-4xl">✨</div>
      </div>
      
      <h2 className="text-xl font-bold text-stone-700 mb-6">{status}</h2>
      
      <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden shadow-inner p-0.5">
        <motion.div 
          className="bg-gradient-to-r from-blue-300 via-green-200 to-orange-300 h-full rounded-full" 
          initial={{ width: 0 }} 
          animate={{ width: `${progress}%` }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

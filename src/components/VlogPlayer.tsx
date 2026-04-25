import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VlogScript } from '../types';
import { Play, RotateCcw, Share2, X } from 'lucide-react';

export default function VlogPlayer({ script, onRestart }: { script: VlogScript, onRestart: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startVlog = () => {
    setHasStarted(true);
    setIsPlaying(true);
    playScene(0);
  };

  const playScene = (idx: number) => {
    if (idx >= script.scenes.length) {
      setIsPlaying(false);
      return;
    }
    setCurrentSceneIdx(idx);
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    if (script.scenes[idx].audioUrl) {
      const audio = new Audio(script.scenes[idx].audioUrl);
      audioRef.current = audio;
      audio.play().catch(e => {
        console.error("Audio playback failed:", e);
        setTimeout(() => {
          playScene(idx + 1);
        }, script.scenes[idx].duration * 1000);
      });
      
      audio.onended = () => {
        playScene(idx + 1);
      };
    } else {
      setTimeout(() => {
        playScene(idx + 1);
      }, script.scenes[idx].duration * 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handlePlatformShare = (platform: string) => {
    setShareMessage(`已保存到相册，快去${platform}分享吧！`);
    setTimeout(() => {
      setShareMessage('');
      setShowShareModal(false);
    }, 2500);
  };

  const currentScene = script.scenes[currentSceneIdx];
  const isEnded = hasStarted && !isPlaying && currentSceneIdx === script.scenes.length - 1;

  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');

  return (
    <div className="max-w-md mx-auto relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full aspect-[9/16] bg-stone-900 organic-card overflow-hidden shadow-2xl border-4 border-white/40"
      >
        
        {!hasStarted ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
            <img src={script.scenes[0].imageUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/30 to-stone-900/10" />
            
            <div className="relative z-10 text-center space-y-8">
              <div className="inline-block px-5 py-2 bg-white/20 backdrop-blur-md organic-shape-3 text-sm tracking-widest border border-white/30">
                {today}
              </div>
              <h1 className="text-4xl font-bold leading-tight drop-shadow-lg">
                {script.title || "今天也很好"}
              </h1>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startVlog}
                className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-300 to-orange-400 text-white organic-shape-1 flex items-center justify-center shadow-lg shadow-orange-400/40 border-2 border-white/50"
              >
                <Play fill="currentColor" size={36} className="ml-2" />
              </motion.button>
            </div>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSceneIdx}
                src={currentScene.imageUrl}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, scale: { duration: currentScene.duration || 5, ease: "linear" } }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-transparent to-stone-900/40" />

            <div className="absolute top-8 left-6 right-6 flex justify-between items-center text-white/90 text-sm font-medium">
              <span className="bg-black/20 px-3 py-1 organic-shape-2 backdrop-blur-sm">{today}</span>
              <span className="bg-black/20 px-3 py-1 organic-shape-2 backdrop-blur-sm">{currentSceneIdx + 1} / {script.scenes.length}</span>
            </div>

            <div className="absolute bottom-16 left-8 right-8 text-center">
              <motion.p 
                key={currentSceneIdx + "-sub"}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-white text-lg font-medium drop-shadow-md leading-relaxed bg-black/20 p-4 organic-shape-3 backdrop-blur-sm border border-white/10"
              >
                {currentScene.subtitle}
              </motion.p>
            </div>

            {isEnded && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-stone-900/70 backdrop-blur-md flex flex-col items-center justify-center z-20 p-8 text-center"
              >
                <h2 className="text-3xl text-white font-bold mb-10 leading-tight">今天比昨天<br/>更好地成为自己</h2>
                <div className="flex flex-col gap-4 w-full max-w-[200px]">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowShareModal(true)} 
                    className="flex items-center justify-center gap-2 w-full py-4 bg-blue-400/90 hover:bg-blue-500/90 text-white organic-button transition-colors shadow-lg shadow-blue-400/30 border border-white/20"
                  >
                    <Share2 size={20} /> 分享日常
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setHasStarted(false); setCurrentSceneIdx(0); }} 
                    className="flex items-center justify-center gap-2 w-full py-4 bg-white/20 hover:bg-white/30 text-white organic-button transition-colors border border-white/30"
                  >
                    <RotateCcw size={20} /> 重播
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onRestart} 
                    className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-orange-300 to-orange-400 text-white organic-button transition-colors shadow-lg shadow-orange-400/30"
                  >
                    新的一天
                  </motion.button>
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {showShareModal && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-stone-900/80 backdrop-blur-lg flex flex-col items-center justify-center z-30 p-8 text-center"
                >
                  <button 
                    onClick={() => setShowShareModal(false)}
                    className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
                  >
                    <X size={28} />
                  </button>
                  
                  <h3 className="text-2xl text-white font-bold mb-10">分享到</h3>
                  
                  <div className="flex gap-6 mb-12">
                    <motion.button 
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePlatformShare('抖音')} 
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="w-16 h-16 bg-stone-900 organic-shape-2 flex items-center justify-center text-white text-2xl font-bold border-2 border-white/20 shadow-xl">
                        音
                      </div>
                      <span className="text-white/80 text-sm font-medium">抖音</span>
                    </motion.button>

                    <motion.button 
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePlatformShare('小红书')} 
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="w-16 h-16 bg-[#ff2442] organic-shape-1 flex items-center justify-center text-white text-2xl font-bold border-2 border-white/20 shadow-xl shadow-[#ff2442]/30">
                        红
                      </div>
                      <span className="text-white/80 text-sm font-medium">小红书</span>
                    </motion.button>

                    <motion.button 
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handlePlatformShare('朋友圈')} 
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="w-16 h-16 bg-[#07c160] organic-shape-3 flex items-center justify-center text-white text-2xl font-bold border-2 border-white/20 shadow-xl shadow-[#07c160]/30">
                        微
                      </div>
                      <span className="text-white/80 text-sm font-medium">朋友圈</span>
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {shareMessage && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute bottom-12 px-6 py-3 bg-white text-stone-800 font-bold rounded-full shadow-xl"
                      >
                        {shareMessage}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </div>
  );
}

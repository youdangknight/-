import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookHeart } from 'lucide-react';
import Onboarding from './components/Onboarding';
import JournalInput from './components/JournalInput';
import Generating from './components/Generating';
import VlogPlayer from './components/VlogPlayer';
import HistoryView from './components/HistoryView';
import { UserData, VlogScript, HistoryEntry } from './types';

export default function App() {
  const [step, setStep] = useState<'onboarding' | 'journal' | 'generating' | 'result' | 'history'>('onboarding');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [gratitudes, setGratitudes] = useState<string[]>([]);
  const [vlogScript, setVlogScript] = useState<VlogScript | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('vlog_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setStep('journal');
  };

  const handleJournalSubmit = (data: string[]) => {
    setGratitudes(data);
    setStep('generating');
  };

  const handleGenerationComplete = (script: VlogScript) => {
    setVlogScript(script);
    setStep('result');
    
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'),
      gratitudes: gratitudes,
      script: script
    };
    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    localStorage.setItem('vlog_history', JSON.stringify(newHistory));
  };

  const handleRestart = () => {
    setGratitudes([]);
    setVlogScript(null);
    setStep('journal');
  };

  return (
    <div className="min-h-screen bg-organic-mixed font-sans selection:bg-orange-200 relative overflow-hidden">
      {/* Decorative organic shapes in background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-100/40 organic-shape-1 blur-3xl -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-orange-100/40 organic-shape-2 blur-3xl -z-10"></div>
      <div className="absolute top-[30%] right-[10%] w-[30vw] h-[30vw] bg-green-50/40 organic-shape-3 blur-3xl -z-10"></div>

      <header className="pt-12 pb-8 px-6 relative z-10 flex justify-center items-center">
        {step !== 'onboarding' && step !== 'history' && (
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setStep('history')}
            className="absolute left-6 top-10 p-3 bg-white/60 backdrop-blur-md organic-shape-2 text-stone-600 hover:text-orange-500 hover:bg-white transition-all shadow-sm border border-white/40 flex items-center gap-2"
          >
            <BookHeart size={24} />
            <span className="text-sm font-bold hidden sm:inline">日记本</span>
          </motion.button>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center"
        >
          <div className="inline-block px-8 py-3 bg-white/60 backdrop-blur-md organic-shape-1 shadow-sm border border-white/40">
            <h1 className="text-3xl font-bold text-stone-700 tracking-wide">治愈日记 Vlog</h1>
          </div>
        </motion.div>
      </header>

      <main className="container mx-auto px-4 pb-20 relative z-10">
        {step === 'onboarding' && <Onboarding onComplete={handleOnboardingComplete} />}
        {step === 'journal' && <JournalInput onSubmit={handleJournalSubmit} />}
        {step === 'generating' && userData && <Generating gratitudes={gratitudes} userData={userData} onComplete={handleGenerationComplete} />}
        {step === 'result' && vlogScript && <VlogPlayer script={vlogScript} onRestart={handleRestart} />}
        {step === 'history' && (
          <HistoryView 
            history={history} 
            onPlay={(entry) => {
              setVlogScript(entry.script);
              setStep('result');
            }} 
            onBack={() => setStep(userData ? 'journal' : 'onboarding')} 
          />
        )}
      </main>
    </div>
  );
}

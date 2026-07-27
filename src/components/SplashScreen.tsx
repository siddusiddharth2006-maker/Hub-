'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Sparkles, ChevronRight } from 'lucide-react';
import { sounds } from '@/lib/audio';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Steam particle canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      speedY: number;
      speedX: number;
      opacity: number;
    }

    const particles: Particle[] = [];
    const colors = ['#FF6B00', '#FFD54F', 'rgba(255,255,255,0.4)', 'rgba(255,107,0,0.3)'];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 200,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 1.5 + 0.8,
        speedX: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.7 + 0.3
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FF6B00';
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Progress timer
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 300);
          return 100;
        }
        return prev + 5;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    sounds.playPop();
    onComplete();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#050505] p-6 text-white overflow-hidden select-none"
      >
        {/* Steam Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#FF6B00]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[250px] h-[250px] bg-[#FFD54F]/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Skip button */}
        <div className="w-full flex justify-end z-10 pt-4">
          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full glass-pill text-xs font-medium text-white/80 hover:text-white hover:border-[#FF6B00]/40 transition-all"
          >
            Skip Intro
            <ChevronRight className="w-3.5 h-3.5 text-[#FF6B00]" />
          </button>
        </div>

        {/* Main Logo Content */}
        <div className="flex flex-col items-center justify-center text-center z-10 my-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative mb-6"
          >
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#181824] via-[#242436] to-[#0A0A0F] border border-[#FF6B00]/30 flex items-center justify-center shadow-2xl shadow-[#FF6B00]/30 relative group">
              <Coffee className="w-12 h-12 text-[#FF6B00] animate-pulse" />
              <Sparkles className="w-5 h-5 text-[#FFD54F] absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl font-extrabold tracking-tight text-white mb-2"
          >
            HUB HOUSE <span className="text-gradient-orange">CAFE</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-sm text-white/60 tracking-wider font-light uppercase"
          >
            Premium Smart Dining Experience
          </motion.p>
        </div>

        {/* Progress Bar & Loader */}
        <div className="w-full max-w-xs z-10 mb-8 space-y-3">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5 backdrop-blur-md">
            <motion.div
              className="h-full bg-gradient-orange rounded-full shadow-[0_0_12px_#FF6B00]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-white/40 tracking-widest uppercase">
            <span>Loading Menu...</span>
            <span className="font-mono text-[#FFD54F] font-bold">{progress}%</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

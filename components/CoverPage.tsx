import React from 'react';

interface CoverPageProps {
  onStart: () => void;
}

export const CoverPage: React.FC<CoverPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-red-950 via-red-900 to-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-white/5 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-bingo-gold/10 blur-3xl animate-bounce-slow"></div>
        
        {/* Floating Numbers (Simulated) */}
        <div className="absolute top-1/4 left-1/4 text-white/5 text-6xl font-black rotate-12 select-none">B</div>
        <div className="absolute bottom-1/3 right-1/4 text-white/5 text-8xl font-black -rotate-12 select-none">75</div>
        <div className="absolute top-1/3 right-10 text-white/5 text-4xl font-black rotate-45 select-none">★</div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-8 animate-in zoom-in-50 duration-500 fade-in">
        
        {/* Main Title Group */}
        <div className="space-y-2">
          <h1 className="text-7xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-bingo-gold via-yellow-200 to-yellow-600 drop-shadow-2xl tracking-tighter animate-pop">
            BINGO
          </h1>
          <div className="h-1 w-24 sm:w-48 bg-gradient-to-r from-transparent via-bingo-gold to-transparent mx-auto rounded-full opacity-80"></div>
          <p className="text-white/90 text-xl sm:text-3xl font-light tracking-widest uppercase mt-4 font-serif italic text-shadow-sm">
            Fun never stop
          </p>
        </div>

        {/* Start Button */}
        <div className="pt-8">
          <button
            onClick={onStart}
            className="group relative px-8 py-4 sm:px-12 sm:py-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full font-bold text-xl sm:text-2xl shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(220,38,38,0.7)] active:scale-95 border-2 border-white/20"
          >
            <span className="relative z-10 flex items-center gap-3">
              Let's Start
              <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>

        {/* Footer Branding */}
        <div className="mt-12 opacity-50">
           <p className="text-white/40 text-[10px] sm:text-xs font-serif tracking-[0.2em] uppercase">
            Allan Drinking Game Series
          </p>
        </div>
      </div>
    </div>
  );
};
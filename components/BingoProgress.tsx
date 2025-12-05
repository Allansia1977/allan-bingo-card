import React from 'react';

interface BingoProgressProps {
  completedLines: number;
}

const LETTERS = ['B', 'I', 'N', 'G', 'O'];

export const BingoProgress: React.FC<BingoProgressProps> = ({ completedLines }) => {
  // Cap at 5 for display purposes
  const activeCount = Math.min(completedLines, 5);

  return (
    <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-8">
      {LETTERS.map((letter, index) => {
        const isActive = index < activeCount;
        return (
          <div
            key={letter}
            className={`
              w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center
              text-2xl sm:text-4xl font-black shadow-lg transition-all duration-500
              ${isActive 
                ? 'bg-bingo-red text-white scale-110 shadow-red-500/50 animate-pop border-4 border-white' 
                : 'bg-slate-800 text-slate-600 scale-100 border-4 border-slate-700'}
            `}
          >
            {letter}
          </div>
        );
      })}
    </div>
  );
};

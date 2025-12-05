import React from 'react';
import { BingoCell } from '../types';

export type WinningPattern = 'row' | 'col' | 'diag-tl' | 'diag-tr';

interface BingoCellDisplayProps {
  cell: BingoCell;
  onToggle: (id: number) => void;
  disabled: boolean;
  winningPatterns: WinningPattern[];
}

export const BingoCellDisplay: React.FC<BingoCellDisplayProps> = ({ 
  cell, 
  onToggle, 
  disabled,
  winningPatterns = []
}) => {
  const isFree = cell.isFree;
  const isMarked = cell.isMarked;

  return (
    <button
      onClick={() => !disabled && onToggle(cell.id)}
      disabled={disabled}
      className={`
        relative aspect-square w-full
        flex items-center justify-center
        text-xl sm:text-2xl md:text-3xl font-bold rounded-lg shadow-md
        transition-transform duration-200 transform hover:scale-[1.02] active:scale-95
        ${isFree 
          ? 'bg-bingo-gold text-slate-900 border-4 border-yellow-600' 
          : 'bg-white text-slate-800 border-2 border-slate-200'}
        ${disabled ? 'cursor-default opacity-90' : 'cursor-pointer'}
        overflow-visible
      `}
      aria-label={isFree ? "Free Space" : `Number ${cell.value}`}
    >
      {/* Background/Base Layer is the button itself (z-0 effectively) */}

      {/* Red Cross Overlay - z-10 (Behind text, above background) */}
      {isMarked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none animate-stamp">
          <svg viewBox="0 0 100 100" className="w-[80%] h-[80%] drop-shadow-lg opacity-90">
            <path
              d="M 20 20 L 80 80 M 80 20 L 20 80"
              stroke="#ef4444" // Tailwind red-500
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      )}

      {/* Winning Lines Layer - z-15 (Behind text, above cross) */}
      {winningPatterns.length > 0 && (
        <>
          {winningPatterns.includes('row') && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-1.5 sm:h-2 bg-red-600 rounded-full z-15 pointer-events-none shadow-sm" />
          )}
          {winningPatterns.includes('col') && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[120%] w-1.5 sm:w-2 bg-red-600 rounded-full z-15 pointer-events-none shadow-sm" />
          )}
          {winningPatterns.includes('diag-tl') && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-1.5 sm:h-2 bg-red-600 rounded-full z-15 pointer-events-none shadow-sm rotate-45" />
          )}
          {winningPatterns.includes('diag-tr') && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-1.5 sm:h-2 bg-red-600 rounded-full z-15 pointer-events-none shadow-sm -rotate-45" />
          )}
        </>
      )}

      {/* Cell Content - z-20 (Topmost) */}
      <span className={`z-20 relative ${isMarked && !isFree ? 'opacity-100' : 'opacity-100'}`}>
        {isFree ? (
          <div className="flex flex-col items-center leading-none z-30 relative">
            <span className="text-[10px] sm:text-xs font-black tracking-widest uppercase drop-shadow-md">Free</span>
            <span className="text-2xl sm:text-3xl drop-shadow-md">★</span>
          </div>
        ) : (
          <span className="drop-shadow-[0_2px_2px_rgba(255,255,255,0.9)]">
            {cell.value}
          </span>
        )}
      </span>
    </button>
  );
};
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { generateGrid, calculateCompletedLines, playBingoSound, getIndicesForLine } from './utils/bingoUtils';
import { Grid, WinningLineInfo } from './types';
import { BingoCellDisplay, WinningPattern } from './components/BingoCellDisplay';
import { BingoProgress } from './components/BingoProgress';
import { CoverPage } from './components/CoverPage';

const App: React.FC = () => {
  // State
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [grid, setGrid] = useState<Grid>([]);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [hasPlayedSound, setHasPlayedSound] = useState<boolean>(false);
  
  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Derived State
  // Calculate lines on every render based on current grid
  const { count: completedLines, lines: winningLines } = useMemo(() => {
    if (grid.length === 0) return { count: 0, lines: [] };
    return calculateCompletedLines(grid);
  }, [grid]);

  const won = completedLines >= 5;

  // Effects
  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (showPasswordModal && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showPasswordModal]);

  // Play sound when winning condition is met
  useEffect(() => {
    if (won && !hasPlayedSound) {
      playBingoSound();
      setHasPlayedSound(true);
    } else if (!won && hasPlayedSound) {
      // Allow sound to play again if user unmarks and wins again
      setHasPlayedSound(false);
    }
  }, [won, hasPlayedSound]);

  const startNewGame = useCallback(() => {
    const newGrid = generateGrid();
    setGrid(newGrid);
    setHasPlayedSound(false);
    setIsInitializing(false);
  }, []);

  // Handle clicking a cell
  const handleToggleCell = (id: number) => {
    setGrid(prevGrid => {
      return prevGrid.map(cell => {
        if (cell.id === id) {
          // You cannot unmark the FREE space, but you can toggle others
          if (cell.isFree) return cell;
          return { ...cell, isMarked: !cell.isMarked };
        }
        return cell;
      });
    });
  };

  const getLineDescription = (line: WinningLineInfo) => {
    if (line.type === 'row') return `Row ${line.index + 1}`;
    if (line.type === 'col') return `Col ${line.index + 1}`;
    return line.index === 0 ? 'Diag ↘' : 'Diag ↙';
  };

  const getWinningPatternsForCell = (cellId: number): WinningPattern[] => {
    const patterns: WinningPattern[] = [];
    winningLines.forEach(line => {
      const indices = getIndicesForLine(line.type, line.index);
      if (indices.includes(cellId)) {
        if (line.type === 'row') patterns.push('row');
        if (line.type === 'col') patterns.push('col');
        if (line.type === 'diag') {
           patterns.push(line.index === 0 ? 'diag-tl' : 'diag-tr');
        }
      }
    });
    return patterns;
  };

  const handleResetClick = () => {
    setShowPasswordModal(true);
    setPasswordInput('');
    setPasswordError(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '2412') {
      startNewGame();
      setShowPasswordModal(false);
    } else {
      setPasswordError(true);
      setPasswordInput('');
      setTimeout(() => setPasswordError(false), 1000);
    }
  };

  if (!hasStarted) {
    return <CoverPage onStart={() => setHasStarted(true)} />;
  }

  if (isInitializing) {
    return <div className="min-h-[100dvh] flex items-center justify-center text-white bg-red-950">Loading...</div>;
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-red-950 via-red-900 to-slate-950 py-6 px-3 sm:py-8 sm:px-4 font-sans selection:bg-yellow-500 selection:text-red-900 relative">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <header className="mb-6 sm:mb-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-bingo-gold via-yellow-200 to-bingo-gold drop-shadow-sm tracking-tight mb-2">
            BINGO
          </h1>
          <p className="text-red-200/80 text-sm sm:text-base max-w-md mx-auto font-medium">
            Complete 5 lines to win!
          </p>
          <p className="text-white/40 text-[10px] sm:text-xs mt-3 font-serif tracking-[0.2em] uppercase border-t border-white/10 pt-3 inline-block px-4">
            Allan Drinking Game Series
          </p>
        </header>

        {/* Progress Indicators */}
        <BingoProgress completedLines={completedLines} />

        {/* Main Grid Container */}
        <div className="relative w-full">
          <div className="bg-black/40 p-3 sm:p-6 rounded-2xl shadow-2xl border border-white/10 w-full backdrop-blur-md relative overflow-hidden">
            
            {/* Grid */}
            <div className="grid grid-cols-5 gap-2 sm:gap-3 md:gap-4 aspect-square relative z-10">
              {grid.map((cell) => (
                <BingoCellDisplay
                  key={cell.id}
                  cell={cell}
                  onToggle={handleToggleCell}
                  disabled={false} // Always enabled to allow corrections
                  winningPatterns={getWinningPatternsForCell(cell.id)}
                />
              ))}
            </div>

          </div>
        </div>

        {/* Win State / Controls */}
        <div className="mt-8 w-full flex flex-col items-center">
           {won ? (
             <div className="w-full bg-black/40 border-2 border-bingo-gold/50 rounded-xl p-4 sm:p-6 backdrop-blur-md animate-in slide-in-from-bottom-4 fade-in">
               <div className="text-center mb-6">
                  <h2 className="text-4xl font-black text-bingo-gold mb-2 drop-shadow-md animate-bounce-slow">BINGO!</h2>
                  <p className="text-red-200">You've mastered the grid. Verify your lines below:</p>
               </div>

               <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                 {winningLines.map((line, idx) => (
                   <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-red-950/50 p-3 rounded-lg border border-red-500/20">
                      <span className="text-bingo-gold font-bold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-0 w-20 shrink-0">{getLineDescription(line)}</span>
                      <div className="flex gap-2 flex-wrap justify-end">
                        {getIndicesForLine(line.type, line.index).map((cellIndex) => {
                           const val = grid[cellIndex].value;
                           return (
                             <div key={cellIndex} className="w-8 h-8 flex items-center justify-center bg-white text-slate-900 rounded-full font-bold text-sm shadow-sm ring-2 ring-red-500/20">
                               {val === 'FREE' ? '★' : val}
                             </div>
                           );
                        })}
                      </div>
                   </div>
                 ))}
               </div>

               <button
                 onClick={handleResetClick}
                 className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
               >
                 <span>Play Again</span>
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/><path d="M3 3v9h9"/></svg>
               </button>
             </div>
           ) : (
             <button
               onClick={handleResetClick}
               className="group flex items-center space-x-2 px-6 py-3 bg-red-900/50 hover:bg-red-800 text-red-100 rounded-full font-semibold transition-all hover:ring-2 hover:ring-bingo-gold/50 border border-red-800"
             >
               <svg className="w-5 h-5 transition-transform group-hover:-rotate-180" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/><path d="M3 3v9h9"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 12"/><path d="M21 21v-9h-9"/></svg>
               <span>Reset Board</span>
             </button>
           )}
        </div>

        <div className="mt-8 mb-4 text-red-200/40 text-xs text-center">
          <p>Tap numbers to mark them. Tap again to unmark.</p>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setShowPasswordModal(false)} />
          <div className="bg-red-950 border-2 border-bingo-gold rounded-2xl p-6 w-full max-w-sm relative z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-bingo-gold text-center mb-4">Admin Verification</h3>
            <p className="text-red-200 text-center mb-6 text-sm">Enter password to reset the game.</p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="tel"
                  maxLength={4}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value.replace(/[^0-9]/g, ''))}
                  className={`w-full bg-black/40 border-2 rounded-xl py-3 px-4 text-center text-2xl tracking-[0.5em] font-mono text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-bingo-gold/50 transition-colors ${passwordError ? 'border-red-500 animate-pulse' : 'border-white/10'}`}
                  placeholder="••••"
                  autoComplete="off"
                />
              </div>
              
              {passwordError && (
                <p className="text-red-500 text-xs text-center font-bold animate-bounce">Incorrect Password!</p>
              )}

              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="py-3 px-4 bg-transparent border border-white/20 hover:bg-white/5 text-white/70 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-3 px-4 bg-bingo-gold hover:bg-yellow-400 text-red-950 rounded-lg font-bold shadow-lg transition-transform active:scale-95"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
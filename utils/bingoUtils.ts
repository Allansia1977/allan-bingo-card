import { Grid, WinningLineInfo, BingoCell } from '../types';

export const GRID_SIZE = 5;
export const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
export const MAX_NUMBER = 75;

// Generate a new shuffled grid
export const generateGrid = (): Grid => {
  // Create pool of numbers 1-75
  const numbers = Array.from({ length: MAX_NUMBER }, (_, i) => i + 1);
  
  // Shuffle numbers (Fisher-Yates)
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  // Take the first 25 numbers
  const selectedNumbers = numbers.slice(0, TOTAL_CELLS);
  
  // Fixed index for the "FREE" space (Center of 5x5 is index 12)
  const freeSpaceIndex = Math.floor(TOTAL_CELLS / 2);

  // Map to Grid cells
  return selectedNumbers.map((num, index) => {
    const isFree = index === freeSpaceIndex;
    return {
      id: index,
      value: isFree ? 'FREE' : num,
      isMarked: isFree, // Free space starts marked
      isFree: isFree
    };
  });
};

export const getIndicesForLine = (type: WinningLineInfo['type'], index: number): number[] => {
  const indices: number[] = [];
  if (type === 'row') {
    for (let col = 0; col < GRID_SIZE; col++) {
      indices.push(index * GRID_SIZE + col);
    }
  } else if (type === 'col') {
    for (let row = 0; row < GRID_SIZE; row++) {
      indices.push(row * GRID_SIZE + index);
    }
  } else if (type === 'diag') {
    if (index === 0) {
      // Top-left to bottom-right
      for (let i = 0; i < GRID_SIZE; i++) indices.push(i * GRID_SIZE + i);
    } else {
      // Top-right to bottom-left
      for (let i = 0; i < GRID_SIZE; i++) indices.push(i * GRID_SIZE + (GRID_SIZE - 1 - i));
    }
  }
  return indices;
};

// Check grid for winning lines
export const calculateCompletedLines = (grid: Grid): { count: number, lines: WinningLineInfo[] } => {
  const winningLines: WinningLineInfo[] = [];

  const checkLine = (type: WinningLineInfo['type'], index: number) => {
    const indices = getIndicesForLine(type, index);
    const isComplete = indices.every(i => grid[i].isMarked);
    if (isComplete) {
      winningLines.push({ type, index });
    }
  };

  // 1. Check Rows
  for (let row = 0; row < GRID_SIZE; row++) {
    checkLine('row', row);
  }

  // 2. Check Columns
  for (let col = 0; col < GRID_SIZE; col++) {
    checkLine('col', col);
  }

  // 3. Check Diagonals
  checkLine('diag', 0);
  checkLine('diag', 1);

  return { count: winningLines.length, lines: winningLines };
};

export const playBingoSound = () => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech to ensure the new message plays immediately
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance("Bingo! You won!");
    utterance.rate = 1.2;
    utterance.pitch = 1.2;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }
};
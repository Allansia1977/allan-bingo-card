export interface BingoCell {
  id: number;
  value: number | 'FREE';
  isMarked: boolean;
  isFree: boolean;
}

export type Grid = BingoCell[];

export type LineType = 'row' | 'col' | 'diag';

export interface WinningLineInfo {
  type: LineType;
  index: number; // 0-4 for row/col, 0 for TL-BR diag, 1 for TR-BL diag
}

export interface GameState {
  grid: Grid;
  completedLines: number;
  winningLines: WinningLineInfo[];
  hasWon: boolean;
}
// Darts game logic - scoring rules, bust detection, validation

export type GameMode = 301 | 501;

export interface PlayerProfile {
  id: string;
  name: string;
  gamesPlayed: number;
  gamesWon: number;
}

export interface PlayerScore {
  playerId: string;
  name: string;
  score: number;
  startingScore: number;
}

export interface ThrowEntry {
  value: number;
  isDouble: boolean;
}

export interface TurnRecord {
  playerId: string;
  playerName: string;
  round: number;
  throws: number[];
  total: number;
  timestamp: string;
  wasBust: boolean;
  lastThrowIsDouble?: boolean;
}

export interface GameSnapshot {
  scores: number[];
  currentPlayerIndex: number;
  round: number;
  currentThrow: number; // 1-3
  currentThrows: number[];
  currentThrowsIsDouble: boolean[];
}

export interface CompletedGame {
  id: string;
  date: string;
  mode: GameMode;
  players: { id: string; name: string; score: number }[];
  winnerId: string | null;
  winnerName: string | null;
}

// Maximum possible score from 3 darts (triple 20 x 3 = 180)
export const MAX_TURN_SCORE = 180;
export const THROWS_PER_TURN = 3;

/**
 * Validates a single throw value.
 * Returns an error message key or null if valid.
 */
export function validateSingleThrow(value: number): string | null {
  if (value < 0) return 'negativeScore';
  if (value > 60) return 'scoreTooHigh'; // triple 20 = 60 max single dart
  return null;
}

/**
 * Validates the total of three throws.
 * Returns an error message key or null if valid.
 */
export function validateTurnTotal(throws: number[]): string | null {
  const total = throws.reduce((sum, t) => sum + t, 0);
  if (total > MAX_TURN_SCORE) return 'maxTurnScore';
  return null;
}

/**
 * Checks if a score reduction results in a bust.
 * A bust occurs when the remaining score goes below 0.
 * The player must reach exactly 0 to win.
 */
export function checkBust(currentScore: number, turnTotal: number): boolean {
  return currentScore - turnTotal < 0;
}

/**
 * Checks if a score can be finished with a double-out.
 * Score 1 is impossible because the smallest double is D1 = 2.
 * Scores 2-50 are possible with appropriate doubles, or Bullseye (50).
 */
export function isDoubleOutPossible(score: number): boolean {
  if (score < 0) return false;
  if (score === 0) return true;
  if (score === 1) return false; // Can't double-out from 1
  // Score 2-40 can be done with D1-D20
  // Score 50 can be done with Bullseye
  // Even scores 2-40, 42, 44, 46, 48 are doubles (2x each number 1-24)
  // Bullseye = 50
  return score <= 50 || score % 2 === 0;
}

/**
 * Checks if remaining score after throws is valid for double-out mode.
 * Returns true if the remaining score would be impossible to finish.
 */
export function checkDoubleOutBust(currentScore: number, turnTotal: number): boolean {
  const remaining = currentScore - turnTotal;
  if (remaining < 0) return true; // Normal bust
  if (remaining === 0) return false; // Win condition checked separately
  if (remaining === 1) return true; // Can't double-out from 1
  return false;
}

/**
 * Checks if a score reduction results in exactly 0.
 * For double-out mode, pass isDoubleOnLastThrow to verify win condition.
 */
export function checkWin(currentScore: number, turnTotal: number, doubleOut: boolean = false, lastThrowIsDouble: boolean = false): boolean {
  if (currentScore - turnTotal !== 0) return false;
  if (doubleOut && !lastThrowIsDouble) return false;
  return true;
}

/**
 * Calculates the new score after a turn.
 * If bust, returns original score (no change).
 */
export function calculateNewScore(currentScore: number, turnTotal: number): number {
  if (checkBust(currentScore, turnTotal)) return currentScore;
  return currentScore - turnTotal;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}

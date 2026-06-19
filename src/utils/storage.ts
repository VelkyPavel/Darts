// LocalStorage persistence utilities

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

// Storage keys
export const STORAGE_KEYS = {
  THEME: 'darts_theme',
  LANGUAGE: 'darts_language',
  AUTO_CONFIRM: 'darts_auto_confirm',
  END_ROUND_CONFIRM: 'darts_end_round_confirm',
  DOUBLE_OUT: 'darts_double_out',
  PLAYERS: 'darts_players',
  GAME_HISTORY: 'darts_game_history',
} as const;

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

// ---- Backup / restore ----------------------------------------------------

/** Current backup format version. Bump on breaking schema changes. */
const BACKUP_VERSION = 1;

interface BackupPayload {
  version: number;
  exportedAt: string;
  data: Partial<Record<string, unknown>>;
}

/**
 * Collect every persisted key into a single object that can be downloaded as
 * a JSON file. Used for the "export" backup action.
 */
export function exportBackup(): string {
  const data: Record<string, unknown> = {};
  Object.values(STORAGE_KEYS).forEach((key) => {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      try {
        data[key] = JSON.parse(raw);
      } catch {
        data[key] = raw;
      }
    }
  });
  const payload: BackupPayload = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  };
  return JSON.stringify(payload, null, 2);
}

/** Known storage keys, used to validate the incoming backup shape. */
const KNOWN_KEYS = new Set<string>(Object.values(STORAGE_KEYS));

/**
 * Parse and validate an imported backup string, then persist every known key.
 * Returns the number of keys restored. Throws on an invalid file so the caller
 * can surface an error without mutating any data.
 */
export function importBackup(json: string): number {
  const parsed = JSON.parse(json) as Partial<BackupPayload>;
  if (
    !parsed ||
    typeof parsed !== 'object' ||
    !parsed.data ||
    typeof parsed.data !== 'object'
  ) {
    throw new Error('Invalid backup file: missing "data" object.');
  }

  let restored = 0;
  for (const [key, value] of Object.entries(parsed.data)) {
    if (!KNOWN_KEYS.has(key)) continue; // ignore unknown keys
    saveToStorage(key as (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS], value);
    restored += 1;
  }
  if (restored === 0) {
    throw new Error('Invalid backup file: no recognizable keys found.');
  }
  return restored;
}

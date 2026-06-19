import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  GameMode,
  PlayerScore,
  TurnRecord,
  GameSnapshot,
  CompletedGame,
  PlayerProfile,
  THROWS_PER_TURN,
  calculateNewScore,
  generateId,
  formatTime,
} from '../utils/gameLogic';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

type Screen = 'home' | 'setup' | 'game' | 'winner' | 'history' | 'players' | 'settings' | 'installGuide';

interface GameContextType {
  screen: Screen;
  setScreen: (s: Screen) => void;
  // Game state
  gameMode: GameMode;
  setGameMode: (m: GameMode) => void;
  players: PlayerScore[];
  currentPlayerIndex: number;
  round: number;
  currentThrow: number; // 1-3
  currentThrows: number[];
  currentThrowsIsDouble: boolean[];
  turnHistory: TurnRecord[];
  snapshots: GameSnapshot[];
  winner: PlayerScore | null;
  isBust: boolean;
  showEndRoundConfirm: boolean;
  pendingTurnTotal: number;
  // Player profiles
  playerProfiles: PlayerProfile[];
  addProfile: (name: string) => PlayerProfile | null;
  deleteProfile: (id: string) => void;
  updateProfileStats: (id: string, won: boolean) => void;
  // Game actions
  initGame: (mode: GameMode, playerNames: { id: string; name: string }[]) => void;
  enterThrow: (value: number, isDouble: boolean) => void;
  undoLastThrow: () => void;
  confirmTurn: () => void;
  cancelEndRound: () => void;
  confirmEndRound: (doubleOut: boolean) => void;
  undoTurn: () => void;
  resetGame: () => void;
  // Completed games
  completedGames: CompletedGame[];
  loadCompletedGames: () => void;
  deleteCompletedGame: (id: string) => void;
  clearAllHistory: () => void;
}

const GameContext = createContext<GameContextType>({} as GameContextType);

export function GameProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>('home');
  const [gameMode, setGameMode] = useState<GameMode>(501);
  const [players, setPlayers] = useState<PlayerScore[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [currentThrow, setCurrentThrow] = useState(1);
  const [currentThrows, setCurrentThrows] = useState<number[]>([]);
  const [currentThrowsIsDouble, setCurrentThrowsIsDouble] = useState<boolean[]>([]);
  const [turnHistory, setTurnHistory] = useState<TurnRecord[]>([]);
  const [snapshots, setSnapshots] = useState<GameSnapshot[]>([]);
  const [winner, setWinner] = useState<PlayerScore | null>(null);
  const [isBust, setIsBust] = useState(false);
  const [showEndRoundConfirm, setShowEndRoundConfirm] = useState(false);
  const [pendingTurnTotal, setPendingTurnTotal] = useState(0);
  const [playerProfiles, setPlayerProfiles] = useState<PlayerProfile[]>(() =>
    loadFromStorage(STORAGE_KEYS.PLAYERS, [])
  );
  const [completedGames, setCompletedGames] = useState<CompletedGame[]>(() =>
    loadFromStorage(STORAGE_KEYS.GAME_HISTORY, [])
  );

  const addProfile = useCallback((name: string): PlayerProfile | null => {
    const trimmed = name.trim();
    // Reject duplicate names (case-insensitive, trimmed)
    const exists = playerProfiles.some(
      (p) => p.name.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) return null;
    const profile: PlayerProfile = { id: generateId(), name: trimmed, gamesPlayed: 0, gamesWon: 0 };
    setPlayerProfiles((prev) => {
      const next = [...prev, profile];
      saveToStorage(STORAGE_KEYS.PLAYERS, next);
      return next;
    });
    return profile;
  }, [playerProfiles]);

  const deleteProfile = useCallback((id: string) => {
    setPlayerProfiles((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveToStorage(STORAGE_KEYS.PLAYERS, next);
      return next;
    });
  }, []);

  const updateProfileStats = useCallback((id: string, won: boolean) => {
    setPlayerProfiles((prev) => {
      const next = prev.map((p) =>
        p.id === id ? { ...p, gamesPlayed: p.gamesPlayed + 1, gamesWon: p.gamesWon + (won ? 1 : 0) } : p
      );
      saveToStorage(STORAGE_KEYS.PLAYERS, next);
      return next;
    });
  }, []);

  const saveCompletedGame = useCallback((game: CompletedGame) => {
    setCompletedGames((prev) => {
      const next = [game, ...prev];
      saveToStorage(STORAGE_KEYS.GAME_HISTORY, next);
      return next;
    });
  }, []);

  const loadCompletedGames = useCallback(() => {
    setCompletedGames(loadFromStorage(STORAGE_KEYS.GAME_HISTORY, []));
  }, []);

  const deleteCompletedGame = useCallback((id: string) => {
    setCompletedGames((prev) => {
      const next = prev.filter((g) => g.id !== id);
      saveToStorage(STORAGE_KEYS.GAME_HISTORY, next);
      return next;
    });
  }, []);

  const clearAllHistory = useCallback(() => {
    setCompletedGames([]);
    saveToStorage(STORAGE_KEYS.GAME_HISTORY, []);
  }, []);

  // Save a snapshot before each turn for undo support
  const pushSnapshot = useCallback(() => {
    const snap: GameSnapshot = {
      scores: players.map((p) => p.score),
      currentPlayerIndex,
      round,
      currentThrow,
      currentThrows: [...currentThrows],
      currentThrowsIsDouble: [...currentThrowsIsDouble],
    };
    setSnapshots((prev) => [...prev, snap]);
  }, [players, currentPlayerIndex, round, currentThrow, currentThrows, currentThrowsIsDouble]);

  const initGame = useCallback((mode: GameMode, playerEntries: { id: string; name: string }[]) => {
    const ps: PlayerScore[] = playerEntries.map((p) => ({
      playerId: p.id,
      name: p.name,
      score: mode,
      startingScore: mode,
    }));
    setGameMode(mode);
    setPlayers(ps);
    setCurrentPlayerIndex(0);
    setRound(1);
    setCurrentThrow(1);
    setCurrentThrows([]);
    setCurrentThrowsIsDouble([]);
    setTurnHistory([]);
    setSnapshots([]);
    setWinner(null);
    setIsBust(false);
    setShowEndRoundConfirm(false);
    setPendingTurnTotal(0);
    setScreen('game');
  }, []);

  const finishTurn = useCallback((doubleOut: boolean) => {
    const turnTotal = currentThrows.reduce((s, v) => s + v, 0);
    const currentPlayer = players[currentPlayerIndex];
    const lastThrowIsDouble = currentThrowsIsDouble[currentThrowsIsDouble.length - 1] || false;

    const remaining = currentPlayer.score - turnTotal;

    // Check bust conditions
    let busted = remaining < 0; // Normal bust (went below 0)

    if (!busted && doubleOut) {
      // In double-out mode, reaching 0 without a double is also a bust
      if (remaining === 0 && !lastThrowIsDouble) {
        busted = true; // Reached 0 with triple/single = bust in double-out
      }
      // Can't finish from 1 in double-out
      if (remaining === 1) {
        busted = true;
      }
    }

    // Win condition: reached exactly 0
    // In double-out: must be with a double
    // In single-out: any way is fine
    const won = !busted && remaining === 0;

    // Record the turn
    const record: TurnRecord = {
      playerId: currentPlayer.playerId,
      playerName: currentPlayer.name,
      round,
      throws: [...currentThrows],
      total: turnTotal,
      timestamp: formatTime(new Date()),
      wasBust: busted,
      lastThrowIsDouble,
    };
    setTurnHistory((prev) => [...prev, record]);

    if (busted) {
      setIsBust(true);
      setTimeout(() => setIsBust(false), 1500);
    }

    const newPlayers = [...players];
    if (!busted) {
      newPlayers[currentPlayerIndex] = {
        ...currentPlayer,
        score: calculateNewScore(currentPlayer.score, turnTotal),
      };
    }
    setPlayers(newPlayers);

    if (won && !busted) {
      const winningPlayer = { ...newPlayers[currentPlayerIndex] };
      setWinner(winningPlayer);

      const game: CompletedGame = {
        id: generateId(),
        date: new Date().toISOString(),
        mode: gameMode,
        players: newPlayers.map((p) => ({ id: p.playerId, name: p.name, score: p.score })),
        winnerId: currentPlayer.playerId,
        winnerName: currentPlayer.name,
      };
      saveCompletedGame(game);

      newPlayers.forEach((p) => {
        updateProfileStats(p.playerId, p.playerId === currentPlayer.playerId);
      });

      setScreen('winner');
      return;
    }

    // Move to next player
    const nextPlayerIndex = (currentPlayerIndex + 1) % newPlayers.length;
    const nextRound = nextPlayerIndex === 0 ? round + 1 : round;

    setCurrentPlayerIndex(nextPlayerIndex);
    setRound(nextRound);
    setCurrentThrow(1);
    setCurrentThrows([]);
    setCurrentThrowsIsDouble([]);
  }, [currentThrows, currentThrowsIsDouble, players, currentPlayerIndex, round, gameMode, saveCompletedGame, updateProfileStats]);

  const enterThrow = useCallback((value: number, isDouble: boolean) => {
    setCurrentThrows((prev) => [...prev, value]);
    setCurrentThrowsIsDouble((prev) => [...prev, isDouble]);
    if (currentThrow < THROWS_PER_TURN) {
      setCurrentThrow((prev) => prev + 1);
    }
  }, [currentThrow]);

  const undoLastThrow = useCallback(() => {
    if (currentThrows.length === 0) return;
    setCurrentThrows((prev) => prev.slice(0, -1));
    setCurrentThrowsIsDouble((prev) => prev.slice(0, -1));
    setCurrentThrow((prev) => Math.max(1, prev - 1));
  }, [currentThrows]);

  const confirmTurn = useCallback(() => {
    const turnTotal = currentThrows.reduce((s, v) => s + v, 0);
    pushSnapshot();
    setPendingTurnTotal(turnTotal);
    setShowEndRoundConfirm(true);
  }, [currentThrows, pushSnapshot]);

  const cancelEndRound = useCallback(() => {
    setSnapshots((prev) => prev.slice(0, -1));
    setShowEndRoundConfirm(false);
    // Revert to a re-enterable state for the last dart. A bust can be triggered
    // by the 1st or 2nd dart (immediate-bust logic), so compute the throw index
    // from the remaining throws instead of assuming the 3rd.
    setCurrentThrows((prev) => {
      const next = prev.slice(0, -1);
      setCurrentThrow(Math.max(1, Math.min(THROWS_PER_TURN, next.length + 1)));
      return next;
    });
    setCurrentThrowsIsDouble((prev) => prev.slice(0, -1));
  }, []);

  const confirmEndRound = useCallback((doubleOut: boolean) => {
    setShowEndRoundConfirm(false);
    finishTurn(doubleOut);
  }, [finishTurn]);

  const undoTurn = useCallback(() => {
    if (snapshots.length === 0) return;
    const snap = snapshots[snapshots.length - 1];
    // Restore pre-turn state (scores, player, round) from the snapshot...
    setPlayers((prev) =>
      prev.map((p, i) => ({ ...p, score: snap.scores[i] }))
    );
    setCurrentPlayerIndex(snap.currentPlayerIndex);
    setRound(snap.round);
    // ...but reset throw state so the player can re-enter the whole turn.
    // Restoring snap.currentThrows/currentThrow would leave the turn "full"
    // (keyboard hidden, no further undo possible) and lock up the game.
    setCurrentThrow(1);
    setCurrentThrows([]);
    setCurrentThrowsIsDouble([]);
    setSnapshots((prev) => prev.slice(0, -1));
    setTurnHistory((prev) => prev.slice(0, -1));
    setIsBust(false);
  }, [snapshots]);

  const resetGame = useCallback(() => {
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setRound(1);
    setCurrentThrow(1);
    setCurrentThrows([]);
    setCurrentThrowsIsDouble([]);
    setTurnHistory([]);
    setSnapshots([]);
    setWinner(null);
    setIsBust(false);
    setShowEndRoundConfirm(false);
    setPendingTurnTotal(0);
    setScreen('home');
  }, []);

  return (
    <GameContext.Provider
      value={{
        screen,
        setScreen,
        gameMode,
        setGameMode,
        players,
        currentPlayerIndex,
        round,
        currentThrow,
        currentThrows,
        currentThrowsIsDouble,
        turnHistory,
        snapshots,
        winner,
        isBust,
        showEndRoundConfirm,
        pendingTurnTotal,
        playerProfiles,
        addProfile,
        deleteProfile,
        updateProfileStats,
        initGame,
        enterThrow,
        undoLastThrow,
        confirmTurn,
        cancelEndRound,
        confirmEndRound,
        undoTurn,
        resetGame,
        completedGames,
        loadCompletedGames,
        deleteCompletedGame,
        clearAllHistory,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}

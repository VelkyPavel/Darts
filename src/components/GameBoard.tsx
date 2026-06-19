import { useRef, useEffect, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import PlayerCard from './PlayerCard';
import ScoreInput from './ScoreInput';
import TurnHistoryPanel from './TurnHistoryPanel';
import { THROWS_PER_TURN } from '../utils/gameLogic';
import Modal from './Modal';
import { Undo2, AlertTriangle } from 'lucide-react';

export default function GameBoard() {
  const game = useGame();
  const { t } = useLanguage();
  const { endRoundConfirmation, doubleOut } = useSettings();
  const {
    players,
    currentPlayerIndex,
    round,
    currentThrow,
    currentThrows,
    currentThrowsIsDouble,
    isBust,
    showEndRoundConfirm,
    pendingTurnTotal,
    enterThrow,
    undoLastThrow,
    confirmTurn,
    cancelEndRound,
    confirmEndRound,
    undoTurn,
    snapshots,
  } = game;

  const currentPlayer = players[currentPlayerIndex];
  const turnTotal = currentThrows.reduce((s, v) => s + v, 0);
  const allThrowsEntered = currentThrows.length >= THROWS_PER_TURN;

  // Calculate projected remaining score after current throws
  const projectedRemaining = useMemo(() => {
    if (!currentPlayer) return null;
    return currentPlayer.score - turnTotal;
  }, [currentPlayer, turnTotal]);

  // Check if current throws would cause a bust
  const wouldBust = useMemo(() => {
    if (!currentPlayer || projectedRemaining === null) return false;
    if (projectedRemaining < 0) return true;
    // In double-out mode, remaining 1 is also a bust
    if (doubleOut && projectedRemaining === 1) return true;
    // In double-out mode, reaching 0 without a double is a bust
    if (doubleOut && projectedRemaining === 0) {
      const lastThrowIsDouble = currentThrowsIsDouble[currentThrowsIsDouble.length - 1] || false;
      if (!lastThrowIsDouble) return true;
    }
    return false;
  }, [currentPlayer, projectedRemaining, doubleOut, currentThrowsIsDouble]);

  // Check if current throws would result in a WIN
  const wouldWin = useMemo(() => {
    if (!currentPlayer || projectedRemaining === null) return false;
    if (projectedRemaining !== 0) return false;
    // Single out: reaching 0 = win
    if (!doubleOut) return true;
    // Double out: must reach 0 with a double
    const lastThrowIsDouble = currentThrowsIsDouble[currentThrowsIsDouble.length - 1] || false;
    return lastThrowIsDouble;
  }, [currentPlayer, projectedRemaining, doubleOut, currentThrowsIsDouble]);

  // Check if projected remaining is valid for double-out
  const isDoubleOutWarning = useMemo(() => {
    if (!doubleOut || !currentPlayer || projectedRemaining === null) return false;
    if (projectedRemaining <= 0) return false;
    // Warn if remaining is odd and > 1 (harder to finish)
    return projectedRemaining > 1 && projectedRemaining % 2 !== 0;
  }, [doubleOut, currentPlayer, projectedRemaining]);

  const justEnteredRef = useRef(false);

  const handleScore = (value: number, isDouble: boolean) => {
    if (currentThrows.length >= THROWS_PER_TURN) return;
    justEnteredRef.current = true;
    enterThrow(value, isDouble);
  };

  // When a throw is entered, check for turn end conditions
  useEffect(() => {
    if (!justEnteredRef.current) return;
    justEnteredRef.current = false;

    const turnTotal = currentThrows.reduce((s, v) => s + v, 0);
    const remaining = currentPlayer ? currentPlayer.score - turnTotal : null;
    const lastThrowIsDouble = currentThrowsIsDouble[currentThrowsIsDouble.length - 1] || false;

    if (remaining === null) return;

    // Determine the outcome of the current throws.
    // A BUST ends the turn immediately, even on the 1st or 2nd dart
    // (e.g. 5 points left and the player scores 7 -> turn over).
    let outcome: 'win' | 'bust' | 'end' | null = null;
    if (remaining === 0) {
      if (!doubleOut || lastThrowIsDouble) {
        outcome = 'win';
      } else {
        outcome = 'bust'; // reached 0 without a double in double-out
      }
    } else if (remaining < 0) {
      outcome = 'bust';
    } else if (doubleOut && remaining === 1) {
      outcome = 'bust'; // can't finish from 1 in double-out
    } else if (currentThrows.length === THROWS_PER_TURN) {
      outcome = 'end';
    }

    if (!outcome) return;

    if (endRoundConfirmation) {
      confirmTurn();
    } else {
      confirmTurn();
      setTimeout(() => confirmEndRound(doubleOut), 0);
    }
  }, [currentThrows.length, endRoundConfirmation, confirmTurn, confirmEndRound, doubleOut, currentPlayer, currentThrowsIsDouble]);

  const canUndoThrow = currentThrows.length > 0 && !allThrowsEntered;
  const canUndoTurn = snapshots.length > 0;

  return (
    <div className={`flex flex-col h-full relative ${isBust ? 'animate-bust-bg' : ''}`}>
      {/* Player cards */}
      <div className="grid grid-cols-2 gap-2 mb-3 md:grid-cols-4">
        {players.map((player, i) => (
          <PlayerCard key={player.playerId} player={player} isActive={i === currentPlayerIndex} />
        ))}
      </div>

      {/* Current player info */}
      <div className="text-center mb-3">
        <p className="text-sm text-[var(--text-secondary)] mb-1">
          {t('round', { number: round })} &middot; {t('throwOf', { current: Math.min(currentThrow, THROWS_PER_TURN), total: THROWS_PER_TURN })}
          {doubleOut && <span className="ml-2 text-[var(--accent)]">(Double Out)</span>}
        </p>
        <p className="text-lg font-bold text-[var(--accent)]">{currentPlayer?.name}</p>
      </div>

      {/* Score display with live preview */}
      <div className="flex items-center justify-center gap-6 mb-4">
        {/* Current remaining */}
        <div className="text-center">
          <div className="text-xs text-[var(--text-secondary)] mb-1">{t('remaining')}</div>
          <div className="text-3xl font-black tabular-nums text-[var(--text)]">
            {currentPlayer?.score}
          </div>
        </div>

        {/* Arrow */}
        {turnTotal > 0 && (
          <div className="text-2xl text-[var(--text-secondary)]">-</div>
        )}

        {/* Projected remaining */}
        {turnTotal > 0 && projectedRemaining !== null && (
          <div className="text-center">
            <div className="text-xs text-[var(--text-secondary)] mb-1">
              {wouldWin ? 'WIN!' : wouldBust ? 'BUST!' : isDoubleOutWarning ? 'Odd' : 'After'}
            </div>
            <div className={`text-3xl font-black tabular-nums animate-score-update ${
              wouldWin ? 'text-green-500' : wouldBust ? 'text-red-500' : isDoubleOutWarning ? 'text-amber-500' : 'text-[var(--accent)]'
            }`}>
              {projectedRemaining}
            </div>
          </div>
        )}
      </div>

      {/* Throw display */}
      <div className="flex items-center justify-center gap-3 mb-3">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`flex flex-col items-center px-4 py-2 rounded-xl transition-all min-w-[70px] ${
              n === currentThrows.length + 1 && !allThrowsEntered
                ? 'bg-[var(--accent)] text-white scale-105'
                : n <= currentThrows.length
                ? 'bg-[var(--card)] border border-[var(--border)]'
                : 'bg-[var(--card)] border border-[var(--border)] opacity-40'
            }`}
          >
            <span className="text-xs opacity-70">T{n}</span>
            <span className="text-xl font-bold tabular-nums">
              {n <= currentThrows.length ? currentThrows[n - 1] : '--'}
            </span>
          </div>
        ))}
      </div>

      {/* Turn total */}
      <div className="text-center mb-3">
        <span className="text-sm text-[var(--text-secondary)]">{t('turnTotal')}: </span>
        <span className={`text-2xl font-bold tabular-nums ${isBust || wouldBust ? 'text-red-500' : 'text-[var(--text)]'}`}>
          {turnTotal}
        </span>
      </div>

      {/* Score input (only when throws remaining) */}
      {!allThrowsEntered && !showEndRoundConfirm && (
        <ScoreInput onScore={handleScore} />
      )}

      {/* Action buttons row */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {canUndoThrow && (
          <button
            onClick={undoLastThrow}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--text-secondary)] active:scale-95 transition-all min-h-[44px]"
          >
            <Undo2 size={14} /> Undo throw
          </button>
        )}
        {canUndoTurn && (
          <button
            onClick={undoTurn}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--text-secondary)] active:scale-95 transition-all min-h-[44px]"
          >
            <Undo2 size={14} /> {t('undo')}
          </button>
        )}
      </div>

      {/* Bust animation overlay */}
      {isBust && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="text-6xl font-black text-red-500 animate-bust-pop drop-shadow-[0_0_30px_rgba(239,68,68,0.6)]">
            {t('bust')}
          </div>
        </div>
      )}

      {/* End round confirmation modal */}
      <Modal isOpen={showEndRoundConfirm} onClose={cancelEndRound}>
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-[var(--text)]">
            <AlertTriangle size={24} className="text-[var(--accent)]" />
            <h3 className="text-lg font-semibold">{t('endRoundQuestion')}</h3>
          </div>
          <div className="text-sm text-[var(--text-secondary)]">
            {currentThrows.map((v, i) => (
              <span key={i}>
                T{i + 1}: {v}{i < 2 ? ' / ' : ''}
              </span>
            ))}
            <br />
            Total: {pendingTurnTotal} = Remaining: {currentPlayer ? currentPlayer.score - pendingTurnTotal : '--'}
          </div>
          <div className="flex gap-3">
            <button
              onClick={cancelEndRound}
              className="flex-1 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text)] font-medium active:scale-95 transition-all min-h-[44px]"
            >
              {t('cancel')}
            </button>
            <button
              onClick={() => confirmEndRound(doubleOut)}
              className="flex-1 py-3 rounded-xl bg-[var(--accent)] text-white font-bold active:scale-95 transition-all min-h-[44px]"
            >
              {t('confirm')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Turn history (mobile: shown below the board; desktop: shown in the right aside via screens/Game.tsx) */}
      <div className="md:hidden mt-4 flex-1 overflow-y-auto min-h-0 pb-4">
        <TurnHistoryPanel />
      </div>
    </div>
  );
}

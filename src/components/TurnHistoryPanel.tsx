import { useGame } from '../context/GameContext';

/**
 * Live turn history for the current game.
 *
 * Rendered at the bottom on mobile (inside GameBoard) and in a dedicated
 * right-hand aside on desktop (see screens/Game.tsx). Shares the same row
 * styling so both layouts look identical.
 */
export default function TurnHistoryPanel() {
  const { turnHistory } = useGame();

  if (turnHistory.length === 0) return null;

  return (
    <div className="h-full flex flex-col min-h-0">
      <h3 className="text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
        History
      </h3>
      <div className="space-y-1 overflow-y-auto min-h-0 pr-1">
        {turnHistory.map((turn, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs gap-2 ${
              turn.wasBust
                ? 'bg-red-500/10 border border-red-500/20'
                : 'bg-[var(--card)] border border-[var(--border)]'
            }`}
          >
            <span className="text-[var(--text)] truncate">
              R{turn.round} - {turn.playerName}
            </span>
            <span className="text-[var(--text-secondary)] shrink-0">
              {turn.throws.join(' ')} = {turn.total}
              {turn.wasBust ? ' BUST' : ''}
            </span>
            <span className="text-[var(--text-secondary)] opacity-60 shrink-0">{turn.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

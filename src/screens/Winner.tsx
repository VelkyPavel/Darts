import { Trophy, Home, RotateCcw } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';

export default function Winner() {
  const { winner, players, resetGame, gameMode, initGame } = useGame();
  const { t } = useLanguage();

  const handlePlayAgain = () => {
    if (winner) {
      const playerEntries = players.map((p) => ({ id: p.playerId, name: p.name }));
      initGame(gameMode, playerEntries);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      {/* Trophy */}
      <div className="mb-6 animate-bounce-slow">
        <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-xl shadow-yellow-500/30">
          <Trophy size={56} className="text-white" />
        </div>
      </div>

      <h1 className="text-4xl font-black text-[var(--text)] mb-2">{t('winner')}</h1>
      <p className="text-2xl font-bold text-[var(--accent)] mb-6">{winner?.name}</p>

      {/* Final scores */}
      <div className="w-full max-w-sm space-y-2 mb-8">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
          {t('finalScores')}
        </h2>
        {players.map((player) => (
          <div
            key={player.playerId}
            className={`flex items-center justify-between px-4 py-3 rounded-xl ${
              player.playerId === winner?.playerId
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--card)] border border-[var(--border)]'
            }`}
          >
            <span className="font-medium">{player.name}</span>
            <span className="text-xl font-bold tabular-nums">{player.score}</span>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={handlePlayAgain}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[var(--accent)] text-white font-bold text-lg shadow-lg active:scale-95 transition-all"
        >
          <RotateCcw size={20} /> {t('playAgain')}
        </button>
        <button
          onClick={resetGame}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text)] font-medium active:scale-95 transition-all"
        >
          <Home size={20} /> {t('menu')}
        </button>
      </div>
    </div>
  );
}

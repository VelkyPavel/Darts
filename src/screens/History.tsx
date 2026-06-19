import { ArrowLeft, Trophy } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { formatDate } from '../utils/gameLogic';

export default function History() {
  const { setScreen, completedGames } = useGame();
  const { t } = useLanguage();

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setScreen('home')}
          className="md:hidden p-2 rounded-lg hover:bg-[var(--hover)] text-[var(--text)] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-[var(--text)]">{t('gameHistory')}</h1>
      </div>

      {completedGames.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--text-secondary)]">{t('noGames')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {completedGames.map((game) => (
            <div
              key={game.id}
              className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-secondary)]">{formatDate(game.date)}</span>
                <span className="text-sm font-bold text-[var(--accent)]">{game.mode}</span>
              </div>
              {game.winnerName && (
                <div className="flex items-center gap-2 text-[var(--text)]">
                  <Trophy size={16} className="text-yellow-500" />
                  <span className="font-semibold">{game.winnerName}</span>
                </div>
              )}
              <div className="space-y-1">
                {game.players.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text)]">{p.name}</span>
                    <span className="text-[var(--text-secondary)] tabular-nums">{p.score}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

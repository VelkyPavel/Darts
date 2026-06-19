import { useState } from 'react';
import { ArrowLeft, Trophy, Trash2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { formatDate } from '../utils/gameLogic';
import Modal from '../components/Modal';

export default function History() {
  const { setScreen, completedGames, deleteCompletedGame, clearAllHistory } = useGame();
  const { t } = useLanguage();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [clearAll, setClearAll] = useState(false);

  const handleDelete = () => {
    if (deleteId) {
      deleteCompletedGame(deleteId);
      setDeleteId(null);
    }
  };

  const handleClearAll = () => {
    clearAllHistory();
    setClearAll(false);
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('home')}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--hover)] text-[var(--text)] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-[var(--text)]">{t('gameHistory')}</h1>
        </div>
        {completedGames.length > 0 && (
          <button
            onClick={() => setClearAll(true)}
            className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 active:scale-95 transition-all"
            title={t('clearAll')}
          >
            <Trash2 size={20} />
          </button>
        )}
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
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-[var(--accent)] mr-2">{game.mode}</span>
                  <button
                    onClick={() => setDeleteId(game.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 active:scale-95 transition-all"
                    title={t('delete')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
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

      {/* Delete single game confirmation */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)}>
        <div className="text-center space-y-4">
          <p className="text-[var(--text)]">{t('confirmDeleteGame')}</p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text)] font-medium active:scale-95 transition-all min-h-[44px]"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold active:scale-95 transition-all min-h-[44px]"
            >
              {t('delete')}
            </button>
          </div>
        </div>
      </Modal>

      {/* Clear all confirmation */}
      <Modal isOpen={clearAll} onClose={() => setClearAll(false)}>
        <div className="text-center space-y-4">
          <p className="text-[var(--text)]">{t('confirmClearAll')}</p>
          <div className="flex gap-3">
            <button
              onClick={() => setClearAll(false)}
              className="flex-1 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text)] font-medium active:scale-95 transition-all min-h-[44px]"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleClearAll}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold active:scale-95 transition-all min-h-[44px]"
            >
              {t('clearAll')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

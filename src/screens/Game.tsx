import { X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import GameBoard from '../components/GameBoard';
import TurnHistoryPanel from '../components/TurnHistoryPanel';

export default function Game() {
  const { setScreen } = useGame();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col h-[100dvh]">
      {/* Game header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--card)] shrink-0">
        <button
          onClick={() => setScreen('home')}
          className="p-2 rounded-lg hover:bg-[var(--hover)] text-[var(--text)] transition-colors"
        >
          <X size={20} />
        </button>
        <h1 className="text-sm font-bold text-[var(--text)]">{t('appName')}</h1>
        <div className="w-8" />
      </div>

      {/* Body: main board + history aside (history is at the bottom on mobile via GameBoard) */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-3 min-w-0">
          <GameBoard />
        </div>
        <aside className="hidden md:flex md:w-80 shrink-0 flex-col border-l border-[var(--border)] bg-[var(--bg)] px-3 py-4 overflow-hidden">
          <TurnHistoryPanel />
        </aside>
      </div>
    </div>
  );
}

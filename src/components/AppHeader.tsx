import { Settings, ChevronLeft } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';

export default function AppHeader() {
  const { screen, setScreen } = useGame();
  const { t } = useLanguage();
  const showBack = screen !== 'home';

  return (
    <header className="hidden md:flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[var(--header)]">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => setScreen('home')}
            className="p-2 rounded-lg hover:bg-[var(--hover)] transition-colors text-[var(--text)]"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <h1 className="text-xl font-bold text-[var(--text)]">{t('appName')}</h1>
      </div>
      <div className="flex items-center gap-2">
        {screen !== 'settings' && (
          <button
            onClick={() => setScreen('settings')}
            className="p-2 rounded-lg hover:bg-[var(--hover)] transition-colors text-[var(--text)]"
          >
            <Settings size={20} />
          </button>
        )}
      </div>
    </header>
  );
}

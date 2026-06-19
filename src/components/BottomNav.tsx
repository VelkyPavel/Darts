import { Home, History, Users, Settings, Download } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';

const navItems = [
  { screen: 'home' as const, icon: Home, key: 'startGame' as const },
  { screen: 'history' as const, icon: History, key: 'history' as const },
  { screen: 'players' as const, icon: Users, key: 'players' as const },
  { screen: 'settings' as const, icon: Settings, key: 'settings' as const },
  { screen: 'installGuide' as const, icon: Download, key: 'installGuide' as const },
];

export default function BottomNav() {
  const { screen, setScreen } = useGame();
  const { t } = useLanguage();

  // Don't show nav during active game
  if (screen === 'game' || screen === 'winner') return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--nav)] border-t border-[var(--border)] safe-area-bottom">
      <div className="flex items-center justify-around py-1">
        {navItems.map(({ screen: navScreen, icon: Icon, key }) => {
          const active = screen === navScreen;
          return (
            <button
              key={navScreen}
              onClick={() => setScreen(navScreen)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-colors min-w-[56px] ${
                active ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] leading-tight">{t(key)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

import { Target, History, Users, Settings, Download } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { setScreen } = useGame();
  const { t } = useLanguage();

  const buttons = [
    { icon: Target, label: t('startGame'), screen: 'setup' as const, accent: true },
    { icon: History, label: t('history'), screen: 'history' as const, accent: false },
    { icon: Users, label: t('players'), screen: 'players' as const, accent: false },
    { icon: Settings, label: t('settings'), screen: 'settings' as const, accent: false },
    { icon: Download, label: t('installGuide'), screen: 'installGuide' as const, accent: false },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      {/* Logo */}
      <div className="mb-8 animate-float">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] flex items-center justify-center shadow-xl shadow-[var(--accent)]/20">
          <Target size={48} className="text-white" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-[var(--text)] mb-2">{t('appName')}</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-10">301 / 501</p>

      {/* Desktop nav buttons */}
      <div className="hidden md:grid md:grid-cols-2 gap-3 w-full max-w-md">
        {buttons.map(({ icon: Icon, label, screen, accent }) => (
          <button
            key={screen}
            onClick={() => setScreen(screen)}
            className={`flex items-center gap-3 px-5 py-4 rounded-xl font-medium transition-all active:scale-95 ${
              accent
                ? 'col-span-2 bg-[var(--accent)] text-white shadow-lg hover:shadow-xl justify-center text-lg'
                : 'bg-[var(--card)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--hover)]'
            }`}
          >
            <Icon size={accent ? 24 : 20} />
            {label}
          </button>
        ))}
      </div>

      {/* Mobile - just the start game button, rest is in bottom nav */}
      <div className="md:hidden w-full max-w-sm">
        <button
          onClick={() => setScreen('setup')}
          className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-xl bg-[var(--accent)] text-white font-bold text-lg shadow-lg active:scale-95 transition-all"
        >
          <Target size={24} />
          {t('startGame')}
        </button>
      </div>
    </div>
  );
}

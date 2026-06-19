import { ArrowLeft, Smartphone, Monitor, Apple } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';

export default function InstallGuide() {
  const { setScreen } = useGame();
  const { t } = useLanguage();

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setScreen('home')}
          className="md:hidden p-2 rounded-lg hover:bg-[var(--hover)] text-[var(--text)] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-[var(--text)]">{t('installTitle')}</h1>
      </div>

      {/* Android */}
      <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-3">
        <div className="flex items-center gap-2 text-[var(--text)]">
          <Smartphone size={20} className="text-green-500" />
          <h2 className="font-bold">{t('androidTitle')}</h2>
        </div>
        <ol className="space-y-2 text-sm text-[var(--text-secondary)] list-decimal list-inside">
          <li>{t('androidStep1')}</li>
          <li>{t('androidStep2')}</li>
          <li>{t('androidStep3')}</li>
        </ol>
      </div>

      {/* iOS */}
      <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-3">
        <div className="flex items-center gap-2 text-[var(--text)]">
          <Apple size={20} className="text-blue-400" />
          <h2 className="font-bold">{t('iosTitle')}</h2>
        </div>
        <ol className="space-y-2 text-sm text-[var(--text-secondary)] list-decimal list-inside">
          <li>{t('iosStep1')}</li>
          <li>{t('iosStep2')}</li>
          <li>{t('iosStep3')}</li>
        </ol>
      </div>

      {/* Desktop */}
      <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-3">
        <div className="flex items-center gap-2 text-[var(--text)]">
          <Monitor size={20} className="text-[var(--accent)]" />
          <h2 className="font-bold">{t('desktopTitle')}</h2>
        </div>
        <ol className="space-y-2 text-sm text-[var(--text-secondary)] list-decimal list-inside">
          <li>{t('desktopStep1')}</li>
        </ol>
      </div>
    </div>
  );
}

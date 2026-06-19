import { ArrowLeft } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import ThemeSwitcher from '../components/ThemeSwitcher';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Settings() {
  const { setScreen } = useGame();
  const { t } = useLanguage();
  const { autoConfirm, setAutoConfirm, endRoundConfirmation, setEndRoundConfirmation, doubleOut, setDoubleOut } = useSettings();

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setScreen('home')}
          className="md:hidden p-2 rounded-lg hover:bg-[var(--hover)] text-[var(--text)] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-[var(--text)]">{t('settings')}</h1>
      </div>

      {/* Theme */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
          {t('theme')}
        </h2>
        <ThemeSwitcher />
      </div>

      {/* Language */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
          {t('language')}
        </h2>
        <LanguageSwitcher />
      </div>

      {/* Auto-confirm */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
          {t('autoConfirm')}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setAutoConfirm(true)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              autoConfirm
                ? 'bg-[var(--accent)] text-white shadow-md'
                : 'bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--hover)]'
            }`}
          >
            {t('on')}
          </button>
          <button
            onClick={() => setAutoConfirm(false)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              !autoConfirm
                ? 'bg-[var(--accent)] text-white shadow-md'
                : 'bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--hover)]'
            }`}
          >
            {t('off')}
          </button>
        </div>
      </div>

      {/* End round confirmation */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
          {t('endRoundConfirmation')}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setEndRoundConfirmation(true)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              endRoundConfirmation
                ? 'bg-[var(--accent)] text-white shadow-md'
                : 'bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--hover)]'
            }`}
          >
            {t('on')}
          </button>
          <button
            onClick={() => setEndRoundConfirmation(false)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              !endRoundConfirmation
                ? 'bg-[var(--accent)] text-white shadow-md'
                : 'bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--hover)]'
            }`}
          >
            {t('off')}
          </button>
        </div>
      </div>

      {/* Double Out */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
          {t('doubleOut')}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setDoubleOut(true)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              doubleOut
                ? 'bg-[var(--accent)] text-white shadow-md'
                : 'bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--hover)]'
            }`}
          >
            {t('on')}
          </button>
          <button
            onClick={() => setDoubleOut(false)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              !doubleOut
                ? 'bg-[var(--accent)] text-white shadow-md'
                : 'bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--hover)]'
            }`}
          >
            {t('off')}
          </button>
        </div>
      </div>
    </div>
  );
}

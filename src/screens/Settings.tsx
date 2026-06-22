import { useRef, useState } from 'react';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { exportBackup, importBackup } from '../utils/storage';
import ThemeSwitcher from '../components/ThemeSwitcher';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Settings() {
  const { setScreen } = useGame();
  const { t } = useLanguage();
  const { autoConfirm, setAutoConfirm, endRoundConfirmation, setEndRoundConfirmation, doubleOut, setDoubleOut, speechToText, setSpeechToText } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [backupMessage, setBackupMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = () => {
    const json = exportBackup();
    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `darts-backup-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setBackupMessage(null);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importBackup(String(reader.result));
        setBackupMessage({ type: 'success', text: t('importSuccess') });
        // Reload so every context re-reads from storage.
        setTimeout(() => window.location.reload(), 800);
      } catch {
        setBackupMessage({ type: 'error', text: t('importError') });
      }
    };
    reader.onerror = () => setBackupMessage({ type: 'error', text: t('importError') });
    reader.readAsText(file);
    // Reset so selecting the same file again still fires onChange.
    e.target.value = '';
  };

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

      {/* Voice input (Beta) */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider flex items-center gap-2">
          {t('speechToText')}
          <span className="text-[10px] normal-case tracking-normal rounded bg-[var(--hover)] text-[var(--text-secondary)] px-1.5 py-0.5">Beta</span>
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSpeechToText(true)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              speechToText
                ? 'bg-[var(--accent)] text-white shadow-md'
                : 'bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--hover)]'
            }`}
          >
            {t('on')}
          </button>
          <button
            onClick={() => setSpeechToText(false)}
            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              !speechToText
                ? 'bg-[var(--accent)] text-white shadow-md'
                : 'bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--hover)]'
            }`}
          >
            {t('off')}
          </button>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
          {t('speechToTextDescription')}
        </p>
      </div>

      {/* Backup & restore */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
          {t('backup')}
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">
          {t('backupDescription')}
        </p>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--accent)] text-white text-sm font-medium active:scale-95 transition-all min-h-[44px]"
          >
            <Download size={16} /> {t('exportData')}
          </button>
          <button
            onClick={handleImportClick}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--card)] text-[var(--text)] text-sm font-medium border border-[var(--border)] hover:bg-[var(--hover)] active:scale-95 transition-all min-h-[44px]"
          >
            <Upload size={16} /> {t('importData')}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleImportFile}
          className="hidden"
        />
        {backupMessage && (
          <p className={`text-sm px-1 ${backupMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
            {backupMessage.text}
          </p>
        )}
      </div>
    </div>
  );
}

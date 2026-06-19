import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { Delete, RotateCcw } from 'lucide-react';

interface NumericKeyboardProps {
  onScore: (value: number, isDouble: boolean) => void;
}

export default function NumericKeyboard({ onScore }: NumericKeyboardProps) {
  const { t } = useLanguage();
  const { autoConfirm } = useSettings();
  const [buffer, setBuffer] = useState<string>('');
  const [multiplier, setMultiplier] = useState<1 | 2 | 3>(1);
  const [activeMulti, setActiveMulti] = useState<string | null>(null);

  const updateBuffer = (digit: string) => {
    const next = buffer === '' || buffer === '0' ? digit : buffer + digit;
    const num = parseInt(next);
    if (!isNaN(num) && num <= 60) {
      setBuffer(next);
    }
  };

  const handleBackspace = () => {
    setBuffer((prev) => (prev.length > 1 ? prev.slice(0, -1) : ''));
  };

  const handleClear = () => {
    setBuffer('');
    setMultiplier(1);
    setActiveMulti(null);
  };

  const handleMultiplier = (m: 2 | 3, label: string) => {
    if (activeMulti === label) {
      setMultiplier(1);
      setActiveMulti(null);
    } else {
      setMultiplier(m);
      setActiveMulti(label);
    }
  };

  // Bull (25) is single, Bullseye (50) counts as double for double-out
  const handleSpecial = (value: number) => {
    onScore(value, value === 50);
    handleClear();
  };

  const submitScore = () => {
    if (buffer === '') return;
    const base = parseInt(buffer);
    if (isNaN(base)) return;
    const final = base * multiplier;
    onScore(final, multiplier === 2);
    handleClear();
  };

  // Handle number button click - behavior depends on autoConfirm
  const handleNumberClick = (digit: string) => {
    if (autoConfirm) {
      // Auto-confirm: immediately submit the score with current multiplier
      const base = parseInt(digit);
      if (!isNaN(base)) {
        onScore(base * multiplier, multiplier === 2);
        handleClear();
      }
    } else {
      // Manual confirm: add digit to buffer
      updateBuffer(digit);
    }
  };

  // Handle miss button
  const handleMiss = () => {
    onScore(0, false);
    handleClear();
  };

  const displayValue = buffer ? (parseInt(buffer) * multiplier).toString() : '--';

  return (
    <div className="w-full max-w-sm mx-auto space-y-2">
      {/* Display - in auto-confirm mode, show multiplier hint */}
      <div className="text-center py-2 px-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
        {autoConfirm ? (
          <span className="text-2xl font-bold text-[var(--text)]">
            {activeMulti ? `${multiplier}x` : '--'}
            {activeMulti && <span className="text-sm text-[var(--accent)]"> {t('double')}/{t('triple')}</span>}
          </span>
        ) : (
          <>
            <span className="text-3xl font-bold tabular-nums text-[var(--text)]">{displayValue}</span>
            {activeMulti && (
              <span className="ml-2 text-sm text-[var(--accent)]">
                ({multiplier}x{buffer || ' 0'})
              </span>
            )}
          </>
        )}
      </div>

      {/* Multiplier row */}
      <div className="grid grid-cols-4 gap-1.5">
        <button
          onClick={() => handleMultiplier(2, 'D')}
          className={`rounded-xl py-2.5 text-xs font-bold transition-all min-h-[44px] ${
            activeMulti === 'D' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--key-bg)] text-[var(--key-text)]'
          }`}
        >
          {t('double')}
        </button>
        <button
          onClick={() => handleMultiplier(3, 'T')}
          className={`rounded-xl py-2.5 text-xs font-bold transition-all min-h-[44px] ${
            activeMulti === 'T' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--key-bg)] text-[var(--key-text)]'
          }`}
        >
          {t('triple')}
        </button>
        <button
          onClick={() => handleSpecial(25)}
          className="rounded-xl py-2.5 text-xs font-bold bg-[var(--key-bg)] text-[var(--key-text)] active:scale-95 transition-all min-h-[44px]"
        >
          Bull 25
        </button>
        <button
          onClick={() => handleSpecial(50)}
          className="rounded-xl py-2.5 text-xs font-bold bg-[var(--key-bg)] text-[var(--key-text)] active:scale-95 transition-all min-h-[44px]"
        >
          Eye 50
        </button>
      </div>

      {/* Number grid 1-20 */}
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: 20 }, (_, i) => String(i + 1)).map((digit) => (
          <button
            key={digit}
            onClick={() => handleNumberClick(digit)}
            className="flex items-center justify-center rounded-lg text-base font-bold bg-[var(--key-bg)] text-[var(--key-text)] active:scale-95 active:bg-[var(--key-active)] transition-all min-h-[44px]"
          >
            {digit}
          </button>
        ))}
      </div>

      {/* Bottom action row */}
      <div className="grid gap-1.5" style={{ gridTemplateColumns: autoConfirm ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)' }}>
        <button
          onClick={handleMiss}
          className="rounded-xl py-2.5 text-xs font-bold bg-[var(--key-bg)] text-[var(--key-text)] active:scale-95 transition-all min-h-[44px]"
        >
          {t('miss')}
        </button>
        {!autoConfirm && (
          <button
            onClick={handleBackspace}
            className="rounded-xl py-2.5 bg-[var(--key-bg)] text-[var(--key-text)] active:scale-95 transition-all min-h-[44px] flex items-center justify-center"
          >
            <Delete size={18} />
          </button>
        )}
        <button
          onClick={handleClear}
          className="rounded-xl py-2.5 text-xs font-bold bg-[var(--key-bg)] text-[var(--key-text)] active:scale-95 transition-all min-h-[44px] flex items-center justify-center gap-1"
        >
          <RotateCcw size={14} />
          {t('clear')}
        </button>
        {!autoConfirm && (
          <button
            onClick={submitScore}
            disabled={buffer === ''}
            className="rounded-xl py-2.5 text-xs font-bold bg-[var(--accent)] text-white active:scale-95 transition-all min-h-[44px] disabled:opacity-40"
          >
            {t('confirm')}
          </button>
        )}
      </div>
    </div>
  );
}

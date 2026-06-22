import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import type { SpeechResult } from '../hooks/useSpeechRecognition';
import { parseThrow, SPEECH_LANG_CODE } from '../utils/speechThrowParser';

interface SpeechInputProps {
  onScore: (value: number, isDouble: boolean) => void;
}

/**
 * Beta voice-input button. Press & hold to record; release to parse the
 * transcript into a throw and auto-submit it through `onScore`, exactly like a
 * keyboard tap. Misrecognitions are corrected with the existing "Undo throw"
 * button in GameBoard.
 *
 * The parse is triggered directly from the Web Speech API's `onend` callback
 * (via the hook's `setOnResult`), NOT from a useEffect watching React state.
 * This is deliberate: the old effect-based approach raced with React renders and
 * could fire twice or before the final transcript arrived, which corrupted the
 * throw sequence (and downstream, the turn history — the bug this rewrite fixes).
 *
 * `setPointerCapture` is used on pointer-down so that finger scrolling or
 * slight movement while holding doesn't prematurely cut the recording on touch
 * devices.
 *
 * Only renders when the `speechToText` setting is on AND the browser exposes
 * the Web Speech API; otherwise nothing is shown.
 */
export default function SpeechInput({ onScore }: SpeechInputProps) {
  const { t, language } = useLanguage();
  const langCode = SPEECH_LANG_CODE[language] ?? 'en-US';
  const { isSupported, isListening, interim, setOnResult, start, stop } =
    useSpeechRecognition(langCode);

  // Brief inline status shown after release (success or failure).
  const [status, setStatus] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep latest onScore/language in refs so the callback handed to the hook
  // always uses the freshest values without re-registering on every render.
  const onScoreRef = useRef(onScore);
  const languageRef = useRef(language);
  useEffect(() => {
    onScoreRef.current = onScore;
    languageRef.current = language;
  });

  const flashStatus = useCallback((kind: 'ok' | 'err', text: string) => {
    setStatus({ kind, text });
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setStatus(null), 2200);
  }, []);

  // Register the single end-of-press handler. Because `setOnResult` stores the
  // callback in a ref inside the hook, changing this callback here does NOT
  // restart recognition — no race, no double-fire.
  setOnResult(useCallback((r: SpeechResult) => {
    if (r.error) {
      flashStatus('err', t(r.error as 'micDenied' | 'speechNotUnderstood'));
      return;
    }
    if (r.alternatives.length === 0) {
      flashStatus('err', t('speechNotUnderstood'));
      return;
    }
    for (const alt of r.alternatives) {
      const parsed = parseThrow(alt, languageRef.current);
      if (parsed) {
        onScoreRef.current(parsed.value, parsed.isDouble);
        flashStatus('ok', `✓ ${parsed.value}`);
        return;
      }
    }
    flashStatus('err', t('speechNotUnderstood'));
  }, [flashStatus, t]));

  // Cleanup the status timer on unmount.
  useEffect(() => {
    return () => {
      if (statusTimer.current) clearTimeout(statusTimer.current);
    };
  }, []);

  // Graceful no-op when the feature is unsupported.
  if (!isSupported) {
    return (
      <div className="w-full max-w-sm mx-auto mt-2">
        <button
          disabled
          title={t('speechUnsupported')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--text-secondary)] opacity-50 min-h-[44px]"
        >
          <MicOff size={14} />
          <span>{t('speechToText')}</span>
          <span className="text-[10px] uppercase tracking-wide rounded bg-[var(--hover)] px-1.5 py-0.5">Beta</span>
        </button>
      </div>
    );
  }

  const handleDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (isListening) return;
    // Capture the pointer so that slight finger movement while holding doesn't
    // fire a spurious pointerup/leave and cut the recording short on touch.
    e.currentTarget.setPointerCapture(e.pointerId);
    setStatus(null);
    start();
  };
  const handleUp = () => {
    if (!isListening) return;
    stop(); // recognition.onend will deliver the result via setOnResult
  };

  return (
    <div className="w-full max-w-sm mx-auto mt-2 space-y-1">
      <button
        onPointerDown={handleDown}
        onPointerUp={handleUp}
        onPointerLeave={handleUp}
        onPointerCancel={handleUp}
        onContextMenu={(e) => e.preventDefault()}
        className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] select-none ${
          isListening
            ? 'bg-[var(--accent)] text-white active:scale-95'
            : 'bg-[var(--card)] border border-[var(--border)] text-[var(--text-secondary)] active:scale-95'
        }`}
      >
        {isListening ? <Mic size={16} className="animate-pulse" /> : <Mic size={16} />}
        <span>{isListening ? t('listening') : t('speechToText')}</span>
        <span className="text-[10px] uppercase tracking-wide rounded bg-[var(--hover)] px-1.5 py-0.5">Beta</span>
      </button>

      {status && (
        <p className={`text-xs text-center ${status.kind === 'err' ? 'text-amber-500' : 'text-green-500'}`}>
          {status.text}
        </p>
      )}

      {/* Listening overlay: lightweight centered pill (no backdrop, push-to-talk) */}
      {isListening && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="mx-4 px-6 py-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-lg flex flex-col items-center gap-2 max-w-xs">
            <Mic size={28} className="text-[var(--accent)] animate-pulse" />
            <p className="text-sm font-medium text-[var(--text)]">{t('listening')}</p>
            {interim && (
              <p className="text-xs text-[var(--text-secondary)] text-center break-words">"{interim}"</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';

// ---- Ambient types for the Web Speech API ----------------------------------
// The DOM lib ships SpeechRecognition types, but `webkitSpeechRecognition` on
// the Window object is not part of the standard lib. Declare it ourselves.

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: { length: number; [index: number]: SpeechRecognitionResultLike };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
  message?: string;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

// ---------------------------------------------------------------------------

/**
 * Final outcome of one press, delivered exactly once when recognition stops.
 * `alternatives` is the full list of final transcripts (best first); `error`
 * is set when something went wrong (and `alternatives` will be empty).
 */
export interface SpeechResult {
  alternatives: string[];
  error: string | null; // 'micDenied' | 'speechNotUnderstood' | null
}

export interface SpeechRecognitionState {
  /** Whether the browser exposes a SpeechRecognition implementation. */
  isSupported: boolean;
  /** Whether we are currently capturing audio. */
  isListening: boolean;
  /** Live partial transcript shown in the UI while listening. */
  interim: string;
  /**
   * Register the single callback that fires when a press finishes (on `onend`
   * or on a fatal error). Uses a ref under the hood so changing the callback
   * never restarts the recognition instance — no race, no double-fire.
   */
  setOnResult: (cb: ((r: SpeechResult) => void) | null) => void;
  /** Begin capturing. No-op if unsupported or already listening. */
  start: () => void;
  /** Stop capturing; the registered callback will then fire once. */
  stop: () => void;
}

function resolveCtor(): SpeechRecognitionCtor | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

/**
 * Thin React wrapper around the (webkit)SpeechRecognition API.
 *
 * Results are delivered through `setOnResult` (a ref-stored callback) the moment
 * recognition ends — NOT through a useEffect watching state. This avoids the
 * React-render race where an effect watching `isListening` can fire spuriously
 * when deps change mid-press (e.g. `onScore` identity changes on every render),
 * which previously caused the parse to run twice and corrupt the throw sequence
 * (and downstream, the turn history).
 *
 * Each `start()` builds a fresh instance (some browsers refuse to restart one
 * that already fired `onend`). Final transcripts from all alternatives are
 * collected in a ref and handed to the callback on `onend`.
 */
export function useSpeechRecognition(langCode: string): SpeechRecognitionState {
  const [isSupported] = useState<boolean>(() => resolveCtor() !== undefined);
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState('');

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onResultRef = useRef<((r: SpeechResult) => void) | null>(null);
  // Final transcripts collected during the current press (all alternatives).
  const finalRef = useRef<string[]>([]);
  // The error (if any) from the current press; cleared on each start().
  const errorRef = useRef<string | null>(null);
  const langRef = useRef(langCode);

  useEffect(() => {
    langRef.current = langCode;
  }, [langCode]);

  const setOnResult = useCallback((cb: ((r: SpeechResult) => void) | null) => {
    onResultRef.current = cb;
  }, []);

  // Deliver the collected result to the registered callback exactly once.
  const deliver = useCallback(() => {
    const cb = onResultRef.current;
    if (!cb) return;
    cb({ alternatives: finalRef.current, error: errorRef.current });
  }, []);

  const create = useCallback((): SpeechRecognitionLike | null => {
    const Ctor = resolveCtor();
    if (!Ctor) return null;
    const rec = new Ctor();
    rec.lang = langRef.current;
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 3;

    rec.onstart = () => {
      setIsListening(true);
      setInterim('');
    };

    rec.onresult = (e: SpeechRecognitionEventLike) => {
      let interimText = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        const transcript = res[0]?.transcript ?? '';
        if (res.isFinal) {
          // Save every alternative for this final result.
          for (let a = 0; a < res.length; a++) {
            const alt = res[a]?.transcript;
            if (alt) finalRef.current.push(alt);
          }
          interimText = transcript;
        } else {
          interimText += transcript;
        }
      }
      if (interimText) setInterim(interimText);
    };

    rec.onerror = (e: SpeechRecognitionErrorEventLike) => {
      switch (e.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          // Needs user action (grant mic permission).
          errorRef.current = 'micDenied';
          break;
        default:
          // no-speech, network, audio-capture, aborted, etc. — all collapse to
          // a generic "didn't catch that" since recovery is the same.
          errorRef.current = 'speechNotUnderstood';
      }
    };

    rec.onend = () => {
      setIsListening(false);
      setInterim('');
      deliver();
    };

    return rec;
  }, [deliver]);

  const start = useCallback(() => {
    if (!isSupported) return;
    // Reset for a fresh press.
    finalRef.current = [];
    errorRef.current = null;
    setInterim('');
    const rec = create();
    if (!rec) return;
    recognitionRef.current = rec;
    try {
      rec.start();
    } catch {
      // start() throws if called too soon after a previous instance ended.
      errorRef.current = 'speechNotUnderstood';
      deliver();
      recognitionRef.current = null;
    }
  }, [create, deliver, isSupported]);

  const stop = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) {
      // Nothing was started; ensure the UI doesn't hang in "listening".
      setIsListening(false);
      return;
    }
    try {
      rec.stop();
    } catch {
      // Already stopped — deliver anyway so the caller isn't left hanging.
      deliver();
    }
  }, [deliver]);

  // Cleanup on unmount: abort any in-flight recognition and detach handlers.
  useEffect(() => {
    return () => {
      const rec = recognitionRef.current;
      if (rec) {
        rec.onresult = null;
        rec.onerror = null;
        rec.onend = null;
        rec.onstart = null;
        try {
          rec.abort();
        } catch {
          // Ignore
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  return { isSupported, isListening, interim, setOnResult, start, stop };
}

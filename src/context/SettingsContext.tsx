import { createContext, useContext, useState, ReactNode } from 'react';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

interface SettingsContextType {
  autoConfirm: boolean;
  setAutoConfirm: (v: boolean) => void;
  endRoundConfirmation: boolean;
  setEndRoundConfirmation: (v: boolean) => void;
  doubleOut: boolean;
  setDoubleOut: (v: boolean) => void;
  speechToText: boolean;
  setSpeechToText: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  autoConfirm: true,
  setAutoConfirm: () => {},
  endRoundConfirmation: false,
  setEndRoundConfirmation: () => {},
  doubleOut: true,
  setDoubleOut: () => {},
  speechToText: false,
  setSpeechToText: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [autoConfirm, setAutoConfirmState] = useState<boolean>(() =>
    loadFromStorage(STORAGE_KEYS.AUTO_CONFIRM, true)
  );
  const [endRoundConfirmation, setEndRoundConfirmationState] = useState<boolean>(() =>
    loadFromStorage(STORAGE_KEYS.END_ROUND_CONFIRM, false)
  );
  const [doubleOut, setDoubleOutState] = useState<boolean>(() =>
    loadFromStorage(STORAGE_KEYS.DOUBLE_OUT, true)
  );
  const [speechToText, setSpeechToTextState] = useState<boolean>(() =>
    loadFromStorage(STORAGE_KEYS.SPEECH_TO_TEXT, false)
  );

  const setAutoConfirm = (v: boolean) => {
    setAutoConfirmState(v);
    saveToStorage(STORAGE_KEYS.AUTO_CONFIRM, v);
  };

  const setEndRoundConfirmation = (v: boolean) => {
    setEndRoundConfirmationState(v);
    saveToStorage(STORAGE_KEYS.END_ROUND_CONFIRM, v);
  };

  const setDoubleOut = (v: boolean) => {
    setDoubleOutState(v);
    saveToStorage(STORAGE_KEYS.DOUBLE_OUT, v);
  };

  const setSpeechToText = (v: boolean) => {
    setSpeechToTextState(v);
    saveToStorage(STORAGE_KEYS.SPEECH_TO_TEXT, v);
  };

  return (
    <SettingsContext.Provider
      value={{
        autoConfirm,
        setAutoConfirm,
        endRoundConfirmation,
        setEndRoundConfirmation,
        doubleOut,
        setDoubleOut,
        speechToText,
        setSpeechToText,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

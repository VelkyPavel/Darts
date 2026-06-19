import { useState } from 'react';
import { ArrowLeft, Plus, X, Target } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import { GameMode } from '../utils/gameLogic';

interface SelectedPlayer {
  id: string;
  name: string;
}

export default function GameSetup() {
  const { setScreen, gameMode, setGameMode, initGame, playerProfiles, addProfile } = useGame();
  const { t } = useLanguage();
  const [selectedPlayers, setSelectedPlayers] = useState<SelectedPlayer[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [showNewPlayer, setShowNewPlayer] = useState(false);
  const [addError, setAddError] = useState(false);

  const handleAddProfile = () => {
    if (!newPlayerName.trim()) return;
    const profile = addProfile(newPlayerName.trim());
    if (!profile) {
      setAddError(true);
      return;
    }
    setSelectedPlayers((prev) => [...prev, { id: profile.id, name: profile.name }]);
    setNewPlayerName('');
    setShowNewPlayer(false);
    setAddError(false);
  };

  const togglePlayer = (id: string, name: string) => {
    if (selectedPlayers.find((p) => p.id === id)) {
      setSelectedPlayers((prev) => prev.filter((p) => p.id !== id));
    } else if (selectedPlayers.length < 4) {
      setSelectedPlayers((prev) => [...prev, { id, name }]);
    }
  };

  const handleStart = () => {
    if (selectedPlayers.length === 0) return;
    initGame(gameMode, selectedPlayers);
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setScreen('home')}
          className="p-2 rounded-lg hover:bg-[var(--hover)] text-[var(--text)] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-[var(--text)]">{t('selectMode')}</h1>
      </div>

      {/* Game mode selection */}
      <div className="grid grid-cols-2 gap-3">
        {([301, 501] as GameMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setGameMode(mode)}
            className={`flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 ${
              gameMode === mode
                ? 'bg-[var(--accent)] text-white shadow-lg'
                : 'bg-[var(--card)] border border-[var(--border)] text-[var(--text)]'
            }`}
          >
            <Target size={20} />
            {mode}
          </button>
        ))}
      </div>

      {/* Player selection */}
      <div>
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wider">
          {t('addPlayers')} ({selectedPlayers.length}/4)
        </h2>

        {/* Saved players */}
        {playerProfiles.length > 0 && (
          <div className="space-y-2 mb-3">
            {playerProfiles.map((profile) => {
              const isSelected = selectedPlayers.find((p) => p.id === profile.id);
              return (
                <button
                  key={profile.id}
                  onClick={() => togglePlayer(profile.id, profile.name)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--card)] border border-[var(--border)] text-[var(--text)]'
                  }`}
                >
                  <span>{profile.name}</span>
                  {isSelected && <X size={16} />}
                </button>
              );
            })}
          </div>
        )}

        {/* Add new player */}
        {showNewPlayer ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => {
                  setNewPlayerName(e.target.value);
                  setAddError(false);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleAddProfile()}
                placeholder={t('playerName')}
                className={`flex-1 px-4 py-3 rounded-xl bg-[var(--card)] border text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                  addError ? 'border-red-500' : 'border-[var(--border)]'
                }`}
                autoFocus
              />
              <button
                onClick={handleAddProfile}
                disabled={!newPlayerName.trim()}
                className="px-4 py-3 rounded-xl bg-[var(--accent)] text-white font-bold disabled:opacity-40 active:scale-95 transition-all"
              >
                {t('add')}
              </button>
            </div>
            {addError && (
              <p className="text-sm text-red-500 px-1">{t('playerExists')}</p>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowNewPlayer(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text-secondary)] text-sm hover:bg-[var(--hover)] transition-all"
          >
            <Plus size={16} /> {t('addNewPlayer')}
          </button>
        )}
      </div>

      {/* Start button */}
      <button
        onClick={handleStart}
        disabled={selectedPlayers.length === 0}
        className="w-full py-4 rounded-xl bg-[var(--accent)] text-white font-bold text-lg shadow-lg disabled:opacity-40 active:scale-95 transition-all"
      >
        {t('start')}
      </button>

      {selectedPlayers.length === 0 && (
        <p className="text-center text-sm text-[var(--text-secondary)]">{t('minPlayers')}</p>
      )}
    </div>
  );
}

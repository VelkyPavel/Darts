import { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useLanguage } from '../context/LanguageContext';
import Modal from '../components/Modal';

export default function Players() {
  const { setScreen, playerProfiles, addProfile, deleteProfile } = useGame();
  const { t } = useLanguage();
  const [newName, setNewName] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addProfile(newName.trim());
    setNewName('');
    setShowAdd(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteProfile(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('home')}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--hover)] text-[var(--text)] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-[var(--text)]">{t('playerManagement')}</h1>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="p-2 rounded-lg bg-[var(--accent)] text-white active:scale-95 transition-all"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Add player form */}
      {showAdd && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder={t('playerName')}
            className="flex-1 px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
            autoFocus
          />
          <button
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="px-4 py-3 rounded-xl bg-[var(--accent)] text-white font-bold disabled:opacity-40 active:scale-95 transition-all"
          >
            {t('add')}
          </button>
        </div>
      )}

      {/* Player list */}
      {playerProfiles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[var(--text-secondary)]">{t('noPlayers')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {playerProfiles.map((profile) => (
            <div
              key={profile.id}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)]"
            >
              <div>
                <p className="font-medium text-[var(--text)]">{profile.name}</p>
                <div className="flex gap-4 text-xs text-[var(--text-secondary)]">
                  <span>{t('gamesPlayed')}: {profile.gamesPlayed}</span>
                  <span>{t('gamesWon')}: {profile.gamesWon}</span>
                </div>
              </div>
              <button
                onClick={() => setDeleteId(profile.id)}
                className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 active:scale-95 transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal isOpen={deleteId !== null} onClose={() => setDeleteId(null)}>
        <div className="text-center space-y-4">
          <p className="text-[var(--text)]">{t('confirmDelete')}</p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 py-3 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text)] font-medium active:scale-95 transition-all min-h-[44px]"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold active:scale-95 transition-all min-h-[44px]"
            >
              {t('delete')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

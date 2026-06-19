import { PlayerScore } from '../utils/gameLogic';

interface PlayerCardProps {
  player: PlayerScore;
  isActive: boolean;
}

export default function PlayerCard({ player, isActive }: PlayerCardProps) {
  return (
    <div
      className={`relative rounded-xl p-4 transition-all duration-300 ${
        isActive
          ? 'ring-2 ring-[var(--accent)] bg-[var(--card-active)] scale-[1.02] shadow-lg'
          : 'bg-[var(--card)] opacity-70'
      }`}
    >
      {isActive && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-[var(--accent)]" />
      )}
      <div className="text-center">
        <p className={`text-sm font-medium truncate ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>
          {player.name}
        </p>
        <p className={`text-3xl font-bold tabular-nums ${isActive ? 'text-[var(--text)]' : 'text-[var(--text-secondary)]'}`}>
          {player.score}
        </p>
      </div>
    </div>
  );
}

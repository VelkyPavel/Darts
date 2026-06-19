import { useLanguage, Language } from '../context/LanguageContext';

const languages: { id: Language; flag: string; name: string }[] = [
  { id: 'en', flag: '🇬🇧', name: 'English' },
  { id: 'cs', flag: '🇨🇿', name: 'Čeština' },
  { id: 'sk', flag: '🇸🇰', name: 'Slovenčina' },
  { id: 'ru', flag: '🇷🇺', name: 'Русский' },
  { id: 'pl', flag: '🇵🇱', name: 'Polski' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="space-y-1">
      {languages.map(({ id, flag, name }) => (
        <button
          key={id}
          onClick={() => setLanguage(id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            language === id
              ? 'bg-[var(--accent)] text-white shadow-md'
              : 'bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--hover)]'
          }`}
        >
          <span className="text-lg">{flag}</span>
          <span>{name}</span>
        </button>
      ))}
    </div>
  );
}

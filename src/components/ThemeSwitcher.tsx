import { useTheme, Theme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const themes: { id: Theme; labelKey: 'liquidGlassLight' | 'liquidGlassDark' | 'normalLight' | 'normalDark' }[] = [
  { id: 'liquidGlassLight', labelKey: 'liquidGlassLight' },
  { id: 'liquidGlassDark', labelKey: 'liquidGlassDark' },
  { id: 'normalLight', labelKey: 'normalLight' },
  { id: 'normalDark', labelKey: 'normalDark' },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-2">
      {themes.map(({ id, labelKey }) => (
        <button
          key={id}
          onClick={() => setTheme(id)}
          className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            theme === id
              ? 'bg-[var(--accent)] text-white shadow-md'
              : 'bg-[var(--card)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--hover)]'
          }`}
        >
          {t(labelKey)}
        </button>
      ))}
    </div>
  );
}

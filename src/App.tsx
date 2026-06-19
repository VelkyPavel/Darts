import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { SettingsProvider } from './context/SettingsContext';
import { GameProvider, useGame } from './context/GameContext';
import AppHeader from './components/AppHeader';
import BottomNav from './components/BottomNav';
import Home from './screens/Home';
import GameSetup from './screens/GameSetup';
import Game from './screens/Game';
import Winner from './screens/Winner';
import History from './screens/History';
import Players from './screens/Players';
import SettingsScreen from './screens/Settings';
import InstallGuide from './screens/InstallGuide';

function ScreenRouter() {
  const { screen } = useGame();

  switch (screen) {
    case 'home': return <Home />;
    case 'setup': return <GameSetup />;
    case 'game': return <Game />;
    case 'winner': return <Winner />;
    case 'history': return <History />;
    case 'players': return <Players />;
    case 'settings': return <SettingsScreen />;
    case 'installGuide': return <InstallGuide />;
    default: return <Home />;
  }
}

function AppContent() {
  const { screen } = useGame();
  const isGameScreen = screen === 'game' || screen === 'winner';

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text)] transition-colors duration-200">
      {!isGameScreen && <AppHeader />}
      <main className={isGameScreen ? '' : 'max-w-2xl mx-auto pb-20 md:pb-4'}>
        <ScreenRouter />
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SettingsProvider>
          <GameProvider>
            <AppContent />
          </GameProvider>
        </SettingsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

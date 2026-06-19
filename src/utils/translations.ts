export type Language = 'en' | 'cs' | 'sk' | 'ru' | 'pl';

export interface Translations {
  // App
  appName: string;
  // Home
  startGame: string;
  history: string;
  players: string;
  settings: string;
  installGuide: string;
  // Game Setup
  selectMode: string;
  addPlayers: string;
  start: string;
  game301: string;
  game501: string;
  selectPlayer: string;
  addNewPlayer: string;
  playerName: string;
  add: string;
  minPlayers: string;
  // Game
  throwOf: string;
  round: string;
  undo: string;
  bust: string;
  turnTotal: string;
  endTurn: string;
  confirm: string;
  cancel: string;
  endRoundQuestion: string;
  enterScore: string;
  nextThrow: string;
  remaining: string;
  // Winner
  winner: string;
  finalScores: string;
  playAgain: string;
  menu: string;
  // History
  gameHistory: string;
  date: string;
  mode: string;
  noGames: string;
  // Players Screen
  playerManagement: string;
  gamesPlayed: string;
  gamesWon: string;
  delete: string;
  noPlayers: string;
  confirmDelete: string;
  // Settings
  theme: string;
  language: string;
  endRoundConfirmation: string;
  autoConfirm: string;
  doubleOut: string;
  on: string;
  off: string;
  // Themes
  liquidGlassLight: string;
  liquidGlassDark: string;
  normalLight: string;
  normalDark: string;
  // Install Guide
  installTitle: string;
  androidTitle: string;
  androidStep1: string;
  androidStep2: string;
  androidStep3: string;
  iosTitle: string;
  iosStep1: string;
  iosStep2: string;
  iosStep3: string;
  desktopTitle: string;
  desktopStep1: string;
  // Numeric Keyboard
  double: string;
  triple: string;
  bull: string;
  bullseye: string;
  miss: string;
  backspace: string;
  clear: string;
  // Validation
  scoreTooHigh: string;
  negativeScore: string;
  maxTurnScore: string;
  // Misc
  back: string;
  save: string;
  close: string;
}

const en: Translations = {
  appName: 'Darts Scorekeeper',
  startGame: 'Start Game',
  history: 'History',
  players: 'Players',
  settings: 'Settings',
  installGuide: 'Install Guide',
  selectMode: 'Select Game Mode',
  addPlayers: 'Add Players',
  start: 'Start',
  game301: '301',
  game501: '501',
  selectPlayer: 'Select Player',
  addNewPlayer: 'Add New Player',
  playerName: 'Player Name',
  add: 'Add',
  minPlayers: 'At least 1 player required',
  throwOf: 'Throw {current} of {total}',
  round: 'Round {number}',
  undo: 'Undo',
  bust: 'BUST!',
  turnTotal: 'Turn Total',
  endTurn: 'End Turn',
  confirm: 'Confirm',
  cancel: 'Cancel',
  endRoundQuestion: 'End this round?',
  enterScore: 'Enter score',
  nextThrow: 'Next Throw',
  remaining: 'Remaining',
  winner: 'Winner!',
  finalScores: 'Final Scores',
  playAgain: 'Play Again',
  menu: 'Menu',
  gameHistory: 'Game History',
  date: 'Date',
  mode: 'Mode',
  noGames: 'No games played yet',
  playerManagement: 'Player Management',
  gamesPlayed: 'Games Played',
  gamesWon: 'Games Won',
  delete: 'Delete',
  noPlayers: 'No players yet',
  confirmDelete: 'Are you sure you want to delete this player?',
  theme: 'Theme',
  language: 'Language',
  endRoundConfirmation: 'End Round Confirmation',
  autoConfirm: 'Auto Confirm',
  doubleOut: 'Double Out',
  on: 'ON',
  off: 'OFF',
  liquidGlassLight: 'Liquid Glass Light',
  liquidGlassDark: 'Liquid Glass Dark',
  normalLight: 'Normal Light',
  normalDark: 'Normal Dark',
  installTitle: 'Install Guide',
  androidTitle: 'Android',
  androidStep1: 'Open Chrome and visit the app',
  androidStep2: 'Tap the menu (three dots) in the top right',
  androidStep3: 'Tap "Add to Home Screen"',
  iosTitle: 'iOS',
  iosStep1: 'Open Safari and visit the app',
  iosStep2: 'Tap the Share button at the bottom',
  iosStep3: 'Tap "Add to Home Screen"',
  desktopTitle: 'Desktop',
  desktopStep1: 'Click the install icon in the browser address bar',
  double: 'Double',
  triple: 'Triple',
  bull: 'Bull',
  bullseye: 'Bullseye',
  miss: 'Miss',
  backspace: 'Backspace',
  clear: 'Clear',
  scoreTooHigh: 'Score too high',
  negativeScore: 'Score cannot be negative',
  maxTurnScore: 'Maximum 180 per turn',
  back: 'Back',
  save: 'Save',
  close: 'Close',
};

const cs: Translations = {
  appName: 'Šipky Skóre',
  startGame: 'Nová hra',
  history: 'Historie',
  players: 'Hráči',
  settings: 'Nastavení',
  installGuide: 'Průvodce instalací',
  selectMode: 'Vyberte herní režim',
  addPlayers: 'Přidat hráče',
  start: 'Start',
  game301: '301',
  game501: '501',
  selectPlayer: 'Vybrat hráče',
  addNewPlayer: 'Přidat nového hráče',
  playerName: 'Jméno hráče',
  add: 'Přidat',
  minPlayers: 'Je vyžadován alespoň 1 hráč',
  throwOf: 'Hod {current} z {total}',
  round: 'Kolo {number}',
  undo: 'Zpět',
  bust: 'PŘES!',
  turnTotal: 'Celkem kolo',
  endTurn: 'Ukončit kolo',
  confirm: 'Potvrdit',
  cancel: 'Zrušit',
  endRoundQuestion: 'Ukončit toto kolo?',
  enterScore: 'Zadejte skóre',
  nextThrow: 'Další hod',
  remaining: 'Zbývá',
  winner: 'Vítěz!',
  finalScores: 'Konečné skóre',
  playAgain: 'Hrát znovu',
  menu: 'Menu',
  gameHistory: 'Historie her',
  date: 'Datum',
  mode: 'Režim',
  noGames: 'Zatím žádné hry',
  playerManagement: 'Správa hráčů',
  gamesPlayed: 'Odehrané hry',
  gamesWon: 'Vyhrané hry',
  delete: 'Smazat',
  noPlayers: 'Zatím žádní hráči',
  confirmDelete: 'Opravdu chcete smazat tohoto hráče?',
  theme: 'Téma',
  language: 'Jazyk',
  endRoundConfirmation: 'Potvrzení konce kola',
  autoConfirm: 'Auto potvrzení',
  doubleOut: 'Double Out',
  on: 'ZAP',
  off: 'VYP',
  liquidGlassLight: 'Tekuté sklo světlé',
  liquidGlassDark: 'Tekuté sklo tmavé',
  normalLight: 'Světlé',
  normalDark: 'Tmavé',
  installTitle: 'Průvodce instalací',
  androidTitle: 'Android',
  androidStep1: 'Otevřete Chrome a navštivte aplikaci',
  androidStep2: 'Klepněte na menu (tři tečky) vpravo nahoře',
  androidStep3: 'Klepněte na "Přidat na domovskou obrazovku"',
  iosTitle: 'iOS',
  iosStep1: 'Otevřete Safari a navštivte aplikaci',
  iosStep2: 'Klepněte na tlačítko Sdílet dole',
  iosStep3: 'Klepněte na "Přidat na domovskou obrazovku"',
  desktopTitle: 'Počítač',
  desktopStep1: 'Klikněte na ikonu instalace v adresním řádku prohlížeče',
  double: 'Dvojité',
  triple: 'Trojité',
  bull: 'Býk',
  bullseye: 'Býčí oko',
  miss: 'Vedle',
  backspace: 'Smazat',
  clear: 'Vyčistit',
  scoreTooHigh: 'Skóre je příliš vysoké',
  negativeScore: 'Skóre nemůže být záporné',
  maxTurnScore: 'Maximum 180 za kolo',
  back: 'Zpět',
  save: 'Uložit',
  close: 'Zavřít',
};

const sk: Translations = {
  appName: 'Šipky Skóre',
  startGame: 'Nová hra',
  history: 'História',
  players: 'Hráči',
  settings: 'Nastavenia',
  installGuide: 'Sprievodca inštaláciou',
  selectMode: 'Vyberte herný režim',
  addPlayers: 'Pridať hráčov',
  start: 'Štart',
  game301: '301',
  game501: '501',
  selectPlayer: 'Vybrať hráča',
  addNewPlayer: 'Pridať nového hráča',
  playerName: 'Meno hráča',
  add: 'Pridať',
  minPlayers: 'Je potrebný aspoň 1 hráč',
  throwOf: 'Hod {current} z {total}',
  round: 'Kolo {number}',
  undo: 'Späť',
  bust: 'PREČ!',
  turnTotal: 'Celkom kolo',
  endTurn: 'Ukončiť kolo',
  confirm: 'Potvrdiť',
  cancel: 'Zrušiť',
  endRoundQuestion: 'Ukončiť toto kolo?',
  enterScore: 'Zadajte skóre',
  nextThrow: 'Ďalší hod',
  remaining: 'Zostáva',
  winner: 'Víťaz!',
  finalScores: 'Konečné skóre',
  playAgain: 'Hrať znova',
  menu: 'Menu',
  gameHistory: 'História hier',
  date: 'Dátum',
  mode: 'Režim',
  noGames: 'Zatiaľ žiadne hry',
  playerManagement: 'Správa hráčov',
  gamesPlayed: 'Odohrané hry',
  gamesWon: 'Vyhrané hry',
  delete: 'Vymazať',
  noPlayers: 'Zatiaľ žiadni hráči',
  confirmDelete: 'Naozaj chcete vymazať tohto hráča?',
  theme: 'Téma',
  language: 'Jazyk',
  endRoundConfirmation: 'Potvrdenie konca kola',
  autoConfirm: 'Auto potvrdenie',
  doubleOut: 'Double Out',
  on: 'ZAP',
  off: 'VYP',
  liquidGlassLight: 'Tekuté sklo svetlé',
  liquidGlassDark: 'Tekuté sklo tmavé',
  normalLight: 'Svetlé',
  normalDark: 'Tmavé',
  installTitle: 'Sprievodca inštaláciou',
  androidTitle: 'Android',
  androidStep1: 'Otvorte Chrome a navštívte aplikáciu',
  androidStep2: 'Klepnite na menu (tri bodky) vpravo hore',
  androidStep3: 'Klepnite na "Pridať na domovskú obrazovku"',
  iosTitle: 'iOS',
  iosStep1: 'Otvorte Safari a navštívte aplikáciu',
  iosStep2: 'Klepnite na tlačidlo Zdieľať dole',
  iosStep3: 'Klepnite na "Pridať na domovskú obrazovku"',
  desktopTitle: 'Počítač',
  desktopStep1: 'Kliknite na ikonu inštalácie v adresnom riadku prehliadača',
  double: 'Dvojité',
  triple: 'Trojité',
  bull: 'Býk',
  bullseye: 'Býčie oko',
  miss: 'Vedľa',
  backspace: 'Zmazať',
  clear: 'Vyčistiť',
  scoreTooHigh: 'Skóre je príliš vysoké',
  negativeScore: 'Skóre nemôže byť záporné',
  maxTurnScore: 'Maximum 180 za kolo',
  back: 'Späť',
  save: 'Uložiť',
  close: 'Zavrieť',
};

const ru: Translations = {
  appName: 'Счётчик Дартс',
  startGame: 'Новая игра',
  history: 'История',
  players: 'Игроки',
  settings: 'Настройки',
  installGuide: 'Установка',
  selectMode: 'Выберите режим игры',
  addPlayers: 'Добавить игроков',
  start: 'Старт',
  game301: '301',
  game501: '501',
  selectPlayer: 'Выбрать игрока',
  addNewPlayer: 'Добавить нового игрока',
  playerName: 'Имя игрока',
  add: 'Добавить',
  minPlayers: 'Нужен хотя бы 1 игрок',
  throwOf: 'Бросок {current} из {total}',
  round: 'Раунд {number}',
  undo: 'Отмена',
  bust: 'ПЕРЕБОР!',
  turnTotal: 'Итого за раунд',
  endTurn: 'Завершить раунд',
  confirm: 'Подтвердить',
  cancel: 'Отмена',
  endRoundQuestion: 'Завершить этот раунд?',
  enterScore: 'Введите очки',
  nextThrow: 'Следующий бросок',
  remaining: 'Осталось',
  winner: 'Победитель!',
  finalScores: 'Итоговые очки',
  playAgain: 'Играть снова',
  menu: 'Меню',
  gameHistory: 'История игр',
  date: 'Дата',
  mode: 'Режим',
  noGames: 'Нет сыгранных игр',
  playerManagement: 'Управление игроками',
  gamesPlayed: 'Игр сыграно',
  gamesWon: 'Игр выиграно',
  delete: 'Удалить',
  noPlayers: 'Нет игроков',
  confirmDelete: 'Вы уверены, что хотите удалить этого игрока?',
  theme: 'Тема',
  language: 'Язык',
  endRoundConfirmation: 'Подтверждение конца раунда',
  autoConfirm: 'Авто подтверждение',
  doubleOut: 'Double Out',
  on: 'ВКЛ',
  off: 'ВЫКЛ',
  liquidGlassLight: 'Стекло светлое',
  liquidGlassDark: 'Стекло тёмное',
  normalLight: 'Светлая',
  normalDark: 'Тёмная',
  installTitle: 'Руководство по установке',
  androidTitle: 'Android',
  androidStep1: 'Откройте Chrome и перейдите в приложение',
  androidStep2: 'Нажмите меню (три точки) в правом верхнем углу',
  androidStep3: 'Нажмите "Добавить на главный экран"',
  iosTitle: 'iOS',
  iosStep1: 'Откройте Safari и перейдите в приложение',
  iosStep2: 'Нажмите кнопку "Поделиться" внизу',
  iosStep3: 'Нажмите "Добавить на главный экран"',
  desktopTitle: 'Компьютер',
  desktopStep1: 'Нажмите значок установки в адресной строке браузера',
  double: 'Двойное',
  triple: 'Тройное',
  bull: 'Буль',
  bullseye: 'Булл-ай',
  miss: 'Промах',
  backspace: 'Стереть',
  clear: 'Очистить',
  scoreTooHigh: 'Слишком много очков',
  negativeScore: 'Очки не могут быть отрицательными',
  maxTurnScore: 'Максимум 180 за раунд',
  back: 'Назад',
  save: 'Сохранить',
  close: 'Закрыть',
};

const pl: Translations = {
  appName: 'Licznik Darta',
  startGame: 'Nowa gra',
  history: 'Historia',
  players: 'Gracze',
  settings: 'Ustawienia',
  installGuide: 'Instalacja',
  selectMode: 'Wybierz tryb gry',
  addPlayers: 'Dodaj graczy',
  start: 'Start',
  game301: '301',
  game501: '501',
  selectPlayer: 'Wybierz gracza',
  addNewPlayer: 'Dodaj nowego gracza',
  playerName: 'Imię gracza',
  add: 'Dodaj',
  minPlayers: 'Wymagany co najmniej 1 gracz',
  throwOf: 'Rzut {current} z {total}',
  round: 'Runda {number}',
  undo: 'Cofnij',
  bust: 'PRZEBÓR!',
  turnTotal: 'Łącznie runda',
  endTurn: 'Zakończ rundę',
  confirm: 'Potwierdź',
  cancel: 'Anuluj',
  endRoundQuestion: 'Zakończyć tę rundę?',
  enterScore: 'Wpisz wynik',
  nextThrow: 'Następny rzut',
  remaining: 'Pozostało',
  winner: 'Zwycięzca!',
  finalScores: 'Wyniki końcowe',
  playAgain: 'Zagraj ponownie',
  menu: 'Menu',
  gameHistory: 'Historia gier',
  date: 'Data',
  mode: 'Tryb',
  noGames: 'Brak rozegranych gier',
  playerManagement: 'Zarządzanie graczami',
  gamesPlayed: 'Rozegrane gry',
  gamesWon: 'Wygrane gry',
  delete: 'Usuń',
  noPlayers: 'Brak graczy',
  confirmDelete: 'Czy na pewno chcesz usunąć tego gracza?',
  theme: 'Motyw',
  language: 'Język',
  endRoundConfirmation: 'Potwierdzenie końca rundy',
  autoConfirm: 'Auto potwierdzenie',
  doubleOut: 'Double Out',
  on: 'WŁ',
  off: 'WYŁ',
  liquidGlassLight: 'Szklane jasne',
  liquidGlassDark: 'Szklane ciemne',
  normalLight: 'Jasny',
  normalDark: 'Ciemny',
  installTitle: 'Instrukcja instalacji',
  androidTitle: 'Android',
  androidStep1: 'Otwórz Chrome i wejdź do aplikacji',
  androidStep2: 'Dotknij menu (trzy kropki) w prawym górnym rogu',
  androidStep3: 'Dotknij "Dodaj do ekranu głównego"',
  iosTitle: 'iOS',
  iosStep1: 'Otwórz Safari i wejdź do aplikacji',
  iosStep2: 'Dotknij przycisku Udostępnij na dole',
  iosStep3: 'Dotknij "Dodaj do ekranu głównego"',
  desktopTitle: 'Komputer',
  desktopStep1: 'Kliknij ikonę instalacji na pasku adresu przeglądarki',
  double: 'Podwójne',
  triple: 'Potrójne',
  bull: 'Byk',
  bullseye: 'Bykie oko',
  miss: 'Pudło',
  backspace: 'Usuń',
  clear: 'Wyczyść',
  scoreTooHigh: 'Zbyt dużo punktów',
  negativeScore: 'Wynik nie może być ujemny',
  maxTurnScore: 'Maksimum 180 na rundę',
  back: 'Wstecz',
  save: 'Zapisz',
  close: 'Zamknij',
};

export const translations: Record<Language, Translations> = { en, cs, sk, ru, pl };

export type TranslationKey = keyof Translations;

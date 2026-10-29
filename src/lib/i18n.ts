export type Language = "en" | "te" | "hi";

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  tagline: string;
  playGame: string;
  gameModes: string;
  vsAi: string;
  passAndPlay: string;
  onlineMultiplayer: string;
  difficulty: string;
  easy: string;
  normal: string;
  hard: string;
  master: string;
  rounds: string;
  roundCount: (n: number) => string;
  timer: string;
  noLimit: string;
  seconds30: string;
  min1: string;
  min3: string;
  min5: string;
  startMatch: string;
  resumeGame: string;
  dashboard: string;
  friends: string;
  settings: string;
  rules: string;
  history: string;
  statistics: string;
  wins: string;
  losses: string;
  draws: string;
  totalGames: string;
  winRate: string;
  currentStreak: string;
  bestStreak: string;
  noMatchesYet: string;
  roundHeader: (current: number, total: number) => string;
  turnPhasePlacement: string;
  turnPhaseMovement: string;
  turnPhaseFlying: string;
  stonesInHand: (n: number) => string;
  stonesOnBoard: (n: number) => string;
  formedMill: string;
  chooseOpponentStone: string;
  protectedByMill: string;
  noFreeNeighbours: string;
  timeRemaining: string;
  undoMove: string;
  restartMatch: string;
  backToLobby: string;
  matchWon: (name: string) => string;
  matchLost: string;
  matchDraw: string;
  nextRound: string;
  newMatch: string;
  roomCode: string;
  createLobby: string;
  joinLobby: string;
  enterRoomCode: string;
  join: string;
  shareCodeHint: string;
  waitingForPlayer: string;
  playerReady: string;
  searchFriends: string;
  sendRequest: string;
  incomingRequests: string;
  accept: string;
  decline: string;
  challenge: string;
  onlineNow: string;
  offline: string;
  soundEffects: string;
  volume: string;
  themeMode: string;
  lightMode: string;
  darkMode: string;
  boardTheme: string;
  themeWood: string;
  themeMidnight: string;
  themeJade: string;
  themeIvory: string;
  displayName: string;
  chooseAvatar: string;
  changePassword: string;
  newPassword: string;
  confirmPassword: string;
  updatePassword: string;
  savePreferences: string;
  savedSuccessfully: string;
  signOut: string;
  guestUser: string;
  stoneColors: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: "VARASAATA",
    appSubtitle: "వరసాట · Nine Men's Morris",
    tagline: "The timeless classical Indian stone strategy game of patience, mills, and cunning.",
    playGame: "Play Game",
    gameModes: "Game Mode",
    vsAi: "Versus Computer",
    passAndPlay: "Pass & Play (2 Players)",
    onlineMultiplayer: "Online Multiplayer",
    difficulty: "AI Toughness",
    easy: "Easy",
    normal: "Normal",
    hard: "Hard",
    master: "Master",
    rounds: "Match Rounds",
    roundCount: (n) => (n === 1 ? "1 Round" : `Best of ${n}`),
    timer: "Move Timer",
    noLimit: "No Time Limit",
    seconds30: "30 Seconds",
    min1: "1 Minute",
    min3: "3 Minutes",
    min5: "5 Minutes",
    startMatch: "Start Match",
    resumeGame: "Resume Game",
    dashboard: "Dashboard",
    friends: "Friends & Online",
    settings: "Settings",
    rules: "How to Play",
    history: "Recent Matches",
    statistics: "Career Statistics",
    wins: "Wins",
    losses: "Losses",
    draws: "Draws",
    totalGames: "Matches",
    winRate: "Win Rate",
    currentStreak: "Current Streak",
    bestStreak: "Best Streak",
    noMatchesYet: "No completed matches yet. Jump into a game to make your mark!",
    roundHeader: (curr, total) => `Round ${curr} of ${total}`,
    turnPhasePlacement: "Phase 1: Placing Stones",
    turnPhaseMovement: "Phase 2: Moving to Adjacent Spots",
    turnPhaseFlying: "Phase 3: Flying! (Move to any spot)",
    stonesInHand: (n) => `${n} stones in hand`,
    stonesOnBoard: (n) => `${n} on board`,
    formedMill: "🔥 MILL FORMED! Select an opponent stone to capture.",
    chooseOpponentStone: "Choose an opponent's stone to capture.",
    protectedByMill: "That stone is safe in an active mill! Pick another unless all are in mills.",
    noFreeNeighbours: "That stone has no open adjacent point.",
    timeRemaining: "Time remaining",
    undoMove: "Undo Move",
    restartMatch: "Restart Match",
    backToLobby: "Leave Match",
    matchWon: (name) => `🏆 ${name} Won the Match!`,
    matchLost: "Match Over — Better luck next round!",
    matchDraw: "The match ended in a noble draw!",
    nextRound: "Next Round",
    newMatch: "Play Again",
    roomCode: "Room Code",
    createLobby: "Create Room",
    joinLobby: "Join Room",
    enterRoomCode: "Enter 6-character room code",
    join: "Join",
    shareCodeHint: "Share this code with your friend to connect immediately.",
    waitingForPlayer: "Waiting for opponent to join...",
    playerReady: "Opponent connected and ready!",
    searchFriends: "Search players by name...",
    sendRequest: "Add Friend",
    incomingRequests: "Friend Requests",
    accept: "Accept",
    decline: "Decline",
    challenge: "Challenge",
    onlineNow: "Online",
    offline: "Offline",
    soundEffects: "Sound & Audio FX",
    volume: "Volume",
    themeMode: "Display Mode",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    boardTheme: "Board Style",
    themeWood: "Imperial Teak Wood",
    themeMidnight: "Midnight Stars",
    themeJade: "Royal Jade Emerald",
    themeIvory: "Sandalwood Ivory",
    displayName: "Player Name",
    chooseAvatar: "Select Avatar",
    changePassword: "Change Password",
    newPassword: "New Password",
    confirmPassword: "Confirm New Password",
    updatePassword: "Save New Password",
    savePreferences: "Save Preferences",
    savedSuccessfully: "Preferences saved successfully!",
    signOut: "Sign Out",
    guestUser: "Warrior",
    stoneColors: "Stone Colours",
  },

  te: {
    appName: "వరసాట",
    appSubtitle: "VARASAATA · నవకంకరి",
    tagline:
      "రాళ్లను పేర్చి, వరసలు (మిల్లులు) కట్టి, ప్రత్యర్థి పావులను కత్తిరించే ప్రాచీన తెలుగు సంప్రదాయ యుద్ధ క్రీడ.",
    playGame: "ఆట ఆడండి",
    gameModes: "ఆట విధానం",
    vsAi: "కంప్యూటర్‌తో పోరాటం",
    passAndPlay: "స్నేహితుడితో (ఒకే స్క్రీన్)",
    onlineMultiplayer: "ఆన్‌లైన్ పోటీ (కోడ్ / ఫ్రెండ్స్)",
    difficulty: "కఠినత్వ స్థాయి",
    easy: "సులభం",
    normal: "సాధారణం",
    hard: "కఠినం",
    master: "మహా నిపుణుడు",
    rounds: "రౌండ్లు",
    roundCount: (n) => (n === 1 ? "1 రౌండ్" : `ఉత్తమ ${n} రౌండ్లు`),
    timer: "ఎత్తు సమయ పరిమితి",
    noLimit: "సమయ పరిమితి లేదు",
    seconds30: "30 సెకన్లు",
    min1: "1 నిమిషం",
    min3: "3 నిమిషాలు",
    min5: "5 నిమిషాలు",
    startMatch: "యుద్ధం ప్రారంభించు",
    resumeGame: "ఆట కొనసాగించు",
    dashboard: "విజయాల బోర్డు",
    friends: "స్నేహితులు & ఆన్‌లైన్",
    settings: "సెట్టింగులు",
    rules: "నియమావళి",
    history: "ఇటీవలి ఆటలు",
    statistics: "మొత్తం గణాంకాలు",
    wins: "గెలుపులు",
    losses: "ఓటములు",
    draws: "డ్రాలు",
    totalGames: "మొత్తం ఆటలు",
    winRate: "గెలుపు శాతం",
    currentStreak: "ప్రస్తుత పరంపర",
    bestStreak: "అత్యుత్తమ పరంపర",
    noMatchesYet: "ఇంకా పూర్తి అయిన ఆటలు లేవు. ఇప్పుడే ఆడటం మొదలుపెట్టండి!",
    roundHeader: (curr, total) => `రౌండ్ ${curr} / ${total}`,
    turnPhasePlacement: "దశ 1: పావులను బోర్డుపై ఉంచడం",
    turnPhaseMovement: "దశ 2: పక్క గడిలోకి కదలడం",
    turnPhaseFlying: "దశ 3: ఎగరడం! (ఏ ఖాళీ గడికైనా)",
    stonesInHand: (n) => `చేతిలో ${n} రాళ్లు ఉన్నాయి`,
    stonesOnBoard: (n) => `బోర్డుపై ${n}`,
    formedMill: "🔥 వరస ఏర్పడింది! శత్రువు రాయిని ఎంచుకొని తొలగించండి.",
    chooseOpponentStone: "తొలగించడానికి ప్రత్యర్థి రాయిని తాకండి.",
    protectedByMill: "ఆ రాయి వరసలో రక్షించబడి ఉంది! వేరే రాయిని ఎంచుకోండి.",
    noFreeNeighbours: "ఆ రాయి కదలడానికి పక్కన ఖాళీ లేదు.",
    timeRemaining: "మిగిలిన సమయం",
    undoMove: "ఎత్తు వెనక్కి తీసుకో",
    restartMatch: "మళ్లీ ప్రారంభించు",
    backToLobby: "ఆట ముగించు",
    matchWon: (name) => `🏆 ${name} అద్భుత విజయం సాధించారు!`,
    matchLost: "ఈసారి ఓటమి ఎదురైంది — వచ్చే రౌండ్‌లో గెలవండి!",
    matchDraw: "ఇరు పక్షాల పోరు సమానంగా ముగిసింది (డ్రా)!",
    nextRound: "తదుపరి రౌండ్",
    newMatch: "మళ్లీ ఆడండి",
    roomCode: "గది సంకేతం (రూమ్ కోడ్)",
    createLobby: "కొత్త రూమ్ సృష్టించు",
    joinLobby: "రూమ్‌లో చేరండి",
    enterRoomCode: "6 అక్షరాల కోడ్ నమోదు చేయండి",
    join: "చేరండి",
    shareCodeHint: "ఈ కోడ్‌ను మీ స్నేహితుడికి పంపి వెంటనే ఒకేసారి ఆడండి.",
    waitingForPlayer: "రెండవ ఆటగాడి రాక కోసం వేచి చూస్తున్నాము...",
    playerReady: "ప్రత్యర్థి చేరారు! ఆట ప్రారంభానికి సిద్ధం.",
    searchFriends: "పేరుతో వెతకండి...",
    sendRequest: "ఫ్రెండ్ రిక్వెస్ట్",
    incomingRequests: "వచ్చిన రిక్వెస్ట్‌లు",
    accept: "అంగీకరించు",
    decline: "తిరస్కరించు",
    challenge: "ఆహ్వానించు",
    onlineNow: "ఆన్‌లైన్‌లో ఉన్నారు",
    offline: "ఆఫ్‌లైన్",
    soundEffects: "శబ్ద ప్రభావాలు",
    volume: "ధ్వని తీవ్రత",
    themeMode: "స్క్రీన్ థీమ్",
    lightMode: "లైట్ మోడ్ (వెలుగు)",
    darkMode: "డార్క్ మోడ్ (చీకటి)",
    boardTheme: "బోర్డు శైలి",
    themeWood: "రాచరిక టేకు కలప",
    themeMidnight: "నక్షత్ర రాత్రి",
    themeJade: "పచ్చల హరితం",
    themeIvory: "చందనం తెలుపు",
    displayName: "ఆటగాడి పేరు",
    chooseAvatar: "అవతార్ ఎంచుకోండి",
    changePassword: "పాస్‌వర్డ్ మార్చండి",
    newPassword: "కొత్త పాస్‌వర్డ్",
    confirmPassword: "పాస్‌వర్డ్ నిర్ధారణ",
    updatePassword: "పాస్‌వర్డ్ భద్రపరచు",
    savePreferences: "మార్పులు భద్రపరచు",
    savedSuccessfully: "అన్ని మార్పులు విజయవంతంగా భద్రపరచబడ్డాయి!",
    signOut: "లాగ్ అవుట్",
    guestUser: "వీరుడు",
    stoneColors: "రత్నాల రంగులు",
  },

  hi: {
    appName: "वरसाटा",
    appSubtitle: "VARASAATA · नवकंकरी / नौ गोटियाँ",
    tagline: "धैर्य, रणनीति और मणियों की कतार बनाने वाला भारत का प्राचीन एवं लोकप्रिय खेल।",
    playGame: "खेल शुरू करें",
    gameModes: "खेल का प्रकार",
    vsAi: "कंप्यूटर के विरुद्ध",
    passAndPlay: "पास और खेलें (दो खिलाड़ी)",
    onlineMultiplayer: "ऑनलाइन मुकाबला (कमरा कोड / दोस्त)",
    difficulty: "कठिनाई स्तर",
    easy: "आसान",
    normal: "सामान्य",
    hard: "कठिन",
    master: "उस्ताद (माहिर)",
    rounds: "मुकाबले के राउंड",
    roundCount: (n) => (n === 1 ? "1 राउंड" : `सर्वश्रेष्ठ ${n} राउंड`),
    timer: "चाल की समय सीमा",
    noLimit: "कोई समय सीमा नहीं",
    seconds30: "30 सेकंड",
    min1: "1 मिनट",
    min3: "3 मिनट",
    min5: "5 मिनट",
    startMatch: "मैच शुरू करें",
    resumeGame: "खेल जारी रखें",
    dashboard: "डैशबोर्ड व आंकड़े",
    friends: "मित्र व ऑनलाइन",
    settings: "सेटिंग्स",
    rules: "खेल के नियम",
    history: "हाल के मैच",
    statistics: "कुल प्रदर्शन",
    wins: "जीत",
    losses: "हार",
    draws: "ड्रा",
    totalGames: "कुल मैच",
    winRate: "जीत का प्रतिशत",
    currentStreak: "मौजूदा सिलसिला",
    bestStreak: "सर्वश्रेष्ठ सिलसिला",
    noMatchesYet: "अभी तक कोई मैच समाप्त नहीं हुआ। मैदान में उतरें और अपना कौशल दिखाएं!",
    roundHeader: (curr, total) => `राउंड ${curr} / ${total}`,
    turnPhasePlacement: "चरण 1: गोटियाँ बिछाना",
    turnPhaseMovement: "चरण 2: पास के बिंदु पर चलना",
    turnPhaseFlying: "चरण 3: उड़ान! (किसी भी खाली बिंदु पर)",
    stonesInHand: (n) => `हाथ में ${n} गोटियाँ शेष`,
    stonesOnBoard: (n) => `बोर्ड पर ${n}`,
    formedMill: "🔥 कतार (मिल) बनी! प्रतिद्वंद्वी की एक गोटी चुनें और हटाएं।",
    chooseOpponentStone: "हटाने के लिए प्रतिद्वंद्वी की गोटी चुनें।",
    protectedByMill: "यह गोटी कतार में सुरक्षित है! कोई दूसरी गोटी चुनें।",
    noFreeNeighbours: "इस गोटी के चलने के लिए बगल में जगह नहीं है।",
    timeRemaining: "शेष समय",
    undoMove: "चाल वापस लें",
    restartMatch: "पुनः प्रारंभ करें",
    backToLobby: "लॉबी पर लौटें",
    matchWon: (name) => `🏆 ${name} ने शानदार जीत हासिल की!`,
    matchLost: "इस मैच में हार हुई — अगले राउंड में फिर प्रयास करें!",
    matchDraw: "यह मुकाबला बराबरी पर समाप्त हुआ!",
    nextRound: "अगला राउंड",
    newMatch: "नया मैच खेलें",
    roomCode: "कमरा कोड (Room Code)",
    createLobby: "नया कमरा बनाएं",
    joinLobby: "कमरे में शामिल हों",
    enterRoomCode: "6 अक्षरों का कोड दर्ज करें",
    join: "शामिल हों",
    shareCodeHint: "यह कोड अपने मित्र के साथ साझा करें और सीधे खेलें।",
    waitingForPlayer: "दूसरे खिलाड़ी के जुड़ने की प्रतीक्षा...",
    playerReady: "खिलाड़ी जुड़ चुका है! खेल शुरू करने के लिए तैयार।",
    searchFriends: "नाम से मित्रों को खोजें...",
    sendRequest: "मित्र बनाएं",
    incomingRequests: "आए हुए अनुरोध",
    accept: "स्वीकार करें",
    decline: "अस्वीकार करें",
    challenge: "चुनौती दें",
    onlineNow: "ऑनलाइन",
    offline: "ऑफलाइन",
    soundEffects: "ध्वनि प्रभाव",
    volume: "आवाज़ की तीव्रता",
    themeMode: "स्क्रीन थीम",
    lightMode: "लाइट मोड (दिन)",
    darkMode: "डार्क मोड (रात)",
    boardTheme: "बोर्ड शैली",
    themeWood: "शाही सागौन लकड़ी",
    themeMidnight: "तारों भरी रात",
    themeJade: "शाही पन्ना हरा",
    themeIvory: "चंदन श्वेत",
    displayName: "खिलाड़ी का नाम",
    chooseAvatar: "अवतार चुनें",
    changePassword: "पासवर्ड बदलें",
    newPassword: "नया पासवर्ड",
    confirmPassword: "नया पासवर्ड दोहराएं",
    updatePassword: "पासवर्ड सुरक्षित करें",
    savePreferences: "प्राथमिकताएं सहेजें",
    savedSuccessfully: "सभी बदलाव सफलतापूर्वक सहेज लिए गए हैं!",
    signOut: "लॉग आउट",
    guestUser: "योद्धा",
    stoneColors: "गोटी के रंग",
  },
};

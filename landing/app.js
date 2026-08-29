(function () {
  const TEXTS = {
    ru: {
      title: 'Немецкие термины страховки — понятным языком',
      subtitle: 'Советы из личного опыта',
      welcome: '👋 Привет! Чтобы начать, выбери слева — тебе нужна страховка на недавно купленную машину (Neu angeschafftes Auto), либо хочешь сравнить цены на страховку машины, на которой ты уже ездишь (Bestehendes Auto). Выбери дату начала страхования и жми «weiter».',
      welcomeFollowup: 'Если есть вопросы — пиши их сюда, помогу разобраться или переведу всё, что непонятно 😊',
      placeholder: 'Напиши вопрос...',
      formNote: '⚠️ Форма партнёра на немецком языке — скопируй непонятное поле в чат справа, переведу и объясню значение',
      tabForm: '📋 Форма', tabChat: '💬 Чат',
      badge1: 'Практический опыт', badge2: 'Ответ на твоём языке', badge3: 'Конфиденциально',
      formTitle: 'Форма страхового партнёра', formTitleNote: '(немецкая)',
      onlineLabel: 'Онлайн', victorName: 'Виктор'
    },
    uk: {
      title: 'Німецькі терміни страхування — зрозумілою мовою',
      subtitle: 'Поради з особистого досвіду',
      welcome: '👋 Привіт! Щоб почати, обери зліва — тобі потрібна страховка на нещодавно куплений автомобіль (Neu angeschafftes Auto), чи хочеш порівняти ціни на страховку авто, яким вже їздиш (Bestehendes Auto). Обери дату початку страхування і натисни «weiter».',
      welcomeFollowup: 'Якщо є питання — пиши їх сюди, допоможу розібратися або перекладу все незрозуміле 😊',
      placeholder: 'Напиши питання...',
      formNote: '⚠️ Форма партнера німецькою мовою — скопіюй незрозуміле поле в чат праворуч, перекладу і поясню значення',
      tabForm: '📋 Форма', tabChat: '💬 Чат',
      badge1: 'Практичний досвід', badge2: 'Відповідь твоєю мовою', badge3: 'Конфіденційно',
      formTitle: 'Форма страхового партнера', formTitleNote: '(німецька)',
      onlineLabel: 'Онлайн', victorName: 'Віктор'
    },
    en: {
      title: 'German insurance terms — explained simply',
      subtitle: 'Tips from personal experience',
      welcome: '👋 Hi! To get started, choose on the left — do you need insurance for a recently purchased car (Neu angeschafftes Auto), or want to compare prices for a car you already drive (Bestehendes Auto). Pick the insurance start date and click "weiter".',
      welcomeFollowup: "If you have any questions, write them here — I'll help explain or translate anything unclear 😊",
      placeholder: 'Type your question...',
      formNote: '⚠️ The partner form is in German — paste any unclear field into the chat on the right, I\'ll translate and explain it',
      tabForm: '📋 Form', tabChat: '💬 Chat',
      badge1: 'Practical experience', badge2: 'Answer in your language', badge3: 'Confidential',
      formTitle: 'Partner insurance form', formTitleNote: '(German)',
      onlineLabel: 'Online', victorName: 'Viktor'
    },
    de: {
      title: 'Fachbegriffe der Kfz-Versicherung — einfach erklärt',
      subtitle: 'Tipps aus persönlicher Erfahrung',
      welcome: '👋 Hallo! Wähle links aus — brauchst du eine Versicherung für ein neu angeschafftes Auto (Neu angeschafftes Auto) oder möchtest du die Preise für dein bestehendes Auto vergleichen (Bestehendes Auto). Wähle das Versicherungsbeginn-Datum und klicke auf „weiter".',
      welcomeFollowup: 'Falls du Fragen hast, schreib sie hier — ich helfe gerne bei allem Unklaren 😊',
      placeholder: 'Schreib deine Frage...',
      formNote: '⚠️ Das Formular ist bereits auf Deutsch - bei Fragen zu einem Begriff einfach im Chat rechts fragen',
      tabForm: '📋 Formular', tabChat: '💬 Chat',
      badge1: 'Praktische Erfahrung', badge2: 'Antwort in deiner Sprache', badge3: 'Vertraulich',
      formTitle: 'Formular des Versicherungspartners', formTitleNote: '(Deutsch)',
      onlineLabel: 'Online', victorName: 'Viktor'
    },
    pl: {
      title: 'Niemieckie terminy ubezpieczeniowe — prostym językiem',
      subtitle: 'Wskazówki z osobistego doświadczenia',
      welcome: '👋 Cześć! Aby zacząć, wybierz po lewej — czy potrzebujesz ubezpieczenia dla niedawno kupionego auta (Neu angeschafftes Auto), czy chcesz porównać ceny dla auta, którym już jeździsz (Bestehendes Auto). Wybierz datę rozpoczęcia ubezpieczenia i kliknij „weiter".',
      welcomeFollowup: 'Jeśli masz pytania, napisz je tutaj — pomogę zrozumieć lub przetłumaczę to, co niejasne 😊',
      placeholder: 'Napisz pytanie...',
      formNote: '⚠️ Formularz partnera jest w języku niemieckim — wklej niejasne pole na czacie po prawej, przetłumaczę i wyjaśnię jego znaczenie',
      tabForm: '📋 Formularz', tabChat: '💬 Czat',
      badge1: 'Praktyczne doświadczenie', badge2: 'Odpowiedź w twoim języku', badge3: 'Poufnie',
      formTitle: 'Formularz partnera ubezpieczeniowego', formTitleNote: '(niemiecki)',
      onlineLabel: 'Online', victorName: 'Wiktor'
    },
    ro: {
      title: 'Termeni de asigurare germani — explicați simplu',
      subtitle: 'Sfaturi din experiența personală',
      welcome: '👋 Salut! Pentru a începe, alege în stânga — ai nevoie de asigurare pentru o mașină cumpărată recent (Neu angeschafftes Auto), sau vrei să compari prețurile pentru mașina cu care conduci deja (Bestehendes Auto). Alege data de început a asigurării și apasă „weiter".',
      welcomeFollowup: 'Dacă ai întrebări, scrie-le aici — te ajut să înțelegi sau traduc orice neclar 😊',
      placeholder: 'Scrie întrebarea ta...',
      formNote: '⚠️ Formularul partenerului este în germană — scrie în chatul din dreapta câmpul neclar, îl traduc și explic',
      tabForm: '📋 Formular', tabChat: '💬 Chat',
      badge1: 'Experiență practică', badge2: 'Răspuns în limba ta', badge3: 'Confidențial',
      formTitle: 'Formularul partenerului de asigurare', formTitleNote: '(germană)',
      onlineLabel: 'Online', victorName: 'Viktor'
    },
    hr: {
      title: 'Njemački pojmovi osiguranja — jednostavno objašnjeni',
      subtitle: 'Savjeti iz osobnog iskustva',
      welcome: '👋 Bok! Za početak, odaberi lijevo — trebaš li osiguranje za nedavno kupljeni automobil (Neu angeschafftes Auto), ili želiš usporediti cijene za automobil kojim već voziš (Bestehendes Auto). Odaberi datum početka osiguranja i klikni „weiter".',
      welcomeFollowup: 'Ako imaš pitanja, napiši ih ovdje — pomoći ću ti razumjeti ili prevesti sve što nije jasno 😊',
      placeholder: 'Napiši svoje pitanje...',
      formNote: '⚠️ Obrazac partnera je na njemačkom — zalijepi nejasno polje u chat s desne strane, prevest ću i objasniti njegovo značenje',
      tabForm: '📋 Obrazac', tabChat: '💬 Chat',
      badge1: 'Praktično iskustvo', badge2: 'Odgovor na tvom jeziku', badge3: 'Povjerljivo',
      formTitle: 'Obrazac partnera za osiguranje', formTitleNote: '(njemački)',
      onlineLabel: 'Online', victorName: 'Viktor'
    }
  };

  let currentLang = 'ru';
  const sessionId = 'web_' + Math.random().toString(36).slice(2) + '_' + Date.now();

  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const welcomeMsg = document.getElementById('welcomeMsg');
  const heroTitle = document.getElementById('heroTitle');
  const heroSubtitle = document.getElementById('heroSubtitle');
  const formNote = document.getElementById('formNote');
  const tabFormBtn = document.getElementById('tabFormBtn');
  const tabChatBtn = document.getElementById('tabChatBtn');
  const formPanel = document.getElementById('formPanel');
  const chatPanel = document.getElementById('chatPanel');
  const badge1 = document.getElementById('badge1');
  const badge2 = document.getElementById('badge2');
  const badge3 = document.getElementById('badge3');
  const formTitle = document.getElementById('formTitle');
  const formTitleNote = document.getElementById('formTitleNote');
  const onlineLabel = document.getElementById('onlineLabel');
  const chatNameEl = document.querySelector('.chat-name');

  // Отложенное приветственное сообщение "если есть вопросы, пиши" -
  // появляется через 10 секунд после загрузки страницы, но отменяется,
  // если пользователь сам успел написать раньше (чтобы не дублировать).
  let welcomeFollowupTimer = null;

  function applyLanguage(lang) {
    currentLang = lang;
    const t = TEXTS[lang] || TEXTS.ru;
    heroTitle.textContent = t.title;
    heroSubtitle.textContent = t.subtitle;
    welcomeMsg.textContent = t.welcome;
    chatInput.placeholder = t.placeholder;
    formNote.textContent = t.formNote;
    tabFormBtn.textContent = t.tabForm;
    tabChatBtn.textContent = t.tabChat;
    badge1.textContent = t.badge1;
    badge2.textContent = t.badge2;
    badge3.textContent = t.badge3;
    formTitle.textContent = t.formTitle;
    formTitleNote.textContent = t.formTitleNote;
    onlineLabel.textContent = t.onlineLabel;
    if (chatNameEl) chatNameEl.textContent = t.victorName;

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  document.getElementById('langSwitch').addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (btn) applyLanguage(btn.dataset.lang);
  });

  // Переключение вкладок (актуально только на мобильном - на десктопе
  // обе панели видны одновременно через CSS, но клик по вкладке всё
  // равно работает безопасно и там)
  document.getElementById('mobileTabs').addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const tab = btn.dataset.tab;

    tabFormBtn.classList.toggle('active', tab === 'form');
    tabChatBtn.classList.toggle('active', tab === 'chat');
    formPanel.classList.toggle('active', tab === 'form');
    chatPanel.classList.toggle('active', tab === 'chat');
  });

  function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = 'msg ' + sender;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Пользователь сам начал писать - отменяем отложенное приветствие,
    // чтобы не присылать его поверх уже начавшегося разговора.
    if (welcomeFollowupTimer) {
      clearTimeout(welcomeFollowupTimer);
      welcomeFollowupTimer = null;
    }

    addMessage(text, 'user');
    chatInput.value = '';

    const loadingEl = addMessage('...', 'bot loading');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId, language: currentLang })
      });
      const data = await res.json();

      loadingEl.remove();

      if (!res.ok) {
        addMessage('⚠️ Что-то пошло не так, попробуй ещё раз.', 'bot');
        return;
      }

      addMessage(data.text, 'bot');

    } catch (error) {
      loadingEl.remove();
      addMessage('⚠️ Ошибка соединения. Попробуй ещё раз.', 'bot');
    }
  }

  chatSend.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  applyLanguage('ru');

  welcomeFollowupTimer = setTimeout(() => {
    const t = TEXTS[currentLang] || TEXTS.ru;
    addMessage(t.welcomeFollowup, 'bot');
    welcomeFollowupTimer = null;
  }, 10000);
})();

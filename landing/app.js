(function () {
  const TEXTS = {
    ru: {
      title: 'Немецкие термины страховки — понятным языком',
      subtitle: 'Советы из личного опыта',
      welcome: '👋 Привет! Переведу и объясню термины страховки — на основе своего опыта. Спроси про любое поле формы, например "что такое Schadenfreiheitsklasse?"',
      placeholder: 'Напиши вопрос...',
      portal: 'Сравнить цены на страховку',
      formNote: '⚠️ Форма партнёра на немецком языке — скопируй непонятное поле в чат справа, переведу и объясню значение',
      tabForm: '📋 Форма', tabChat: '💬 Чат',
      badge1: 'Практический опыт', badge2: 'Ответ на твоём языке', badge3: 'Конфиденциально',
      formTitle: 'Форма страхового партнёра', formTitleNote: '(немецкая)',
      onlineLabel: 'Онлайн', victorName: 'Виктор'
    },
    uk: {
      title: 'Німецькі терміни страхування — зрозумілою мовою',
      subtitle: 'Поради з особистого досвіду',
      welcome: '👋 Привіт! Перекладу і поясню терміни страхування — на основі свого досвіду. Запитай про будь-яке поле форми, наприклад "що таке Schadenfreiheitsklasse?"',
      placeholder: 'Напиши питання...',
      portal: 'Порівняти ціни на страхування',
      formNote: '⚠️ Форма партнера німецькою мовою — скопіюй незрозуміле поле в чат праворуч, перекладу і поясню значення',
      tabForm: '📋 Форма', tabChat: '💬 Чат',
      badge1: 'Практичний досвід', badge2: 'Відповідь твоєю мовою', badge3: 'Конфіденційно',
      formTitle: 'Форма страхового партнера', formTitleNote: '(німецька)',
      onlineLabel: 'Онлайн', victorName: 'Віктор'
    },
    en: {
      title: 'German insurance terms — explained simply',
      subtitle: 'Tips from personal experience',
      welcome: '👋 Hi! I\'ll translate and explain insurance terms — based on my own experience. Ask about any field in the form, e.g. "what is Schadenfreiheitsklasse?"',
      placeholder: 'Type your question...',
      portal: 'Compare insurance prices',
      formNote: '⚠️ The partner form is in German — paste any unclear field into the chat on the right, I\'ll translate and explain it',
      tabForm: '📋 Form', tabChat: '💬 Chat',
      badge1: 'Practical experience', badge2: 'Answer in your language', badge3: 'Confidential',
      formTitle: 'Partner insurance form', formTitleNote: '(German)',
      onlineLabel: 'Online', victorName: 'Viktor'
    },
    de: {
      title: 'Fachbegriffe der Kfz-Versicherung — einfach erklärt',
      subtitle: 'Tipps aus persönlicher Erfahrung',
      welcome: '👋 Hallo! Ich erkläre Versicherungsbegriffe — basierend auf eigener Erfahrung. Frag nach einem Begriff aus dem Formular, z.B. "was ist die Schadenfreiheitsklasse?"',
      placeholder: 'Schreib deine Frage...',
      portal: 'Versicherungspreise vergleichen',
      formNote: '⚠️ Das Formular ist bereits auf Deutsch - bei Fragen zu einem Begriff einfach im Chat rechts fragen',
      tabForm: '📋 Formular', tabChat: '💬 Chat',
      badge1: 'Praktische Erfahrung', badge2: 'Antwort in deiner Sprache', badge3: 'Vertraulich',
      formTitle: 'Formular des Versicherungspartners', formTitleNote: '(Deutsch)',
      onlineLabel: 'Online', victorName: 'Viktor'
    },
    pl: {
      title: 'Niemieckie terminy ubezpieczeniowe — prostym językiem',
      subtitle: 'Wskazówki z osobistego doświadczenia',
      welcome: '👋 Cześć! Przetłumaczę i wyjaśnię terminy ubezpieczeniowe — na podstawie własnego doświadczenia. Zapytaj o dowolne pole formularza, np. "co to jest Schadenfreiheitsklasse?"',
      placeholder: 'Napisz pytanie...',
      portal: 'Porównaj ceny ubezpieczeń',
      formNote: '⚠️ Formularz partnera jest w języku niemieckim — wklej niejasne pole na czacie po prawej, przetłumaczę i wyjaśnię jego znaczenie',
      tabForm: '📋 Formularz', tabChat: '💬 Czat',
      badge1: 'Praktyczne doświadczenie', badge2: 'Odpowiedź w twoim języku', badge3: 'Poufnie',
      formTitle: 'Formularz partnera ubezpieczeniowego', formTitleNote: '(niemiecki)',
      onlineLabel: 'Online', victorName: 'Wiktor'
    },
    ro: {
      title: 'Termeni de asigurare germani — explicați simplu',
      subtitle: 'Sfaturi din experiența personală',
      welcome: '👋 Salut! Traduc și explic termenii de asigurare — pe baza experienței proprii. Întreabă despre orice câmp din formular, de ex. "ce este Schadenfreiheitsklasse?"',
      placeholder: 'Scrie întrebarea ta...',
      portal: 'Compară prețurile asigurărilor',
      formNote: '⚠️ Formularul partenerului este în germană — scrie în chatul din dreapta câmpul neclar, îl traduc și explic',
      tabForm: '📋 Formular', tabChat: '💬 Chat',
      badge1: 'Experiență practică', badge2: 'Răspuns în limba ta', badge3: 'Confidențial',
      formTitle: 'Formularul partenerului de asigurare', formTitleNote: '(germană)',
      onlineLabel: 'Online', victorName: 'Viktor'
    },
    hr: {
      title: 'Njemački pojmovi osiguranja — jednostavno objašnjeni',
      subtitle: 'Savjeti iz osobnog iskustva',
      welcome: '👋 Bok! Prevodim i objašnjavam pojmove osiguranja — na temelju vlastitog iskustva. Pitaj o bilo kojem polju obrasca, npr. "što je Schadenfreiheitsklasse?"',
      placeholder: 'Napiši svoje pitanje...',
      portal: 'Usporedi cijene osiguranja',
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
  const portalLink = document.getElementById('portalLink');
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

  let portalUrl = null;
  let inactivityTimer = null;
  const INACTIVITY_MS = 150000; // 2.5 минуты, синхронизировано с Telegram-ботом

  function applyLanguage(lang) {
    currentLang = lang;
    const t = TEXTS[lang] || TEXTS.ru;
    heroTitle.textContent = t.title;
    heroSubtitle.textContent = t.subtitle;
    welcomeMsg.textContent = t.welcome;
    chatInput.placeholder = t.placeholder;
    portalLink.textContent = t.portal;
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

  function addCTALink(url) {
    const t = TEXTS[currentLang] || TEXTS.ru;
    const wrap = document.createElement('div');
    wrap.className = 'msg bot';
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.className = 'cta-link';
    link.textContent = t.portal;
    wrap.appendChild(link);
    chatMessages.appendChild(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function resetInactivityTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(async () => {
      if (!portalUrl) return;
      addCTALink(portalUrl);
      try {
        await fetch('/api/chat/portal-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
      } catch (e) { /* тихо игнорируем сетевые ошибки трекинга */ }
    }, INACTIVITY_MS);
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    chatInput.value = '';
    if (inactivityTimer) clearTimeout(inactivityTimer);

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
      portalUrl = data.portalUrl;

      if (data.showCTA) {
        addCTALink(data.portalUrl);
      } else {
        resetInactivityTimer();
      }

    } catch (error) {
      loadingEl.remove();
      addMessage('⚠️ Ошибка соединения. Попробуй ещё раз.', 'bot');
    }
  }

  chatSend.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

  // Начальная ссылка в футере - подтягиваем сразу, чтобы кнопка работала даже без диалога
  fetch('/api/chat/portal-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId })
  }).then(r => r.json()).then(data => {
    portalUrl = data.portalUrl;
    portalLink.href = data.portalUrl;
  }).catch(() => {});

  applyLanguage('ru');
})();

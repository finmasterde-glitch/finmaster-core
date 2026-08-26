(function () {
  const TEXTS = {
    ru: { title: 'Помощь с автостраховкой в Германии', subtitle: 'Задай вопрос — отвечу на основе личного многолетнего опыта', welcome: '👋 Привет! Я помогу разобраться со страховкой авто в Германии. Спроси что угодно — например, "сколько стоит?" или "какую выбрать?"', placeholder: 'Напиши вопрос...', portal: 'Сравнить цены на страховку', formNote: '⚠️ Форма партнёра на немецком языке — если что-то непонятно, спроси в чате рядом, объясню на твоём языке', tabForm: '📋 Форма', tabChat: '💬 Чат' },
    uk: { title: 'Допомога з автострахуванням у Німеччині', subtitle: 'Постав питання — відповім на основі особистого багаторічного досвіду', welcome: '👋 Привіт! Допоможу розібратися зі страхуванням авто в Німеччині. Запитай будь-що — наприклад, "скільки коштує?" або "яке обрати?"', placeholder: 'Напиши питання...', portal: 'Порівняти ціни на страхування', formNote: '⚠️ Форма партнера німецькою мовою — якщо щось незрозуміло, запитай у чаті поруч, поясню твоєю мовою', tabForm: '📋 Форма', tabChat: '💬 Чат' },
    en: { title: 'Car insurance help in Germany', subtitle: 'Ask a question — I answer based on years of personal experience', welcome: '👋 Hi! I can help you figure out car insurance in Germany. Ask anything — e.g. "how much does it cost?" or "which one to choose?"', placeholder: 'Type your question...', portal: 'Compare insurance prices', formNote: '⚠️ The partner form is in German — if anything is unclear, ask in the chat next to it, I\'ll explain in your language', tabForm: '📋 Form', tabChat: '💬 Chat' },
    de: { title: 'Hilfe bei der Kfz-Versicherung in Deutschland', subtitle: 'Stell eine Frage — ich antworte auf Basis jahrelanger persönlicher Erfahrung', welcome: '👋 Hallo! Ich helfe dir bei der Kfz-Versicherung in Deutschland. Frag einfach — z.B. "wie viel kostet das?" oder "welche wählen?"', placeholder: 'Schreib deine Frage...', portal: 'Versicherungspreise vergleichen', formNote: '⚠️ Das Formular ist bereits auf Deutsch - bei Fragen einfach im Chat nebenan fragen', tabForm: '📋 Formular', tabChat: '💬 Chat' },
    pl: { title: 'Pomoc z ubezpieczeniem samochodu w Niemczech', subtitle: 'Zadaj pytanie — odpowiem na podstawie wieloletniego osobistego doświadczenia', welcome: '👋 Cześć! Pomogę ci w kwestii ubezpieczenia samochodu w Niemczech. Zapytaj o cokolwiek — np. "ile to kosztuje?" lub "które wybrać?"', placeholder: 'Napisz pytanie...', portal: 'Porównaj ceny ubezpieczeń', formNote: '⚠️ Formularz partnera jest w języku niemieckim — jeśli coś jest niejasne, zapytaj na czacie obok, wyjaśnię w twoim języku', tabForm: '📋 Formularz', tabChat: '💬 Czat' },
    ro: { title: 'Ajutor pentru asigurarea auto în Germania', subtitle: 'Pune o întrebare — răspund pe baza experienței personale de mai mulți ani', welcome: '👋 Salut! Te ajut să înțelegi asigurarea auto în Germania. Întreabă orice — de ex. "cât costă?" sau "pe care să aleg?"', placeholder: 'Scrie întrebarea ta...', portal: 'Compară prețurile asigurărilor', formNote: '⚠️ Formularul partenerului este în germană — dacă ceva nu e clar, întreabă în chatul alăturat, explic în limba ta', tabForm: '📋 Formular', tabChat: '💬 Chat' },
    hr: { title: 'Pomoć s auto osiguranjem u Njemačkoj', subtitle: 'Postavi pitanje — odgovaram na temelju dugogodišnjeg osobnog iskustva', welcome: '👋 Bok! Pomoći ću ti razumjeti auto osiguranje u Njemačkoj. Pitaj bilo što — npr. "koliko košta?" ili "koje odabrati?"', placeholder: 'Napiši svoje pitanje...', portal: 'Usporedi cijene osiguranja', formNote: '⚠️ Obrazac partnera je na njemačkom — ako nešto nije jasno, pitaj u chatu pored, objasnit ću na tvom jeziku', tabForm: '📋 Obrazac', tabChat: '💬 Chat' }
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

(function () {
  const TEXTS = {
    ru: { title: 'Помощь с автостраховкой в Германии', subtitle: 'Задай вопрос — отвечу на основе реальных данных с tarifcheck.de и check24.de', welcome: '👋 Привет! Я помогу разобраться со страховкой авто в Германии. Спроси что угодно — например, "сколько стоит?" или "какую выбрать?"', placeholder: 'Напиши вопрос...', portal: 'Сравнить цены на страховку' },
    uk: { title: 'Допомога з автострахуванням у Німеччині', subtitle: 'Постав питання — відповім на основі реальних даних з tarifcheck.de і check24.de', welcome: '👋 Привіт! Допоможу розібратися зі страхуванням авто в Німеччині. Запитай будь-що — наприклад, "скільки коштує?" або "яке обрати?"', placeholder: 'Напиши питання...', portal: 'Порівняти ціни на страхування' },
    en: { title: 'Car insurance help in Germany', subtitle: 'Ask a question — I answer based on real data from tarifcheck.de and check24.de', welcome: '👋 Hi! I can help you figure out car insurance in Germany. Ask anything — e.g. "how much does it cost?" or "which one to choose?"', placeholder: 'Type your question...', portal: 'Compare insurance prices' },
    de: { title: 'Hilfe bei der Kfz-Versicherung in Deutschland', subtitle: 'Stell eine Frage — ich antworte auf Basis echter Daten von tarifcheck.de und check24.de', welcome: '👋 Hallo! Ich helfe dir bei der Kfz-Versicherung in Deutschland. Frag einfach — z.B. "wie viel kostet das?" oder "welche wählen?"', placeholder: 'Schreib deine Frage...', portal: 'Versicherungspreise vergleichen' },
    pl: { title: 'Pomoc z ubezpieczeniem samochodu w Niemczech', subtitle: 'Zadaj pytanie — odpowiem na podstawie danych z tarifcheck.de i check24.de', welcome: '👋 Cześć! Pomogę ci w kwestii ubezpieczenia samochodu w Niemczech. Zapytaj o cokolwiek — np. "ile to kosztuje?" lub "które wybrać?"', placeholder: 'Napisz pytanie...', portal: 'Porównaj ceny ubezpieczeń' }
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

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  document.getElementById('langSwitch').addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-btn');
    if (btn) applyLanguage(btn.dataset.lang);
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

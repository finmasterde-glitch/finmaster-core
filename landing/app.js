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

  // ===== Модальные окна: Impressum / Datenschutz / Kontakt / AGB =====
  // ВАЖНО: тексты ниже - ЧЕРНОВИК с плейсхолдерами [ЗАПОЛНИ: ...] вместо
  // реальных данных. Перед публикацией: 1) заполнить реальные данные,
  // 2) в идеале показать юристу, особенно раздел Datenschutz (там есть
  // нюанс с передачей данных в США через Claude API).
  const LEGAL_CONTENT = {
    impressum: `
      <h2>Impressum</h2>
      <p>Angaben gemäß § 5 DDG</p>
      <p class="todo">[ЗАПОЛНИ: Vollständiger Name / Firma]</p>
      <p class="todo">[ЗАПОЛНИ: Straße Hausnummer]</p>
      <p class="todo">[ЗАПОЛНИ: PLZ Ort]</p>
      <h3>Kontakt</h3>
      <p class="todo">[ЗАПОЛНИ: Telefonnummer]</p>
      <p class="todo">[ЗАПОЛНИ: E-Mail-Adresse]</p>
      <h3>Hinweis zur Tätigkeit</h3>
      <p>Dieses Angebot dient ausschließlich der allgemeinen Information über und der
      sprachlichen Übersetzung von Begriffen der Kfz-Versicherung in Deutschland.
      Es handelt sich nicht um eine Versicherungsvermittlung oder Versicherungsberatung
      im Sinne der §§ 34d GewO, 59 ff. VVG. Der Anbieter tritt als sogenannter
      Tippgeber auf und ist nicht berechtigt, Versicherungsverträge zu vermitteln,
      Beratungsleistungen zu erbringen oder Anträge entgegenzunehmen.</p>
      <p class="todo">[ЗАПОЛНИ, если есть: Handelsregisternummer, USt-IdNr.]</p>
    `,
    datenschutz: `
      <h2>Datenschutzerklärung</h2>
      <p class="todo">[ЧЕРНОВИК - обязательно проверь с юристом перед публикацией]</p>

      <h3>§1 Verantwortlicher</h3>
      <p class="todo">[ЗАПОЛНИ: Name, Adresse, E-Mail - siehe Impressum]</p>

      <h3>§2 Allgemeines zur Datenverarbeitung</h3>
      <p>Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit
      dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und
      Leistungen erforderlich ist. Die Verarbeitung erfolgt auf Grundlage von Art. 6
      Abs. 1 lit. b DSGVO (Erfüllung einer angefragten Leistung) sowie, soweit
      technisch erforderlich, Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse am
      sicheren und funktionsfähigen Betrieb der Website).</p>

      <h3>§3 Hosting und Server-Logfiles</h3>
      <p>Diese Website wird bei Vercel Inc. (USA) gehostet. Beim Aufruf der Seite
      erhebt Vercel technisch bedingt Server-Logfiles (z. B. IP-Adresse, Zeitpunkt der
      Anfrage, aufgerufene Seite, Browsertyp). Diese Verarbeitung dient dem sicheren
      und stabilen Betrieb der Website. Auch hier findet eine Datenübermittlung in
      ein Drittland (USA) statt, abgesichert durch Standardvertragsklauseln
      (Art. 46 DSGVO).</p>

      <h3>§4 Chat-Funktion</h3>
      <p>Wenn Sie den Chat-Assistenten auf dieser Website nutzen, werden die von Ihnen
      eingegebenen Nachrichten sowie die Antworten des Assistenten verarbeitet, um
      Ihre Frage zu beantworten. Zur Erzeugung der Antworten werden Ihre Nachrichten
      an Anthropic PBC (USA) über deren Claude-API übermittelt.</p>
      <p>Da Anthropic seinen Sitz in den USA hat, findet auch hier eine Datenübermittlung
      in ein Drittland außerhalb der EU/des EWR statt. Diese erfolgt auf Grundlage von
      Standardvertragsklauseln (Art. 46 DSGVO).</p>
      <p class="todo">[ЗАПОЛНИ: как долго реально хранится история сообщений - сейчас
      технически используется временное хранилище, которое может очищаться при
      перезапуске сервера; уточни и опиши актуальную политику хранения]</p>

      <h3>§5 Eingebundenes Formular des Versicherungspartners</h3>
      <p>Auf dieser Seite ist ein Vergleichsformular unseres Versicherungspartners
      eingebunden (iframe von form.partner-versicherung.de). Beim Laden dieses
      Formulars kann der Partner-Anbieter eigenständig Cookies setzen und Daten
      verarbeiten. Diese Verarbeitung erfolgt außerhalb unseres Einflussbereichs und
      unterliegt der eigenen Datenschutzerklärung des Partners.</p>

      <h3>§6 Cookies</h3>
      <p class="todo">[ЗАПОЛНИ: если добавите собственный Cookie-Banner для сайта -
      опишите здесь категории используемых cookies (технически необходимые /
      аналитика / маркетинг) согласно §25 TDDDG]</p>

      <h3>§7 Empfänger der Daten</h3>
      <p>Empfänger Ihrer Daten sind, je nach genutzter Funktion: Anthropic PBC (USA) -
      Verarbeitung von Chat-Nachrichten zur Antwortgenerierung; Vercel Inc. (USA) -
      Hosting-Infrastruktur; sowie der Betreiber des eingebundenen Vergleichsformulars
      (siehe §5) - eigenständige Datenverarbeitung gemäß dessen Datenschutzerklärung.</p>

      <h3>§8 Ihre Rechte</h3>
      <p>Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO),
      Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO),
      Datenübertragbarkeit (Art. 20 DSGVO) und Widerspruch gegen die Verarbeitung
      (Art. 21 DSGVO). Wenden Sie sich hierzu an die oben in §1 genannte
      Kontaktadresse.</p>

      <h3>§9 Beschwerderecht bei einer Aufsichtsbehörde</h3>
      <p>Sie haben unbeschadet eines anderweitigen verwaltungsrechtlichen oder
      gerichtlichen Rechtsbehelfs das Recht auf Beschwerde bei einer
      Datenschutz-Aufsichtsbehörde, insbesondere in dem Mitgliedstaat Ihres
      gewöhnlichen Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen
      Verstoßes, wenn Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden
      personenbezogenen Daten gegen die DSGVO verstößt.</p>

      <h3>§10 Änderungen dieser Datenschutzerklärung</h3>
      <p>Diese Datenschutzerklärung kann bei Bedarf angepasst werden, etwa bei
      Änderungen der Website-Funktionen oder der Rechtslage. Es gilt jeweils die
      zum Nutzungszeitpunkt aktuelle Fassung.</p>
    `,
    kontakt: `
      <h2>Kontakt</h2>
      <p class="todo">[ЗАПОЛНИ: E-Mail-Adresse]</p>
      <p class="todo">[ЗАПОЛНИ: Telefonnummer, falls gewünscht]</p>
      <p>Weitere Angaben finden Sie im Impressum.</p>
    `,
    agb: `
      <h2>Allgemeine Geschäftsbedingungen</h2>
      <p class="todo">[ЧЕРНОВИК - настоятельно рекомендуется проверить у юриста перед публикацией]</p>

      <h3>§1 Anbieter und Geltungsbereich</h3>
      <p class="todo">[ЗАПОЛНИ: Vollständiger Name / Firma - siehe Impressum]</p>
      <p>Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung dieser Website
      und des darauf angebotenen Chat-Assistenten sowie des eingebundenen
      Vergleichsformulars.</p>

      <h3>§2 Leistungsbeschreibung</h3>
      <p>Der Anbieter stellt auf dieser Website kostenlos zwei Funktionen zur Verfügung:</p>
      <p>1. Einen Chat-Assistenten, der deutsche Fachbegriffe rund um die Kfz-Versicherung
      übersetzt und erklärt sowie persönliche Erfahrungen zum Prozess der
      Versicherungssuche in Deutschland weitergibt.</p>
      <p>2. Ein eingebundenes Vergleichsformular eines Versicherungspartners
      (form.partner-versicherung.de), über das Nutzer selbstständig Tarife vergleichen
      können.</p>

      <h3>§3 Kein Beratungs- oder Vermittlungsvertrag</h3>
      <p>Der Anbieter tritt ausschließlich als sogenannter Tippgeber auf und ist kein
      Versicherungsvermittler oder Versicherungsberater im Sinne der §§ 34d GewO, 59 ff.
      VVG. Die Nutzung des Chat-Assistenten begründet keinen Beratungsvertrag. Die
      bereitgestellten Informationen basieren auf allgemeinem Wissen und persönlicher
      Erfahrung und stellen keine individuelle, auf die persönliche Situation des Nutzers
      zugeschnittene Versicherungsberatung dar.</p>

      <h3>§4 Vertragsschluss mit Dritten</h3>
      <p>Kommt es über das eingebundene Vergleichsformular zum Abschluss eines
      Versicherungsvertrages, so kommt dieser Vertrag ausschließlich zwischen dem
      Nutzer und dem jeweiligen Versicherungspartner bzw. Versicherungsunternehmen
      zustande. Der Anbieter dieser Website ist an diesem Vertrag nicht beteiligt und
      übernimmt hierfür keine Haftung.</p>

      <h3>§5 Einsatz von KI-Technologie</h3>
      <p>Die Antworten des Chat-Assistenten werden mithilfe eines KI-Sprachmodells
      (Claude von Anthropic) generiert. Trotz sorgfältiger Ausgestaltung können die
      Antworten im Einzelfall unvollständig oder fehlerhaft sein. Für die Richtigkeit,
      Vollständigkeit oder Aktualität der bereitgestellten Informationen wird keine
      Gewähr übernommen. Nutzer sollten wichtige Angaben stets zusätzlich anhand
      offizieller Quellen oder direkt beim jeweiligen Versicherer prüfen.</p>

      <h3>§6 Haftungsausschluss</h3>
      <p>Der Anbieter haftet nicht für Schäden, die aus der Nutzung oder Nichtnutzung der
      auf dieser Website bereitgestellten Informationen entstehen, es sei denn, der
      Schaden beruht auf Vorsatz oder grober Fahrlässigkeit des Anbieters. Für Inhalte
      und Funktionsweise des eingebundenen Vergleichsformulars ist ausschließlich der
      jeweilige Versicherungspartner verantwortlich.</p>

      <h3>§7 Datenverarbeitung</h3>
      <p>Informationen zur Verarbeitung personenbezogener Daten - einschließlich der
      Übermittlung von Chat-Nachrichten an Anthropic (USA) zur Beantwortung - finden
      Sie in der separaten Datenschutzerklärung.</p>

      <h3>§8 Änderungen dieser AGB</h3>
      <p>Der Anbieter behält sich vor, diese AGB bei Bedarf anzupassen, etwa bei
      Änderungen des Angebots oder der Rechtslage. Es gilt jeweils die zum
      Nutzungszeitpunkt aktuelle Fassung.</p>

      <h3>§9 Anwendbares Recht</h3>
      <p>Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
      UN-Kaufrechts.</p>

      <h3>§10 Salvatorische Klausel</h3>
      <p>Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt
      die Wirksamkeit der übrigen Bestimmungen hiervon unberührt.</p>
    `
  };

  const modalOverlay = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');

  function closeModal() {
    modalOverlay.classList.remove('active');
  }

  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.modal;
      modalContent.innerHTML = LEGAL_CONTENT[key] || '';
      modalOverlay.classList.add('active');
    });
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  applyLanguage('ru');

  welcomeFollowupTimer = setTimeout(() => {
    const t = TEXTS[currentLang] || TEXTS.ru;
    addMessage(t.welcomeFollowup, 'bot');
    welcomeFollowupTimer = null;
  }, 10000);
})();

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const LANGUAGE_NAMES = {
  ru: 'русском',
  uk: 'украинском',
  en: 'английском',
  de: 'немецком',
  pl: 'польском'
};

class ContentGenerator {
  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY;
    this.baseUrl = 'https://api.anthropic.com/v1';
    this.knowledgeBase = this.loadKnowledgeBase();
  }

  loadKnowledgeBase() {
    try {
      const kbPath = path.join(__dirname, '../knowledge-base.json');
      if (fs.existsSync(kbPath)) {
        return JSON.parse(fs.readFileSync(kbPath, 'utf-8'));
      }
      console.warn('⚠️ Knowledge base не найдена');
      return null;
    } catch (error) {
      console.error('❌ Ошибка загрузки knowledge base:', error);
      return null;
    }
  }

  /**
   * Ищет релевантную информацию в knowledge base.
   * База сейчас на русском - для других языков Claude переводит на лету при ответе.
   */
  searchKnowledgeBase(query) {
    if (!this.knowledgeBase) return null;

    const queryLower = query.toLowerCase();
    const relevantInfo = [];

    if (this.knowledgeBase.quick_answers) {
      Object.keys(this.knowledgeBase.quick_answers).forEach(key => {
        const item = this.knowledgeBase.quick_answers[key];
        if (key.includes(queryLower) ||
            item.title?.toLowerCase().includes(queryLower) ||
            item.short?.toLowerCase().includes(queryLower)) {
          relevantInfo.push({ type: 'quick_answer', title: item.title, content: item.short || item.title });
        }
      });
    }

    if (this.knowledgeBase.фaq) {
      this.knowledgeBase.фaq.forEach(item => {
        if (item.keywords?.some(kw => queryLower.includes(kw))) {
          relevantInfo.push({ type: 'faq', question: item.q, answer: item.a });
        }
      });
    }

    const sections = [
      'типы_страховок', 'ошибки_иммигрантов', 'советы_по_экономии',
      'первая_страховка_для_иммигранта', 'документы_для_страховки',
      'регистрация_машины'
    ];
    sections.forEach(section => {
      const sectionData = this.knowledgeBase[section];
      if (sectionData && typeof sectionData === 'object') {
        Object.values(sectionData).forEach(item => {
          if (item.название?.toLowerCase().includes(queryLower)) {
            relevantInfo.push({ type: section, title: item.название, content: item });
          }
        });
      }
    });

    return relevantInfo.length > 0 ? relevantInfo : null;
  }

  formatKnowledgeForClaude(knowledgeInfo) {
    if (!knowledgeInfo) return '';
    let formatted = '\n📚 ИНФОРМАЦИЯ ИЗ БАЗЫ ЗНАНИЙ (на русском, переведи под язык ответа):\n' + '='.repeat(50) + '\n';
    knowledgeInfo.slice(0, 3).forEach((info, i) => {
      if (info.type === 'faq') {
        formatted += `\n${i + 1}. ВОПРОС: ${info.question}\n   ОТВЕТ: ${info.answer}\n`;
      } else {
        const content = typeof info.content === 'object' ? JSON.stringify(info.content).substring(0, 200) + '...' : info.content;
        formatted += `\n${i + 1}. ${info.title}\n   ${content}\n`;
      }
    });
    return formatted + '='.repeat(50) + '\n';
  }

  /**
   * Генерирует ответ на вопрос пользователя.
   * @param {string} userQuestion
   * @param {object} options - { includeCTA: boolean, language: 'ru'|'uk'|'en'|'de'|'pl' }
   */
  async generateAnswer(userQuestion, options = {}) {
    const { includeCTA = false, language = 'ru' } = options;
    const langName = LANGUAGE_NAMES[language] || 'русском';

    const relevantInfo = this.searchKnowledgeBase(userQuestion);
    const knowledgeContext = this.formatKnowledgeForClaude(relevantInfo);

    const prompt = `
Ты Виктор - консультант по автострахованию (Kfz-Versicherung) в Германии. Ты сам когда-то
переехал в Германию и переносил свой водительский стаж сюда, за эти годы сменил несколько машин
и много раз менял страховку - знаешь эту тему не понаслышке, а по личному опыту прохождения всего
этого пути. Общаешься тепло и по-дружески, как хороший знакомый, а не как справочная служба -
используешь живой разговорный язык, можешь пошутить или проявить сочувствие, если человек в
непростой ситуации (новый в стране, не понимает бюрократию). Иногда к месту можешь упомянуть свой
опыт ("я тоже когда-то...", "в моей практике..."), но не превращай это в главную тему разговора.
Отвечай на ${langName} языке.
${knowledgeContext}

Вопрос пользователя: "${userQuestion}"

Требования:
- Если вопрос НЕ связан с автострахованием в Германии (посторонние темы - погода, отношения,
  другие страны, другие виды страховки типа медицинской и т.д.) - НЕ пытайся отвечать по существу.
  Вместо этого мягко и по-дружески поясни, что ты специализируешься именно на Kfz-Versicherung,
  и предложи задать вопрос по теме. Например в духе: "Слушай, это не совсем моя тема 😊 я как раз
  специалист по автостраховке в Германии - если у тебя есть вопрос про неё, с радостью помогу!"
- Если вопрос по теме, но конкретного ответа в базе знаний нет - НЕ выдумывай цифры и факты.
  Мягко скажи, что для точного ответа лучше свериться на портале сравнения цен, но при этом дай
  общий контекст из своего опыта, если он у тебя есть
- Отвечай как эксперт: используй профессиональные термины (Haftpflicht, Vollkasko,
  Versicherungsklasse и т.д.), но сразу поясняй их простыми словами - баланс между
  экспертностью и понятностью для новичка
- Правила и цены в Германии постоянно меняются - когда уместно, подчёркивай, что важно
  своевременно консультироваться и регулярно проверять актуальные цены на автостраховку,
  чтобы не переплачивать
- Ответь по существу и в меру подробно (обычно 2-5 предложений, больше - если тема сложная
  и заслуживает разбора)
- ИСПОЛЬЗУЙ информацию из базы знаний выше, переведи её на ${langName} естественно
- Используй эмодзи умеренно, для выделения важных моментов, не через каждое слово
- НЕ упоминай названия конкретных сайтов сравнения (tarifcheck, check24 и т.п.) - просто
  говори "портал сравнения" или "сравнение цен", без брендов
- НЕ добавляй ссылки и призывы к действию - это добавится отдельно

Ответь ТОЛЬКО текстом на ${langName} языке, никакого JSON.
`;

    try {
      const response = await axios.post(
        `${this.baseUrl}/messages`,
        {
          model: 'claude-sonnet-5',
          max_tokens: 512,
          messages: [{ role: 'user', content: prompt }]
        },
        {
          headers: {
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          }
        }
      );

      const answer = response.data.content[0].text;
      const portalUrl = process.env.AFFILIATE_PORTAL_URL;

      if (!includeCTA) {
        return { text: answer, includePortalLink: false, portalUrl };
      }

      return { text: this.appendCTA(answer, language), includePortalLink: true, portalUrl };

    } catch (error) {
      console.error('Error generating answer:', error.message);
      return this.getFallbackAnswer(userQuestion, includeCTA, language);
    }
  }

  appendCTA(answerText, language = 'ru') {
    const portalUrl = process.env.AFFILIATE_PORTAL_URL;

    const ctaBlocks = {
      ru: `\n\n👇 Переходи по ссылке и узнай свою цену за 2 минуты:\n${portalUrl}\n\n⚠️ Если что-то непонятно при заполнении формы - просто напиши мне, помогу!`,
      uk: `\n\n👇 Переходь за посиланням і дізнайся свою ціну за 2 хвилини:\n${portalUrl}\n\n⚠️ Якщо щось незрозуміло при заповненні форми - просто напиши мені, допоможу!`,
      en: `\n\n👇 Follow the link and get your price in 2 minutes:\n${portalUrl}\n\n⚠️ If anything in the form is unclear - just write to me, I'll help!`,
      de: `\n\n👇 Klicke auf den Link und erfahre deinen Preis in 2 Minuten:\n${portalUrl}\n\n⚠️ Falls im Formular etwas unklar ist - schreib mir einfach, ich helfe!`,
      pl: `\n\n👇 Kliknij w link i poznaj swoją cenę w 2 minuty:\n${portalUrl}\n\n⚠️ Jeśli coś w formularzu jest niejasne - po prostu napisz, pomogę!`
    };

    return answerText + (ctaBlocks[language] || ctaBlocks.ru);
  }

  getFallbackAnswer(question, includeCTA = false, language = 'ru') {
    const portalUrl = process.env.AFFILIATE_PORTAL_URL;
    const fallbacks = {
      ru: '😊 Хм, сейчас туговато с ответом - можешь переформулировать вопрос? Расскажи подробнее, что тебя интересует про автостраховку в Германии, постараюсь разобраться вместе с тобой.',
      uk: '😊 Хм, зараз важкувато з відповіддю - можеш переформулювати питання? Розкажи детальніше, що тебе цікавить про автострахування в Німеччині, спробуємо розібратися разом.',
      en: "😊 Having a bit of trouble with that one - could you rephrase? Tell me more about what you'd like to know regarding car insurance in Germany, happy to help.",
      de: '😊 Da hakt es gerade etwas - kannst du die Frage anders formulieren? Erzähl mir mehr, was dich bei der Kfz-Versicherung in Deutschland interessiert.',
      pl: '😊 Trochę mi trudno z odpowiedzią - możesz przeformułować pytanie? Opowiedz więcej, co cię interesuje w kwestii ubezpieczenia samochodu w Niemczech.'
    };

    const answer = fallbacks[language] || fallbacks.ru;

    if (!includeCTA) {
      return { text: answer, includePortalLink: false, portalUrl };
    }
    return { text: this.appendCTA(answer, language), includePortalLink: true, portalUrl };
  }
}

module.exports = ContentGenerator;

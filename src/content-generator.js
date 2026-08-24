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

    const sections = ['типы_страховок', 'ошибки_иммигрантов', 'советы_по_экономии'];
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
Ты дружелюбный эксперт по страховке в Германии для иммигрантов.
Отвечай на ${langName} языке, просто и понятно, разговорным тоном.
${knowledgeContext}

Вопрос пользователя: "${userQuestion}"

Требования:
- Ответь кратко (2-4 предложения)
- ИСПОЛЬЗУЙ информацию из базы знаний выше, переведи её на ${langName} естественно
- Используй эмодзи для выделения важных моментов
- НЕ добавляй ссылки и призывы к действию - это добавится отдельно
- Если информации в базе нет - скажи что нужно свериться на портале сравнения

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
      ru: '🤔 Интересный вопрос! Попробуй уточнить, что именно тебя интересует про страховку.',
      uk: '🤔 Цікаве питання! Спробуй уточнити, що саме тебе цікавить про страхування.',
      en: '🤔 Good question! Could you clarify what exactly you want to know about the insurance?',
      de: '🤔 Gute Frage! Kannst du genauer sagen, was dich an der Versicherung interessiert?',
      pl: '🤔 Ciekawe pytanie! Sprecyzuj, co dokładnie cię interesuje w ubezpieczeniu.'
    };

    const answer = fallbacks[language] || fallbacks.ru;

    if (!includeCTA) {
      return { text: answer, includePortalLink: false, portalUrl };
    }
    return { text: this.appendCTA(answer, language), includePortalLink: true, portalUrl };
  }
}

module.exports = ContentGenerator;

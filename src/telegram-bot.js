const TelegramBot = require('node-telegram-bot-api');

const MESSAGES_BEFORE_CTA = 4;
const INACTIVITY_TIMEOUT_MS = 150000; // 2.5 минуты

function createTelegramBot({ contentGenerator, database, analytics }) {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
  const portalUrl = process.env.AFFILIATE_PORTAL_URL;

  const userMessageCounts = new Map();
  const userInactivityTimers = new Map();

  const bumpMessageCount = (chatId) => {
    const count = (userMessageCounts.get(chatId) || 0) + 1;
    userMessageCounts.set(chatId, count);
    return count;
  };
  const resetMessageCount = (chatId) => userMessageCounts.set(chatId, 0);

  const clearInactivityTimer = (chatId) => {
    const existing = userInactivityTimers.get(chatId);
    if (existing) {
      clearTimeout(existing);
      userInactivityTimers.delete(chatId);
    }
  };

  const scheduleInactivityNudge = (chatId, userId) => {
    clearInactivityTimer(chatId);
    const timer = setTimeout(() => {
      bot.sendMessage(chatId, `
Кстати 😊 если уже прикидываешь стоимость страховки - вот ссылка на сравнение, узнаешь свою цену за 2 минуты:

${portalUrl}

Если что-то будет непонятно в форме - просто напиши, объясню что и куда вводить.
      `, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔗 Узнать мою цену', url: portalUrl }],
            [{ text: '📝 Помощь с заполнением', callback_data: 'need_help' }]
          ]
        }
      });
      resetMessageCount(chatId);
      userInactivityTimers.delete(chatId);
      analytics.trackClick({ userId, type: 'inactivity_nudge_sent', timestamp: new Date() });
    }, INACTIVITY_TIMEOUT_MS);
    userInactivityTimers.set(chatId, timer);
  };

  // ===== /start =====
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || 'Друг';

    bot.sendMessage(chatId, `
👋 Привет, ${userName}!

Я FinMaster - помощник по Kfz-Versicherung в Германии 🇩🇪

Просто напиши любой вопрос про страховку - "Сколько стоит?", "Какую выбрать?", "Как сэкономить?" - и я отвечу на основе реальной информации с tarifcheck.de и check24.de.

📞 Команды:
/портал - сразу на сравнение цен
/сэкономить - способы сэкономить €100-300/год
    `, {
      reply_markup: {
        inline_keyboard: [[{ text: '🔗 Узнать цену на страховку', url: portalUrl }]],
        keyboard: [
          [{ text: '💰 Сколько стоит?' }],
          [{ text: '📊 Какую выбрать?' }]
        ],
        resize_keyboard: true
      }
    });

    database.saveUser({ userId: msg.from.id, username: msg.from.username, firstName: userName, createdAt: new Date() });
    analytics.trackUserAction({ userId: msg.from.id, action: 'started_bot', timestamp: new Date() });
    resetMessageCount(chatId);
    clearInactivityTimer(chatId);
  });

  // ===== /портал =====
  bot.onText(/\/портал|сравнить|сравнение/i, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `
✅ Сравни цены от 20+ страховых компаний за 2 минуты:

${portalUrl}

⚠️ Не понимаешь что-то в форме? Напиши мне - помогу!
    `, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔗 Сравнить цены', url: portalUrl }],
          [{ text: '📝 Как заполнить форму?', callback_data: 'help_form' }]
        ]
      }
    });
    analytics.trackClick({ userId: msg.from.id, type: 'portal_command', timestamp: new Date() });
    resetMessageCount(chatId);
    clearInactivityTimer(chatId);
  });

  // ===== /сэкономить =====
  bot.onText(/\/сэкономить|экономи/i, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `
💰 7 способов сэкономить на страховке:

1️⃣ Выше самовыплата = дешевле полис (экономия €50-100)
2️⃣ Класс вождения (SF) - 10% скидка через год без аварий
3️⃣ Низкий годовой пробег
4️⃣ Не бери полный КАСКО на старые машины
5️⃣ Меняй страховку в декабре
6️⃣ Передай класс вождения из своей страны
7️⃣ Сравни минимум 3-5 вариантов

👇 Узнай точную цену для своей машины:
    `, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '💰 Узнать мою цену', url: portalUrl }],
          [{ text: '📝 Помощь с заполнением', callback_data: 'help_savings' }]
        ]
      }
    });
    analytics.trackClick({ userId: msg.from.id, type: 'savings_tips_command', timestamp: new Date() });
    resetMessageCount(chatId);
    clearInactivityTimer(chatId);
  });

  // ===== Произвольные сообщения =====
  bot.on('message', async (msg) => {
    if (!msg.text || msg.text.startsWith('/')) return;
    const chatId = msg.chat.id;
    const userMessage = msg.text;

    try {
      bot.sendChatAction(chatId, 'typing');

      const messageCount = bumpMessageCount(chatId);
      const shouldShowCTA = messageCount >= MESSAGES_BEFORE_CTA;

      const answer = await contentGenerator.generateAnswer(userMessage, { includeCTA: shouldShowCTA, language: 'ru' });

      if (shouldShowCTA) {
        bot.sendMessage(chatId, answer.text, {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🔗 Узнать мою цену', url: portalUrl }],
              [{ text: '📝 Помощь с заполнением', callback_data: 'need_help' }]
            ]
          }
        });
        resetMessageCount(chatId);
        clearInactivityTimer(chatId);
        analytics.trackClick({ userId: msg.from.id, type: 'answer_with_portal_link', content: userMessage, timestamp: new Date() });
      } else {
        bot.sendMessage(chatId, answer.text, {
          reply_markup: { inline_keyboard: [[{ text: '🔗 Сравнить цены', url: portalUrl }]] }
        });
        scheduleInactivityNudge(chatId, msg.from.id);
        analytics.trackUserAction({ userId: msg.from.id, action: 'question_answered_no_cta', timestamp: new Date() });
      }

      database.saveMessage({ userId: msg.from.id, userMessage, botResponse: answer.text, timestamp: new Date() });

    } catch (error) {
      console.error('Error processing message:', error);
      bot.sendMessage(chatId, '😅 Ошибка обработки. Попробуй ещё раз или напиши другой вопрос.');
    }
  });

  // ===== Callback кнопки =====
  bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;
    bot.answerCallbackQuery(callbackQuery.id);

    const helpTexts = {
      need_help: '📝 Обычно нужны: марка/модель, год выпуска, мощность в кВт (поле P.2 в Fahrzeugschein), возраст и стаж вождения. Напиши данные своей машины - помогу разобраться!',
      help_form: '📝 1. Марка/модель из списка\n2. Год выпуска - из техпаспорта\n3. Мощность (кВт) - поле P.2\n4. Регион прописки\n5. Возраст и стаж вождения\n\nЕсть вопрос по конкретному полю - спрашивай.',
      help_savings: '📝 Для скидки: указывай самовыплату €300 (не €0), обязательно укажи стаж вождения из другой страны если есть, не завышай годовой пробег.'
    };

    bot.sendMessage(chatId, helpTexts[data] || 'Напиши свой вопрос, помогу! 😊', {
      reply_markup: { inline_keyboard: [[{ text: '🔗 Перейти на портал', url: portalUrl }]] }
    });

    analytics.trackUserAction({ userId: callbackQuery.from.id, action: `callback_${data}`, timestamp: new Date() });
  });

  console.log('🤖 Telegram bot запущен (@finmasterde)');
  return bot;
}

module.exports = createTelegramBot;

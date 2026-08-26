const TelegramBot = require('node-telegram-bot-api');

const MESSAGES_BEFORE_CTA = 4;

/**
 * Webhook-режим для serverless (Vercel).
 *
 * ВАЖНО: здесь НЕ используются bot.onText()/bot.on('message') - тот вариант
 * основан на EventEmitter и НЕ дожидается завершения async-обработчиков.
 * На обычном сервере это не страшно (процесс живёт постоянно, обработка
 * доканчивается в фоне), но на serverless функция может быть заморожена/убита
 * сразу после того, как Express отправит ответ Telegram - а обработчик
 * 'message' в это время ещё ждёт ответ от Claude API. В итоге апдейт
 * приходит, но ответ пользователю никогда не отправляется.
 *
 * Вместо этого экспортируется handleUpdate(update) - обычная async-функция,
 * которую server.js вызывает через await ПЕРЕД тем как ответить Telegram
 * 200 OK. Это гарантирует, что вся обработка (включая вызов Claude API и
 * bot.sendMessage) успевает завершиться до того, как функция может быть
 * остановлена.
 *
 * Таймер "напоминание после 2.5 мин молчания" по той же причине не
 * реализован - serverless-функция не может держать активный setTimeout
 * между отдельными запросами.
 */
function createTelegramBot({ contentGenerator, database, analytics }) {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN); // без polling, без webHook - только ручные вызовы методов
  const portalUrl = process.env.AFFILIATE_PORTAL_URL;

  // Счётчик сообщений в памяти - переживает только пока "тёплая" функция жива.
  const userMessageCounts = new Map();
  const bumpMessageCount = (chatId) => {
    const count = (userMessageCounts.get(chatId) || 0) + 1;
    userMessageCounts.set(chatId, count);
    return count;
  };
  const resetMessageCount = (chatId) => userMessageCounts.set(chatId, 0);

  const helpTexts = {
    need_help: '📝 Обычно нужны: марка/модель, год выпуска, мощность в кВт (поле P.2 в Fahrzeugschein), возраст и стаж вождения. Напиши данные своей машины - помогу разобраться!',
    help_form: '📝 1. Марка/модель из списка\n2. Год выпуска - из техпаспорта\n3. Мощность (кВт) - поле P.2\n4. Регион прописки\n5. Возраст и стаж вождения\n\nЕсть вопрос по конкретному полю - спрашивай.',
    help_savings: '📝 Для скидки: указывай самовыплату €300 (не €0), обязательно укажи стаж вождения из другой страны если есть, не завышай годовой пробег.'
  };

  async function handleStart(msg) {
    const chatId = msg.chat.id;
    const userName = msg.from.first_name || 'Друг';

    await bot.sendMessage(chatId, `
👋 Привет, ${userName}!

Я FinMaster - помощник по Kfz-Versicherung в Германии 🇩🇪

Просто напиши любой вопрос про страховку - "Сколько стоит?", "Какую выбрать?", "Как сэкономить?" - отвечу на основе своего многолетнего опыта.

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

    await database.saveUser({ userId: msg.from.id, username: msg.from.username, firstName: userName, createdAt: new Date() });
    analytics.trackUserAction({ userId: msg.from.id, action: 'started_bot', timestamp: new Date() });
    resetMessageCount(chatId);
  }

  async function handlePortal(msg) {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, `
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
  }

  async function handleSavings(msg) {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, `
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
  }

  async function handleQuestion(msg) {
    const chatId = msg.chat.id;
    const userMessage = msg.text;

    try {
      await bot.sendChatAction(chatId, 'typing');

      const messageCount = bumpMessageCount(chatId);
      const shouldShowCTA = messageCount >= MESSAGES_BEFORE_CTA;

      const answer = await contentGenerator.generateAnswer(userMessage, { includeCTA: shouldShowCTA, language: 'ru' });

      if (answer.ctaShown) {
        await bot.sendMessage(chatId, answer.text, {
          reply_markup: {
            inline_keyboard: [
              [{ text: '🔗 Узнать мою цену', url: portalUrl }],
              [{ text: '📝 Помощь с заполнением', callback_data: 'need_help' }]
            ]
          }
        });
        resetMessageCount(chatId);
        analytics.trackClick({ userId: msg.from.id, type: 'answer_with_portal_link', content: userMessage, timestamp: new Date() });
      } else {
        await bot.sendMessage(chatId, answer.text, {
          reply_markup: { inline_keyboard: [[{ text: '🔗 Сравнить цены', url: portalUrl }]] }
        });
        analytics.trackUserAction({ userId: msg.from.id, action: 'question_answered_no_cta', timestamp: new Date() });
      }

      await database.saveMessage({ userId: msg.from.id, userMessage, botResponse: answer.text, timestamp: new Date() });

    } catch (error) {
      console.error('Error processing message:', error);
      await bot.sendMessage(chatId, '😅 Ошибка обработки. Попробуй ещё раз или напиши другой вопрос.');
    }
  }

  async function handleCallbackQuery(callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const data = callbackQuery.data;

    await bot.answerCallbackQuery(callbackQuery.id);
    await bot.sendMessage(chatId, helpTexts[data] || 'Напиши свой вопрос, помогу! 😊', {
      reply_markup: { inline_keyboard: [[{ text: '🔗 Перейти на портал', url: portalUrl }]] }
    });
    analytics.trackUserAction({ userId: callbackQuery.from.id, action: `callback_${data}`, timestamp: new Date() });
  }

  /**
   * Главная точка входа - server.js должен делать `await handleUpdate(update)`
   * перед тем как ответить Telegram 200 OK.
   */
  async function handleUpdate(update) {
    try {
      if (update.callback_query) {
        return await handleCallbackQuery(update.callback_query);
      }

      const msg = update.message;
      if (!msg || !msg.text) return;

      if (/^\/start/.test(msg.text)) return await handleStart(msg);
      if (/\/портал|сравнить|сравнение/i.test(msg.text)) return await handlePortal(msg);
      if (/\/сэкономить|экономи/i.test(msg.text)) return await handleSavings(msg);
      if (msg.text.startsWith('/')) return; // неизвестная команда - молча игнорируем

      return await handleQuestion(msg);

    } catch (error) {
      console.error('❌ handleUpdate error:', error);
    }
  }

  console.log('🤖 Telegram bot создан (webhook-режим, @finmasterde)');
  return { bot, handleUpdate };
}

module.exports = createTelegramBot;

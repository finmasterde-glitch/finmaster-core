require('dotenv').config();
const express = require('express');
const path = require('path');

const ContentGenerator = require('./content-generator');
const Database = require('./database');
const Analytics = require('./analytics');
const createTelegramBot = require('./telegram-bot');
const createChatApiRouter = require('./chat-api');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../landing')));

const database = new Database();
const analytics = new Analytics();
const contentGenerator = new ContentGenerator();

// ===== Telegram бот (webhook-режим) =====
const { bot, handleUpdate } = createTelegramBot({ contentGenerator, database, analytics });

// Telegram шлёт сюда апдейты POST-запросом - секретный кусок пути защищает
// роут от посторонних запросов (Telegram сам подставит его, если передать
// такой же путь в setWebHook).
//
// КРИТИЧНО: обязательно await handleUpdate() перед res.sendStatus(200).
// На serverless функция может быть остановлена сразу после отправки ответа -
// если не дождаться обработки, вызов Claude API и bot.sendMessage могут
// оборваться на середине, и пользователь не получит ответа.
const webhookPath = `/api/telegram-webhook/${process.env.TELEGRAM_BOT_TOKEN}`;
app.post(webhookPath, async (req, res) => {
  try {
    await handleUpdate(req.body);
  } catch (error) {
    console.error('❌ Webhook handling error:', error);
  }
  res.sendStatus(200);
});

// ===== Web API для лендинга =====
app.use('/api', createChatApiRouter({ contentGenerator, database, analytics }));

// ВРЕМЕННЫЙ диагностический роут - убрать после того как webhook заработает.
// Не показывает сами значения секретов, только: заданы они вообще или нет,
// и текущий деплой (VERCEL_URL) - чтобы понять, тот ли домен видит сервер.
app.get('/api/debug-env', (req, res) => {
  const token = process.env.TELEGRAM_BOT_TOKEN || '';
  res.json({
    WEBHOOK_BASE_URL: process.env.WEBHOOK_BASE_URL || null,
    SITE_URL: process.env.SITE_URL || null,
    TELEGRAM_BOT_TOKEN_last6: token ? token.slice(-6) : null,
    CLAUDE_API_KEY_is_set: !!process.env.CLAUDE_API_KEY,
    VERCEL_URL: process.env.VERCEL_URL || null,
    VERCEL_ENV: process.env.VERCEL_ENV || null
  });
});

// Webhook на Telegram НЕ ставится автоматически на каждый холодный старт
// (не хотим дёргать Telegram API лишний раз). Вместо этого - разовый GET-роут:
// открой в браузере https://твой-домен.vercel.app/api/setup-webhook один раз
// после каждого деплоя (или после смены домена/токена).
app.get('/api/setup-webhook', async (req, res) => {
  const baseUrl = process.env.WEBHOOK_BASE_URL;
  if (!baseUrl) {
    return res.status(500).json({ error: 'WEBHOOK_BASE_URL не задан в переменных окружения Vercel' });
  }
  try {
    const fullWebhookUrl = `${baseUrl}${webhookPath}`;
    const result = await bot.setWebHook(fullWebhookUrl);
    res.json({ ok: true, webhookUrl: fullWebhookUrl, result });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ===== Stats API (для будущей админ-панели) =====
app.get('/api/stats', async (req, res) => {
  try {
    res.json(await database.getStats());
  } catch (error) {
    res.status(500).json({ error: 'internal_error' });
  }
});

// Сводка по активности - для обнаружения всплесков/злоупотреблений без
// сбора персональных данных (без IP, без имён). Снимок только за то
// время, что жива текущая "тёплая" функция.
app.get('/api/stats-summary', async (req, res) => {
  try {
    res.json(await database.getStatsSummary());
  } catch (error) {
    console.error('Stats summary error:', error);
    res.status(500).json({ error: 'internal_error' });
  }
});

// ===== Лендинг =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../landing/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Web + API запущен на http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err) => console.error('❌ Unhandled rejection:', err));
process.on('SIGINT', () => {
  console.log('\n👋 Остановка...');
  process.exit(0);
});

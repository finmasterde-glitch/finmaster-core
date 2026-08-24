js;
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
const bot = createTelegramBot({ contentGenerator, database, analytics });

// Telegram шлёт сюда апдейты POST-запросом - секретный кусок пути защищает
// роут от посторонних запросов (Telegram сам подставит его, если передать
// такой же путь в setWebHook)
const webhookPath = `/api/telegram-webhook/${process.env.TELEGRAM_BOT_TOKEN}`;
app.post(webhookPath, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// ===== Web API для лендинга =====
app.use('/api', createChatApiRouter({ contentGenerator, database, analytics }));

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

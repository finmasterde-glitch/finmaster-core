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

// ===== Telegram бот =====
createTelegramBot({ contentGenerator, database, analytics });

// ===== Web API для лендинга =====
app.use('/api', createChatApiRouter({ contentGenerator, database, analytics }));

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

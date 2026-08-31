const express = require('express');

const SUPPORTED_LANGUAGES = ['ru', 'uk', 'en', 'de', 'pl', 'ro', 'hr'];

/**
 * Веб-чат для лендинга. Форма партнёра встроена на той же странице
 * рядом с чатом (embeddedForm: true в вызове generateAnswer) - поэтому
 * здесь НЕТ счётчика вопросов, НЕТ таймера неактивности и НЕТ ссылки на
 * портал: всё уже в одном месте, отдельная рекомендация "перейти на
 * портал" была бы избыточной и путала пользователя.
 */
function createChatApiRouter({ contentGenerator, database, analytics }) {
  const router = express.Router();

  router.post('/chat', async (req, res) => {
    try {
      const { message, sessionId, language } = req.body;

      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'message is required' });
      }
      if (!sessionId) {
        return res.status(400).json({ error: 'sessionId is required' });
      }

      const lang = SUPPORTED_LANGUAGES.includes(language) ? language : 'ru';

      const history = await database.getRecentMessages(sessionId, 6);
      const answer = await contentGenerator.generateAnswer(message, { language: lang, history, embeddedForm: true });

      analytics.trackUserAction({ userId: sessionId, action: 'web_question_answered', timestamp: new Date() });
      database.saveMessage({ userId: sessionId, userMessage: message, botResponse: answer.text, language: lang, timestamp: new Date() });

      res.json({ text: answer.text });

    } catch (error) {
      console.error('Chat API error:', error);
      res.status(500).json({ error: 'internal_error' });
    }
  });

  return router;
}

module.exports = createChatApiRouter;

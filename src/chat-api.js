const express = require('express');

const MESSAGES_BEFORE_CTA = 4;
const SUPPORTED_LANGUAGES = ['ru', 'uk', 'en', 'de', 'pl', 'ro', 'hr'];
function createChatApiRouter({ contentGenerator, database, analytics }) {
  const router = express.Router();

  // sessionId -> счётчик сообщений с последнего CTA
  // (таймер неактивности для веба делает сам браузер, см. landing/app.js)
  const sessionMessageCounts = new Map();

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

      const count = (sessionMessageCounts.get(sessionId) || 0) + 1;
      sessionMessageCounts.set(sessionId, count);
      const shouldShowCTA = count >= MESSAGES_BEFORE_CTA;

      const answer = await contentGenerator.generateAnswer(message, { includeCTA: shouldShowCTA, language: lang });

      if (answer.ctaShown) {
        sessionMessageCounts.set(sessionId, 0);
        analytics.trackClick({ userId: sessionId, type: 'web_answer_with_portal_link', content: message, timestamp: new Date() });
      } else {
        analytics.trackUserAction({ userId: sessionId, action: 'web_question_answered_no_cta', timestamp: new Date() });
      }

      database.saveMessage({ userId: sessionId, userMessage: message, botResponse: answer.text, timestamp: new Date() });

      res.json({
        text: answer.text,
        showCTA: answer.ctaShown,
        portalUrl: answer.portalUrl
      });

    } catch (error) {
      console.error('Chat API error:', error);
      res.status(500).json({ error: 'internal_error' });
    }
  });

  // Явный запрос ссылки с лендинга (кнопка "Узнать цену" в любой момент)
  router.post('/chat/portal-link', (req, res) => {
    const { sessionId } = req.body;
    analytics.trackClick({ userId: sessionId || 'unknown', type: 'web_portal_button_click', timestamp: new Date() });
    res.json({ portalUrl: process.env.AFFILIATE_PORTAL_URL });
  });

  return router;
}

module.exports = createChatApiRouter;

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    // На Vercel файловая система только для чтения, кроме /tmp.
    // /tmp живёт только пока "тёплая" функция жива - при холодном старте
    // база создаётся заново (это ок для аналитики на старте проекта,
    // но не для долгосрочного хранения - см. README про перенос на внешнюю БД).
    this.dbPath = process.env.VERCEL
      ? '/tmp/finmaster.db'
      : path.join(__dirname, '../data/finmaster.db');
    this.db = null;
    this.init();
  }

  /**
   * Инициализирует базу данных и создаёт таблицы
   */
  init() {
    this.db = new sqlite3.Database(this.dbPath, (err) => {
      if (err) {
        console.error('❌ Database init error:', err);
      } else {
        console.log('✅ Database connected:', this.dbPath);
        this.createTables();
      }
    });
  }

  /**
   * Создаёт таблицы если их ещё нет
   */
  createTables() {
    const tables = [
      // Таблица пользователей
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER UNIQUE,
        username TEXT,
        firstName TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastActive DATETIME,
        totalMessages INTEGER DEFAULT 0
      )`,

      // Таблица сообщений
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        userMessage TEXT,
        botResponse TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(userId)
      )`,

      // Таблица постов
      `CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT, -- 'daily', 'weekly', 'custom'
        title TEXT,
        script TEXT,
        videoPath TEXT,
        postedAt DATETIME,
        status TEXT DEFAULT 'created', -- 'created', 'posted', 'published'
        platform TEXT, -- 'instagram', 'tiktok', 'both'
        createdAt DATETIME

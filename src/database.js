const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.dbPath = path.join(__dirname, '../data/finmaster.db');
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
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Таблица данных пользователей (при заполнении формы)
      `CREATE TABLE IF NOT EXISTS user_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        brand TEXT,
        model TEXT,
        year TEXT,
        power TEXT,
        region TEXT,
        age TEXT,
        experience TEXT,
        mileage TEXT,
        savedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(userId)
      )`,

      // Таблица аналитики (клики, конверсии)
      `CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        type TEXT, -- 'portal_link', 'answer_portal_link', 'form_completed', 'telegram_message'
        data TEXT, -- JSON данные
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(userId) REFERENCES users(userId)
      )`
    ];

    tables.forEach(sql => {
      this.db.run(sql, (err) => {
        if (err) {
          console.error('❌ Error creating table:', err);
        }
      });
    });

    console.log('✅ Database tables initialized');
  }

  /**
   * Сохраняет или обновляет пользователя
   */
  saveUser(userData) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT OR REPLACE INTO users (userId, username, firstName, createdAt, lastActive)
        VALUES (?, ?, ?, datetime('now'), datetime('now'))
      `;

      this.db.run(sql, [userData.userId, userData.username, userData.firstName], (err) => {
        if (err) {
          console.error('❌ Error saving user:', err);
          reject(err);
        } else {
          console.log('✅ User saved:', userData.userId);
          resolve();
        }
      });
    });
  }

  /**
   * Сохраняет сообщение
   */
  saveMessage(messageData) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO messages (userId, userMessage, botResponse, timestamp)
        VALUES (?, ?, ?, datetime('now'))
      `;

      this.db.run(sql, [messageData.userId, messageData.userMessage, messageData.botResponse], (err) => {
        if (err) {
          console.error('❌ Error saving message:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Сохраняет пост
   */
  savePost(postData) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO posts (type, title, script, videoPath, postedAt, status, platform)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const scriptJson = typeof postData.script === 'string' ? postData.script : JSON.stringify(postData.script);

      this.db.run(sql, [
        postData.type,
        postData.title,
        scriptJson,
        postData.videoPath,
        postData.postedAt || new Date(),
        postData.status || 'created',
        postData.platform || 'both'
      ], (err) => {
        if (err) {
          console.error('❌ Error saving post:', err);
          reject(err);
        } else {
          console.log('✅ Post saved:', postData.title);
          resolve();
        }
      });
    });
  }

  /**
   * Сохраняет данные пользователя из формы
   */
  saveUserData(data) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO user_data (userId, brand, model, year, power, region, age, experience, mileage)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const fd = data.formData;
      this.db.run(sql, [
        data.userId,
        fd.brand,
        fd.model,
        fd.year,
        fd.power,
        fd.region,
        fd.age,
        fd.experience,
        fd.mileage
      ], (err) => {
        if (err) {
          console.error('❌ Error saving user data:', err);
          reject(err);
        } else {
          console.log('✅ User data saved for userId:', data.userId);
          resolve();
        }
      });
    });
  }

  /**
   * Получает недавние посты
   */
  getRecentPosts(limit = 10) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM posts 
        ORDER BY createdAt DESC 
        LIMIT ?
      `;

      this.db.all(sql, [limit], (err, rows) => {
        if (err) {
          console.error('❌ Error getting posts:', err);
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  /**
   * Получает информацию о пользователе
   */
  getUser(userId) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE userId = ?';

      this.db.get(sql, [userId], (err, row) => {
        if (err) {
          console.error('❌ Error getting user:', err);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  /**
   * Получает всех пользователей
   */
  getUsers(limit = 100) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users ORDER BY createdAt DESC LIMIT ?';

      this.db.all(sql, [limit], (err, rows) => {
        if (err) {
          console.error('❌ Error getting users:', err);
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  /**
   * Получает статистику
   */
  getStats() {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT 
          (SELECT COUNT(*) FROM users) as totalUsers,
          (SELECT COUNT(*) FROM messages) as totalMessages,
          (SELECT COUNT(*) FROM posts) as totalPosts,
          (SELECT COUNT(*) FROM analytics WHERE type = 'portal_link') as portalClicks,
          (SELECT COUNT(*) FROM analytics WHERE type = 'form_completed') as formsCompleted
      `, (err, rows) => {
        if (err) {
          console.error('❌ Error getting stats:', err);
          reject(err);
        } else {
          resolve(rows ? rows[0] : {});
        }
      });
    });
  }

  /**
   * Сохраняет событие аналитики
   */
  saveAnalytics(analyticsData) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO analytics (userId, type, data, timestamp)
        VALUES (?, ?, ?, datetime('now'))
      `;

      const dataJson = typeof analyticsData.data === 'string' ? analyticsData.data : JSON.stringify(analyticsData.data);

      this.db.run(sql, [analyticsData.userId, analyticsData.type, dataJson], (err) => {
        if (err) {
          console.error('❌ Error saving analytics:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Получает события аналитики
   */
  getAnalytics(type = null, limit = 100) {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM analytics';
      let params = [];

      if (type) {
        sql += ' WHERE type = ?';
        params.push(type);
      }

      sql += ' ORDER BY timestamp DESC LIMIT ?';
      params.push(limit);

      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('❌ Error getting analytics:', err);
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  /**
   * Закрывает соединение с БД
   */
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('❌ Error closing database:', err);
            reject(err);
          } else {
            console.log('✅ Database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = Database;

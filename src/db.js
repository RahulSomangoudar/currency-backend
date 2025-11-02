const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '..', 'db.sqlite');
const db = new sqlite3.Database(dbPath);

function initDB() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        currency TEXT,
        source TEXT,
        buy_price REAL,
        sell_price REAL,
        fetched_at TEXT
      );
    `);
  });
}

function saveQuotes(currency, quotes) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('DELETE FROM quotes WHERE currency = ?', [currency], (err) => {
        if (err) return reject(err);
        const stmt = db.prepare('INSERT INTO quotes (currency, source, buy_price, sell_price, fetched_at) VALUES (?, ?, ?, ?, ?)');
        for (const q of quotes) {
          stmt.run(currency, q.source, q.buy_price, q.sell_price, q.fetched_at);
        }
        stmt.finalize((err2) => (err2 ? reject(err2) : resolve(true)));
      });
    });
  });
}

function getQuotesForCurrency(currency) {
  return new Promise((resolve, reject) => {
    db.all('SELECT source, buy_price, sell_price, fetched_at FROM quotes WHERE currency = ?', [currency], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function getAverageForCurrency(currency) {
  return new Promise((resolve, reject) => {
    db.get('SELECT AVG(buy_price) AS average_buy_price, AVG(sell_price) AS average_sell_price FROM quotes WHERE currency = ?', [currency], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

module.exports = { initDB, saveQuotes, getQuotesForCurrency, getAverageForCurrency };

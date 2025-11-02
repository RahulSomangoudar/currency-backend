const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'db.sqlite');
let db;

function initDB() {
  db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      currency TEXT,
      source TEXT,
      buy_price REAL,
      sell_price REAL,
      fetched_at TEXT
    );
  `);
}

function saveQuotes(currency, quotes) {
  const insert = db.prepare('INSERT INTO quotes (currency, source, buy_price, sell_price, fetched_at) VALUES (?, ?, ?, ?, ?)');
  const del = db.prepare('DELETE FROM quotes WHERE currency = ?');
  const tran = db.transaction((currency, quotes) => {
    del.run(currency);
    for (const q of quotes) {
      insert.run(currency, q.source, q.buy_price, q.sell_price, q.fetched_at);
    }
  });
  tran(currency, quotes);
  return true;
}

function getQuotesForCurrency(currency) {
  const stmt = db.prepare('SELECT source, buy_price, sell_price, fetched_at FROM quotes WHERE currency = ?');
  return stmt.all(currency);
}

function getAverageForCurrency(currency) {
  const stmt = db.prepare('SELECT AVG(buy_price) as average_buy_price, AVG(sell_price) as average_sell_price FROM quotes WHERE currency = ?');
  return stmt.get(currency);
}

module.exports = { initDB, saveQuotes, getQuotesForCurrency, getAverageForCurrency };

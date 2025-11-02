const express = require('express');
const path = require('path');
const { initDB, saveQuotes, getQuotesForCurrency, getAverageForCurrency } = require('./src/db');
const fetchers = require('./src/fetchers/index');

const app = express();
const PORT = process.env.PORT || 3000;

initDB();

async function refreshAll() {
  try {
    // fetch for both currencies
    for (const currency of ['ARS','BRL']) {
      const results = await fetchers.fetchAll(currency);
      // results: [{buy_price, sell_price, source, fetched_at}]
      await saveQuotes(currency, results);
      console.log(new Date().toISOString(), 'Refreshed', currency, '->', results.map(r=>r.source));
    }
  } catch (err) {
    console.error('Refresh error', err);
  }
}

// initial fetch, then every 60s
refreshAll();
setInterval(refreshAll, 60 * 1000);

app.get('/quotes', async (req, res) => {
  const currency = (req.query.currency || 'ARS').toUpperCase();
  if (!['ARS','BRL'].includes(currency)) return res.status(400).json({error:'currency must be ARS or BRL'});
  const rows = await getQuotesForCurrency(currency);
  res.json(rows);
});

app.get('/average', async (req, res) => {
  const currency = (req.query.currency || 'ARS').toUpperCase();
  if (!['ARS','BRL'].includes(currency)) return res.status(400).json({error:'currency must be ARS or BRL'});
  const avg = await getAverageForCurrency(currency);
  res.json(avg);
});

app.get('/slippage', async (req, res) => {
  const currency = (req.query.currency || 'ARS').toUpperCase();
  if (!['ARS','BRL'].includes(currency)) return res.status(400).json({error:'currency must be ARS or BRL'});
  const avg = await getAverageForCurrency(currency);
  const quotes = await getQuotesForCurrency(currency);
  if (!avg || quotes.length===0) return res.status(503).json({error:'No data yet'});
  const out = quotes.map(q=>{
    const buy_slippage = (q.buy_price - avg.average_buy_price) / avg.average_buy_price;
    const sell_slippage = (q.sell_price - avg.average_sell_price) / avg.average_sell_price;
    return {
      source: q.source,
      buy_price: q.buy_price,
      sell_price: q.sell_price,
      buy_price_slippage: Number(buy_slippage.toFixed(6)),
      sell_price_slippage: Number(sell_slippage.toFixed(6)),
      fetched_at: q.fetched_at
    };
  });
  res.json(out);
});

app.get('/', (req,res)=>res.send('Currency Quotes API is running. Use /quotes?currency=ARS or BRL'));

app.listen(PORT, ()=>console.log('Server started on port', PORT));

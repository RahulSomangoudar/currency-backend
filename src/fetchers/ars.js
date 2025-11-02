const axios = require('axios');
const cheerio = require('cheerio');

/*
  Fetchers for ARS sources:
  - https://www.ambito.com/contenidos/dolar.html
  - https://www.dolarhoy.com
  - https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB

  NOTE: HTML structures can change. Parsers attempt to find common selectors.
*/

// --- Helper to normalize values like 1.425,00 → 1425.00 ---
function normalize(num) {
  if (!num || isNaN(num)) return 0;
  // If absurdly large (e.g. 1425000), divide by 100 or 1000 depending on scale
  if (num > 10000) return num / 1000;
  if (num > 1000) return num / 100;
  return num;
}

// --- Ambito ---
async function fetchAmbito() {
  const url = 'https://www.ambito.com/contenidos/dolar.html';
  try {
    const r = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const nums = r.data.match(/\d{1,3}(?:[.,]\d{2,3})/g);
    let buy = 0,
      sell = 0;
    if (nums && nums.length >= 2) {
      buy = normalize(parseFloat(nums[0].replace(/\./g, '').replace(',', '.')));
      sell = normalize(parseFloat(nums[1].replace(/\./g, '').replace(',', '.')));
    }
    return {
      source: url,
      buy_price: buy || 0,
      sell_price: sell || 0,
      fetched_at: new Date().toISOString(),
    };
  } catch (err) {
    console.error('Ambito fetch error:', err.message);
    return { source: url, buy_price: 0, sell_price: 0, fetched_at: new Date().toISOString() };
  }
}

// --- DolarHoy ---
async function fetchDolarHoy() {
  const url = 'https://www.dolarhoy.com';
  try {
    const r = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const $ = cheerio.load(r.data);
    let buy = null,
      sell = null;
    const buyText =
      $('[data-value-buy]').attr('data-value-buy') ||
      $('[class*=compra]').first().text();
    const sellText =
      $('[data-value-sell]').attr('data-value-sell') ||
      $('[class*=venta]').first().text();

    if (buyText)
      buy = normalize(
        parseFloat(
          String(buyText).replace(/\./g, '').replace(',', '.').match(/\d+([\.,]\d+)*/)
        )
      );
    if (sellText)
      sell = normalize(
        parseFloat(
          String(sellText).replace(/\./g, '').replace(',', '.').match(/\d+([\.,]\d+)*/)
        )
      );

    // Fallback regex if still undefined
    if (!buy || !sell) {
      const nums = r.data.match(/\d{1,3}(?:[.,]\d{2,3})/g);
      if (nums && nums.length >= 2) {
        buy = normalize(parseFloat(nums[0].replace(/\./g, '').replace(',', '.')));
        sell = normalize(parseFloat(nums[1].replace(/\./g, '').replace(',', '.')));
      }
    }

    return {
      source: url,
      buy_price: buy || 0,
      sell_price: sell || 0,
      fetched_at: new Date().toISOString(),
    };
  } catch (err) {
    console.error('DolarHoy fetch error:', err.message);
    return { source: url, buy_price: 0, sell_price: 0, fetched_at: new Date().toISOString() };
  }
}

// --- Cronista ---
async function fetchCronista() {
  const url = 'https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB';
  try {
    const r = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    const nums = r.data.match(/\d{1,3}(?:[.,]\d{2,3})/g);
    let buy = 0,
      sell = 0;
    if (nums && nums.length >= 2) {
      buy = normalize(parseFloat(nums[0].replace(/\./g, '').replace(',', '.')));
      sell = normalize(parseFloat(nums[1].replace(/\./g, '').replace(',', '.')));
    }
    return {
      source: url,
      buy_price: buy || 0,
      sell_price: sell || 0,
      fetched_at: new Date().toISOString(),
    };
  } catch (err) {
    console.error('Cronista fetch error:', err.message);
    return { source: url, buy_price: 0, sell_price: 0, fetched_at: new Date().toISOString() };
  }
}

// --- Fetch all sources together ---
async function fetchAll() {
  const fns = [fetchAmbito(), fetchDolarHoy(), fetchCronista()];
  const results = await Promise.allSettled(fns);
  return results.map((r) =>
    r.status === 'fulfilled'
      ? r.value
      : {
          source: 'error',
          buy_price: 0,
          sell_price: 0,
          fetched_at: new Date().toISOString(),
        }
  );
}

module.exports = { fetchAll };

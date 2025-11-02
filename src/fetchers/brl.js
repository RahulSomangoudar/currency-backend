const axios = require('axios');
const cheerio = require('cheerio');

/*
  Fetchers for BRL sources:
  - https://wise.com/es/currency-converter/brl-to-usd-rate
  - https://nubank.com.br/taxas-conversao/
  - https://www.nomadglobal.com

  NOTE: Parsers are best-effort. Sites may block scraping or change structure.
*/

async function fetchWise() {
  const url = 'https://wise.com/es/currency-converter/brl-to-usd-rate';
  const r = await axios.get(url, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' }});
  const nums = r.data.match(/\d{1,3}(?:[.,]\d{2,6})/g);
  let buy = nums && nums[0] ? parseFloat(nums[0].replace(/\./g,'').replace(',','.')) : 0;
  let sell = nums && nums[1] ? parseFloat(nums[1].replace(/\./g,'').replace(',','.')) : buy;
  return { source: url, buy_price: buy||0, sell_price: sell||0, fetched_at: new Date().toISOString() };
}

async function fetchNubank() {
  const url = 'https://nubank.com.br/taxas-conversao/';
  const r = await axios.get(url, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' }});
  const nums = r.data.match(/\d{1,3}(?:[.,]\d{2,6})/g);
  let buy = nums && nums[0] ? parseFloat(nums[0].replace(/\./g,'').replace(',','.')) : 0;
  let sell = nums && nums[1] ? parseFloat(nums[1].replace(/\./g,'').replace(',','.')) : buy;
  return { source: url, buy_price: buy||0, sell_price: sell||0, fetched_at: new Date().toISOString() };
}

async function fetchNomad() {
  const url = 'https://www.nomadglobal.com';
  const r = await axios.get(url, { timeout: 10000, headers: { 'User-Agent': 'Mozilla/5.0' }});
  const nums = r.data.match(/\d{1,3}(?:[.,]\d{2,6})/g);
  let buy = nums && nums[0] ? parseFloat(nums[0].replace(/\./g,'').replace(',','.')) : 0;
  let sell = nums && nums[1] ? parseFloat(nums[1].replace(/\./g,'').replace(',','.')) : buy;
  return { source: url, buy_price: buy||0, sell_price: sell||0, fetched_at: new Date().toISOString() };
}

async function fetchAll() {
  const fns = [fetchWise(), fetchNubank(), fetchNomad()];
  const results = await Promise.allSettled(fns);
  return results.map(r => r.status === 'fulfilled' ? r.value : { source: 'error', buy_price:0, sell_price:0, fetched_at: new Date().toISOString() });
}

module.exports = { fetchAll };

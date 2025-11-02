const ars = require('./ars');
const brl = require('./brl');

async function fetchAll(currency) {
  if (currency === 'ARS') return ars.fetchAll();
  if (currency === 'BRL') return brl.fetchAll();
  throw new Error('Unsupported currency '+currency);
}

module.exports = { fetchAll };

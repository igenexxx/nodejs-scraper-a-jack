const fetch = require('node-fetch');
const cheerio = require('cheerio');

const Sheet = require('./sheet');

async function getPrice(url) {
  const res = await fetch(url);
  const text = await res.text();
  const $ = cheerio.load(text);
  return $('#quotes_summary_current_data span').first().text();
}

(async () => {
  const sheet = new Sheet();
  await sheet.load();

  const stocks = await sheet.getRows(0);

  const prices = await Promise.all(stocks.map(async (stock) => {
    return {
      [stock.ticker]: await getPrice(stock.url)
    };
  }))

  const result = {
    date: new Date().toDateString(),
    ...prices.reduce((acc, curr) => ({ ...acc, ...curr}), {}),
  };

  await sheet.addRows([result], 1);
})()

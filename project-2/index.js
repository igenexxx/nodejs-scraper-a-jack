const fetch = require('node-fetch');
const cheerio = require('cheerio');

const Sheet = require('./sheet');

const fetchPage = async (page = 1) => {
  const res = await fetch(`https://explodingtopics.com/topics-this-month?page=${page}`);
  const text = await res.text();
  const $ = cheerio.load(text);

  const containers = $('.topicInfoContainer').toArray();
  const trends = containers?.map(c => {
    const active = $(c);
    const keyword = active.find('.tileKeyword').text();
    const description = active.find('.tileDescription').text();
    const searchesCount = active.find('.scoreTag').text();

    return { keyword, description, searchesCount: searchesCount
        .replace('searches/mo', '')
        .replace('growth', ' growth')
    };
  });
  
  console.log(trends.length);

  return !trends.length ? [] : [...trends, ...await fetchPage(page + 1)];
}

(async () => {
  const trends = await fetchPage();

  const sheet = new Sheet();
  await sheet.load();
  await sheet.addRows(trends);
})();

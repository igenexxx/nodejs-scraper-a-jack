const fetch = require('node-fetch');
const Sheet = require('./sheet');

async function fetchPage(sheet, i = 1) {
  const response = await fetch(`https://jobs.github.com/positions.json?search=code&page=${i}`);
  const data = await response.json();

  const row = data?.map(job => {
    return {
      company: job.company,
      title: job.title,
      location: job.location,
      date: job.created_at,
      url: job.url,
    };
  }) || [];

  console.log('Row length:', row.length, ' page:', i);

  // return [].concat(row.length ? await fetchPage(sheet,i + 1) : []);
  return !row.length ? [] : [...row, ...await fetchPage(sheet,i + 1)];
}

const filterBy = (keywords, job) => keywords.some(keyword => job.title.toLowerCase().includes(keyword.toLowerCase()));

(async () => {
  const sheet = new Sheet();
  await sheet.load();

  const rows = await fetchPage(sheet);

  const preparedRows = rows
    .filter(filterBy.bind(null, ['javascript', 'frontend', 'front end']))
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  await sheet.addRows(preparedRows);
})()

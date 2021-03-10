const fetch = require('node-fetch');
const Sheet = require('./sheet');

(async () => {
  const sheet = new Sheet();
  await sheet.load();

  const response = await fetch('https://jobs.github.com/positions.json?description=javascript&location=remote');
  const data = await response.json();

  const rows = data.map(job => {
    return {
      company: job.company,
      title: job.title,
      location: job.location,
      date: job.created_at,
      url: job.url,
    };
  });

  await sheet.addRows(rows);
})()

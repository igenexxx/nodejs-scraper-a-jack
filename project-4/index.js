const { chromium, firefox, webkit } = require('playwright');

const Sheet = require('./sheet');

const url = 'https://old.reddit.com/r/learnprogramming/comments/4q6tae/i_highly_recommend_harvards_free_online_2016_cs50/';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const getTextContent = el => el.textContent;


(async () => {
  const browser = await chromium.launch({ headless: false });  // Or 'firefox' or 'webkit'.
  const page = await browser.newPage();
  await page.goto(url);

  const sheet = new Sheet();
  await sheet.load();

  const openCommentsRecursively = async () => {
    const expandButtons = await page.$$('.morecomments');

    if (!expandButtons.length) {
      console.log('No links to expand buttons');
      return;
    }

    await Promise.allSettled(expandButtons.map(async (button) => {
      await button.click({ noWaitAfter: true });
      await sleep(Math.round(Math.random() * 2000 + 500));
    }));

    const expandButtonsLength = (await page.$$('.morecomments'))?.length;
    console.log('Remained links to expand: ', expandButtonsLength);

    if (expandButtonsLength) {
      return await openCommentsRecursively();
    }
  }

  await openCommentsRecursively();

  const comments = await page.$$('.entry');

  const results = (await Promise.allSettled(comments.map(async (comment) => {
    const points = await comment
      .$eval('.score', getTextContent)
      .catch(() => console.error('No score'));
    const text = await comment
      .$eval('.usertext-body', getTextContent)
      .catch(() => console.error('No text'));

    return !!text && !!points ? { text: text.replace(/\n/g, ''), points } : null;
  }))).map(({ value }) => value).filter(value => value);

  console.log(results);

  results.sort((a, b) => parseInt(b.points) - parseInt(a.points));

  const title = await page.$eval('.title a', getTextContent);
  const sheetIndex = await sheet.addSheet(title.slice(0, 99), ['text', 'points']);

  await sheet.addRows(results, sheetIndex);

  await browser.close();
})();

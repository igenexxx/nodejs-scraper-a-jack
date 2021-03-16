const { chromium } = require('playwright');
const Sheet = require('./sheet');

const creds = require('./creds.json');
const baseUrl = 'https://instagram.com';

const profileScraper = async (page, usernameList) => {
  let results = [];

  for (let username of usernameList) {
    const link = `http://instagram.com/${username}`
    await page.goto(link);
    await page.waitForSelector('img');
    const imgSrc = await page.$eval('img', el => el.getAttribute('src'));
    await page.waitForSelector('header');
    const [posts, followers, following] = (await page.$$eval('header li', els => els.map(el => el.textContent))).map(x => parseInt(x));
    const name = await page.$eval('header h1', el => el.textContent).catch(() => console.error('No name'));
    const description = await page.$eval('section h1 ~ span', el => el.textContent).catch(() => console.error('No description'));

    results.push({ username, name, imgSrc, posts, followers, following, description, link });
  }

  return results;
}

const likeAutomation = async (page, username = '3d_r.a.san') => {
  await page.goto(`${baseUrl}/${username}`);

  const xPathQueryToPhotos = '//article//a[@tabindex=0]';
  const xPathQueryToLikeButton = '//article//button/div/span/*[@fill and @height="24"]';

  await page.waitForSelector(xPathQueryToPhotos);

  await (await page.$(xPathQueryToPhotos)).click();

  await page.waitForSelector(xPathQueryToLikeButton);

  await (await page.$(xPathQueryToLikeButton)).click();
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  // Create pages, interact with UI elements, assert values
  const page = await browser.newPage();
  await page.goto(baseUrl);

  await page.waitForSelector('input');

  const inputs = await page.$$('input');
  const [login, password] = inputs;

  await login.type(creds.userCreds.username, { delay: 100 });
  await password.type(creds.userCreds.password, { delay: 100 });

  const loginButton = await page.$("//.//button/div[text() = 'Войти' or text() = 'Log In']");

  await loginButton.click();
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

  const sheet = new Sheet();
  await sheet.load();

  const profilesList = (await sheet.getRows()).map(row => row.username);
  console.log(profilesList);
  const profiles = await profileScraper(page, profilesList);

  const oldProfiles = await sheet.getRows();

  for (let oldProfile of oldProfiles) {
    if (profilesList.includes(oldProfile.username)) {
      await oldProfile.delete();
    }
  }

  await sheet.addRows(profiles);

  await browser.close();
})();

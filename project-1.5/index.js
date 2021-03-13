const Twitter = require('twitter');
const Sheet = require('./sheet');

const credentials = require('./creds.json');

(async () => {
  const client = new Twitter({
    consumer_key: credentials.twitter.consumerKey,
    consumer_secret: credentials.twitter.consumerSecret,
    access_token_key: credentials.twitter.accessTokenKey,
    access_token_secret: credentials.twitter.accessTokenSecret,
  });

  const sheet = new Sheet();
  await sheet.load();

  const smiles = await sheet.getRows();
  const status = smiles[0].smile;

  client.post('statuses/update', { status }, async (error, tweet, response) => {
    if (error) throw error;

    await smiles[0].delete();
    console.log('tweeted', smiles[0].smile);
  });
})()

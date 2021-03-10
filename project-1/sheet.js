const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = class Sheet {
  constructor() {
    this.doc = new GoogleSpreadsheet('1sU557WYKKg5dEmGvOlWVR5fpwhjs4Vzr5YY2clNTJzI');
  }

  async load() {
    await this.doc.useServiceAccountAuth(require('./creds.json'));
    await this.doc.loadInfo();
  }

  async addRows(rows) {
    const sheet = this.doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

    await sheet.addRows(rows);
  }
}

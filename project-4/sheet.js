const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = class Sheet {
  constructor() {
    this.doc = new GoogleSpreadsheet('1ojpPcti9LdRzBRWJR4KL5838LmM1S8u1HYgxWpTi1Ro');
  }

  async load() {
    await this.doc.useServiceAccountAuth(require('./creds.json'));
    await this.doc.loadInfo();
  }

  async addSheet(title, headerValues) {
    await this.doc.addSheet({ title, headerValues });

    return this.doc.sheetsByIndex.length - 1;
  }

  async addRows(rows, i) {
    const sheet = this.doc.sheetsByIndex[i]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

    await sheet.addRows(rows);
  }

  async getRows(i) {
    const sheet = this.doc.sheetsByIndex[i];

    return await sheet.getRows();
  }
}

const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = class Sheet {
  constructor() {
    this.doc = new GoogleSpreadsheet('1ojpPcti9LdRzBRWJR4KL5838LmM1S8u1HYgxWpTi1Ro');
  }

  async load() {
    await this.doc.useServiceAccountAuth(require('./creds.json'));
    await this.doc.loadInfo();
  }

  async addRows(rows) {
    const sheet = this.doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

    await sheet.addRows(rows);
  }

  async getRows() {
    const sheet = this.doc.sheetsByIndex[0];

    return await sheet.getRows();
  }
}

const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = class Sheet {
  constructor() {
    this.doc = new GoogleSpreadsheet('1sU557WYKKg5dEmGvOlWVR5fpwhjs4Vzr5YY2clNTJzI');
  }

  async load() {
    await this.doc.useServiceAccountAuth(require('./creds.json').googlesheet);
    await this.doc.loadInfo();
  }

  async addSheet(title, headerValues) {
    await this.doc.addSheet({ title, headerValues });

    return this.doc.sheetsByIndex.length - 1;
  }

  async addRows(rows, i = 0) {
    const sheet = this.doc.sheetsByIndex[i]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

    await sheet.addRows(rows);
  }

  async getRows(i = 0) {
    const sheet = this.doc.sheetsByIndex[i];

    return await sheet.getRows();
  }
}

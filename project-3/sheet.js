const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = class Sheet {
  constructor() {
    this.doc = new GoogleSpreadsheet('1lA0Rk_nGO_U3ey02wnS09gKJiRvNxDRw01ZJI37JzLc');
  }

  async load() {
    await this.doc.useServiceAccountAuth(require('./creds.json'));
    await this.doc.loadInfo();
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

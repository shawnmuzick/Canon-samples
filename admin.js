const {
  createCustomTable,
  addCustomTableFields,
  usedOutOfStock,
  customersByEntryDate,
} = require("../queries/queries.js");
const { executeStatement } = require("./execute.js");
const { cleanPics } = require("../jobs/cleanPics.js");
const { CTRL_consignment } = require("./consignments.js");
const { cleanReverbInv } = require("../jobs/cleanReverbInv.js");
const { postMailerLiteSubs } = require("../jobs/postMailerLiteSubs.js");

const CTRL_admin = {
  createTable: (req, res) => {
    const name = req.params.id;
    const query = createCustomTable(name);
    executeStatement(req, res, query);
  },
  deleteTable: (req, res) => {
    const name = req.params.id;
    const query = `DROP TABLE ${name}`;
    executeStatement(req, res, query);
  },
  addCustomFields: (req, res) => {
    const { table, field, type, options } = req.body;
    const query = addCustomTableFields(table, field, type, options);
    executeStatement(req, res, query);
  },
  cleanConsignmentPics: (req, res) => {
    executeStatement(req, res, usedOutOfStock, cleanPics);
  },
  cleanReverbInventory: async (req, res, next) => {
    const data = await CTRL_consignment.reverbGet(req, res, next, true);
    cleanReverbInv(data, req, res);
  },
  postMailerLiteSubscribers: async (req, res, next) => {
    let previousDay = new Date();
    previousDay.setDate(previousDay.getDate() - 1);
    let day = previousDay.getUTCDate();
    day > 10 ? `0${day}` : day;
    let month = previousDay.getUTCMonth() + 1;
    month > 10 ? `0${month}` : month;
    let string = `${month}/${day}/${previousDay.getUTCFullYear()}`;
    const query = customersByEntryDate(string);
    executeStatement(req, res, query, postMailerLiteSubs);
  },
};

module.exports = { CTRL_admin };

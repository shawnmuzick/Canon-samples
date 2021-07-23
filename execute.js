const Request = require("tedious").Request;
const { connection } = require("../config/databaseConfig");
const { errorLogger } = require("../util/errorHandler.js");

function filterUndefinedEntries(arr) {
  arr.forEach((column) => {
    for (entry in column.metadata) {
      if (column.metadata[entry] === undefined) {
        delete column.metadata[entry];
      }
    }
  });
  return arr;
}

function addColumnsToRow(columns) {
  let arr = [];
  columns.forEach(function (column) {
    arr.push(column);
  });
  return arr;
}

/** */
function executeStatement(req, res, query, jobFunction) {
  request = new Request(query, function (err) {
    if (err) {
      errorLogger.log({
        fileName: "databaseError.txt",
        data: `${err}\n`,
      });
      // try again
      console.log("retrying...")
      executeStatement(req, res, query, jobFunction);
    }
    return;
  });
  var result = [];
  request.on("row", function (columns) {
    let arr = addColumnsToRow(columns);
    arr = filterUndefinedEntries(arr);
    result.push(arr);
  });

  request.on("doneProc", function (rowCount, more, returnStatus, rows) {
    if (result) res.json(result);
    if (jobFunction) jobFunction(result, req, res);
  });
  connection.execSql(request);
}
module.exports = { executeStatement };

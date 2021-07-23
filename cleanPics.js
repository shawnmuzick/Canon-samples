const path = require("path");
const fs = require("fs");

function cleanPics(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (arr[i][j].metadata.colName === "Sku") {
        let sku = arr[i][j].value;
        const file = path.join(__dirname, `../public/img/consignments/${sku}.jpg`);
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
          console.log('removed', file);
        }
      }
    }
  }
  console.log("completed job!");
}
module.exports = { cleanPics };

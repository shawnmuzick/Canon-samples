const fs = require("fs");
const path = require("path");

class ErrorLogger {
  log(params = { fileName: "error.txt", data: "Error - Unknown\n" }) {
    let { fileName, data } = params;
    try {
      if (!fs.existsSync(path.join(__dirname, "../logs"))) {
        console.log("setting up logs folder");
        fs.mkdir(path.join(__dirname, "../logs"), (err) => {
          if (err) console.log(err);
          return;
        });
      }
      fs.appendFile(path.join(__dirname, `../logs/${fileName}`), String(data), (err) => {
        console.log(data)
        if (err) console.log(err);
      });
    } catch (err) {
      console.log(err);
    }
  }
}
let errorLogger = new ErrorLogger();

module.exports = { errorLogger };

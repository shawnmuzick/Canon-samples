const https = require("https");
const fs = require("fs");
const express = require("express");
const path = require("path");
const apiRouter = require("./routes/apiRoutes.js");
const viewRouter = require("./routes/viewRouter.js");
const app = express();
const PORT = 5000;
app.use("/api", apiRouter);
app.use("/", viewRouter);

app.use("/public", express.static(path.join(__dirname, "public")));
https
  .createServer(
    {
      key: fs.readFileSync("./key.pem"),
      cert: fs.readFileSync("./cert.pem"),
    },
    app
  )
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const { used } = require("../queries/queries.js");
const { ReverbApiKey } = require("../config/ReverbKeys.js");
const { executeStatement } = require("./execute.js");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

async function getReverbParameters(req, res, url) {
  const parameter = await fetch(url, {
    method: "GET",
    headers: {
      "Accept-Version": "3.0",
      "Content-Type": "application/hal+json",
      Authorization: `Bearer ${ReverbApiKey}`,
    },
  }).then((res) => res.json());
  res.send(parameter);
}

const CTRL_consignment = {
  get: (req, res) => executeStatement(req, res, used),
  reverbGet: async (req, res, next, job = null) => {
    let nextUrl = `https://api.reverb.com/api/my/listings`;
    let data = [];
    while (nextUrl) {
      const page = await fetch(nextUrl, {
        method: "GET",
        headers: {
          "Accept-Version": "3.0",
          "Content-Type": "application/hal+json",
          Authorization: `Bearer ${ReverbApiKey}`,
        },
      }).then((res) => res.json());
      nextUrl = page?._links?.next?.href;
      data.push(page);
    }
    if (job) {
      return data;
    } else {
      res.send(data);
    }
  },

  reverbPost: async (req, res) => {
    const product = req.body;
    // note, API does not accept image strings, just remove it for now
    product.photos.shift();
    const data = await fetch(`https://api.reverb.com/api/listings`, {
      method: "POST",
      headers: {
        "Accept-Version": "3.0",
        "Content-Type": "application/hal+json",
        Authorization: `Bearer ${ReverbApiKey}`,
      },
      body: JSON.stringify(product),
    }).then((res) => res.json());
    res.send(data);
  },
  reverbPut: async (req, res, product) => {
    product.inventory = 0;
    console.log(product);
    // api calls require a valid photo, so just using this for now
    product.photos = ["http://i.stack.imgur.com/Sv4BC.png"];
    const data = await fetch(`https://api.reverb.com/api/listings/${product.id}`, {
      method: "PUT",
      headers: {
        "Accept-Version": "3.0",
        "Content-Type": "application/hal+json",
        Authorization: `Bearer ${ReverbApiKey}`,
      },
      body: JSON.stringify(product),
    }).then((res) => res.json());
    return data;
  },

  reverbConditions: (req, res) => {
    getReverbParameters(req, res, `https://api.reverb.com/api/listing_conditions`);
  },

  reverbCategories: async (req, res) => {
    getReverbParameters(req, res, `https://api.reverb.com/api/categories/flat`);
  },
  savePhoto: (req, res) => {
    const { sku, photo } = req.body;
    let b64Img = photo.replace(/^data:image\/[a-z]+;base64,/, "");
    let buff = Buffer.from(b64Img, "base64");
    let dest = path.join(__dirname, "../public/img/consignments/");
    fs.writeFile(`${dest}${sku}.jpg`, buff, { encoding: "base64" }, function (err) {
      if (err) console.log(err);
      else res.json({ message: "photo saved!" });
    });
  },
};

module.exports = { CTRL_consignment };

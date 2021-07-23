const { executeStatement } = require("../controllers/execute.js");
const { usedOutOfStock } = require("../queries/queries.js");
const { CTRL_consignment } = require("../controllers/consignments.js");
/**return an array of products that aren't brand new */
async function getReverbListings(rvbInv) {
  let reverbListings = [];
  rvbInv.forEach((page) => {
    page.listings.forEach((i) => {
      if (i.condition.display_name !== "Brand New" && i.sku) {
        reverbListings.push(i);
      }
    });
  });
  return reverbListings;
}

async function compareInventory(reverbListings, outOfStock) {
  // check reverb array to see if it's out of stock
  let filteredProducts = reverbListings.filter((i) => {
    if (outOfStock.includes(i.sku)) {
      console.log('remove ', i.sku);
      //store in list to remove
      return true;
    }else{
      console.log(i.sku, ' is still in stock');
    }
  });
  return filteredProducts;
}

/**loop through array of products to remove and remove them */
async function removeFromReverb(req,res, filteredProducts) {
  if (filteredProducts.length === 0) return;
  // note: foreach doesn't work w/ async/await
  for (i of filteredProducts) {
    let response = await CTRL_consignment.reverbPut(req, res, i);
    console.log(response);
  }
  return;
}

/**this is the job entry point,
 * remove out of stock skus from reverb
 */
async function cleanReverbInv(rvbInv, req, res) {
  console.time();

  const reverbSkus = getReverbListings(rvbInv);

  // job function passed to execute statement
  // has access to reverbSkus due to scope
  const getHouseInv = async (arr) => {
    //hold the POS system out of stock skus in an array
    let outOfStock = [];

    arr.forEach((row) => {
      row.forEach((column) => {
        if (column.metadata.colName === "Sku") {
          outOfStock.push(column.value);
        }
      });
    });

    //get the list of products to remove
    let filteredProducts = await compareInventory(await reverbSkus, outOfStock);
    let done = await removeFromReverb(req,res,filteredProducts);
  };

  console.timeEnd();

  // run the job
  executeStatement(req, res, usedOutOfStock, getHouseInv);
}

module.exports = { cleanReverbInv };

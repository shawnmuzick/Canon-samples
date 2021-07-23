import { API, endpoints } from "../API.js";
import { parseProducts } from "../models/product.js";
import { optionFactory } from "../forms/optionFactory.js";
const skuSearch = document.getElementById("skuSearch");
const skuSearchSubmit = document.getElementById("skuSearchSubmit");
const reverbSubmit = document.getElementById("reverbSubmit");
const title = document.getElementById("title");
const make = document.getElementById("make");
const model = document.getElementById("model");
const description = document.getElementById("description");
const price = document.getElementById("price");
const sku = document.getElementById("sku");
const conditionSelect = document.getElementById("condition");
const categorySelect = document.getElementById("category");
const image = document.getElementById("image");

let product = null;
let data = { price: {}, condition: {}, categories: [], shipping: {}, photos: [] };
let conditions = null;
let categories = null;
async function postToReverb(e) {
  e.preventDefault();
  let reader = new FileReader();
  let tmp = null;
  reader.onloadend = async function () {
    tmp = await reader.result;
    data.title = title.value;
    data.make = make.value;
    data.model = model.value;
    data.description = description.value;
    data.price.amount = price.value;
    data.price.currency = "USD";
    data.sku = sku.value;
    data.offers_enabled = false;
    data.inventory = 1;
    data.upc_does_not_apply = "true";
    data.condition.uuid = conditionSelect.value;
    data.categories.push({ uuid: categorySelect.value });
    data.shipping.local = true;
    data.photos.push(tmp);
    const res = await API.postData(endpoints.reverb, data);
    // separate route to store photos here
    const p = await API.postData(`/api/consignments/photos`, { photo: tmp, sku: data.sku });
    if (res?.listing?.id) console.log("success!");
    else console.log("failure");
    console.log(res);
    console.log(p);
  };
  reader.readAsDataURL(image.files[0]);
}
function fillForm(product) {
  title.value = product.Description;
  make.value = product.Manufacturer;
  model.value = product.Model;
  description.value = product.Notes;
  price.value = product.OurPrice;
  sku.value = product.Sku;
}

async function handleSearch(e) {
  e.preventDefault();
  const SKU = skuSearch.value;
  product = parseProducts(await API.getData(`${endpoints.tags}/${SKU}`))[0];
  fillForm(product);
}
async function init() {
  conditions = await API.getData(endpoints.reverbConditions);
  categories = await API.getData(endpoints.reverbCategories);
  optionFactory(conditions.conditions, null, conditionSelect, "reverb");
  optionFactory(categories.categories, null, categorySelect, "reverb");
}
init();
skuSearchSubmit.addEventListener("click", handleSearch);
reverbSubmit.addEventListener("click", (e) => postToReverb(e));

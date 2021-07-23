import { API, endpoints } from "../API.js";
import { buildTag } from "./domBuilders.js";
import { parseProducts } from "../models/product.js";
import { DomFactory } from "../util/DomFactory.js";
const skuSearch = document.getElementById("skuSearch");
const skuSearchSubmit = document.getElementById("skuSearchSubmit");
const styleSelect = document.getElementById("styleSelect");
const styleSubmit = document.getElementById("styleSubmit");
const backgroundSelect = document.getElementById("backgroundSelect");
const backgroundSubmit = document.getElementById("backgroundSubmit");

let product = null;
let stylePath = "/public/css/tagGenerator/";
let backgroundPath = "/public/css/tagGenerator/";
function removeStyle(type) {
  let current = document.getElementById(type);
  if (current) current.remove();
}

function buildLink(type, href) {
  removeStyle(type);
  let link = DomFactory({
    type: "link",
    attributes: {
      rel: "stylesheet",
      type: "text/css",
      href: href,
      id: type,
    },
  });
  document.getElementsByTagName("head")[0].appendChild(link);
}

async function handleSearch(e) {
  e.preventDefault();
  const SKU = skuSearch.value;
  product = parseProducts(await API.getData(`${endpoints.tags}/${SKU}`))[0];
  buildTag(product);
}

skuSearchSubmit.addEventListener("click", handleSearch);
styleSubmit.addEventListener("click", () =>
  buildLink("styleSheet", `${stylePath}${styleSelect.value}.css`)
);
backgroundSubmit.addEventListener("click", () =>
  buildLink("backgroundStyle", `${backgroundPath}${backgroundSelect.value}.css`)
);

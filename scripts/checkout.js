import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import {renderPaymentSummary} from "./checkout/paymentSummery.js";
import { loadProductsFetch } from "../data/products.js";
import { loadCartFetch } from "../data/cart.js";

async function loadPage() {
  try {
    // Error handeling...
    // throw 'error';

    await Promise.all([
      loadProductsFetch(),
      new Promise((resolve) => {
        loadCartFetch(() => {
          resolve();
        });
      })
    ])
  
  } catch (error) {
    console.log('unexpected error. please try again later.');
  }

  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
}
loadPage();

/*
--- Promise all --- 
Promise.all([
loadProductsFetch(),
new Promise((resolve) => {
  loadCart(() => {
    resolve();
  });
})

]).then(() => {

  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
});
*/

/*
--- Seprate Promises ---
new Promise((resolve) => {
  loadProducts(() => {
    resolve('step1');
  });

}).then((step) => {
  return new Promise((resolve) => {
    loadCart(() => {
      resolve('step2');
    });
  });

}).then((step) => {
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
});
*/

/*
--- Callbacks ---
loadProducts(() => {
  loadCart(() => {
    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();  
  });
});
*/
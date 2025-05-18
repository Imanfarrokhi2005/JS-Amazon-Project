import { getOrder } from "../data/ordersData.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import { updateCartQuantity } from "./orders.js";

const url = new URL(window.location.href);
updateCartQuantity();
renderTrack();

async function renderTrack() {

  await loadProductsFetch();

  const order = getOrder(url.searchParams.get('orderid'));
  const productId = url.searchParams.get('productid');
  const product = getProduct(productId);

  const orderProduct = findProductInOrder(order, productId);

  const currentTime = new Date();
  const orderTime = new Date(order.orderTime);
  const deliveryTime = new Date(orderProduct.estimatedDeliveryTime);
  const dateString = deliveryTime.toLocaleDateString('en-US', {
  month: 'long', day: 'numeric'
  });

  const timePrecentage = (
    (currentTime - orderTime) /
    (deliveryTime - orderTime) * 100).toFixed(1);

  const trackingHTML = 
    `<div class="order-tracking">
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on  ${dateString}
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${orderProduct.quantity}
    </div>

    <img class="product-image" src=${product.image}>

    <div class="progress-labels-container">
      <div class="progress-label" id="1">
        Preparing
      </div>
      <div class="progress-label" id="2">
        Shipped
      </div>
      <div class="progress-label" id="3">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar"></div>
    </div>
  </div>`;

  document.querySelector('.js-tracking-main').innerHTML = trackingHTML;
  const progressElement = document.querySelector('.progress-bar');
  progressElement.style.width = `${timePrecentage}%`;

  if (timePrecentage < 50) {
    document.getElementById('1').classList.add('current-status');
  } else if (timePrecentage < 100) {
    document.getElementById('2').classList.add('current-status');
  } else {
    document.getElementById('3').classList.add('current-status');
  }
}

function findProductInOrder(order, productId) {
  let matchingProduct;
  order.products.forEach((product) => {
    if (product.productId === productId) {
      matchingProduct = product;
    }
  });
  return matchingProduct;
}
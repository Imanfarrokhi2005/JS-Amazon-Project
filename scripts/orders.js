import { orders } from "../data/ordersData.js";
import {formatCurrency} from "../scripts/utils/money.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import {cart} from "../data/cart-class.js";

updateCartQuantity();
renderOrders();

async function renderOrders() {
  
  await loadProductsFetch();

  let ordersHTML = '';
  orders.forEach((order) => {

    const date = new Date(order.orderTime);
    const dateString = date.toLocaleDateString('en-US', {
      month: 'long', day: 'numeric'
    }); 

    ordersHTML += `
    <div class="order-container">
      
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${dateString}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${formatCurrency(order.totalCostCents)}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${order.id}</div>
        </div>
      </div> `;

      order.products.forEach((product) => {

        const {productId} = product;
        const matchingProduct = getProduct(productId);
        const date = new Date(product.estimatedDeliveryTime);
        const dateString = date.toLocaleDateString('en-US', {
        month: 'long', day: 'numeric'
        });

        ordersHTML +=
        `<div class="order-details-grid">
          <div class="product-image-container">
            <img src=${matchingProduct.image}>
          </div>

          <div class="product-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-delivery-date">
              Arriving on: ${dateString}
            </div>
            <div class="product-quantity">
              Quantity: ${product.quantity}
            </div>
            <button class="buy-again-button button-primary js-buy-again-button" data-product-id = "${matchingProduct.id}">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>

          <div class="product-actions">
            <a href=
            "tracking.html?orderid=${order.id}&productid=${productId}
            ">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
        </div>`;
    });
    ordersHTML += `
    </div>`;
  });

  console.log('load orders');
  const orderGridElement = document.querySelector('.js-order-grid');
  if (orderGridElement) {
    orderGridElement.innerHTML = ordersHTML;
  }

  if (orders.length === 0) {
    document.querySelector('.js-order-grid').innerHTML = `<div>
      Oops! You have'nt ordered anything yet...
    </div>`
  }

  document.querySelectorAll('.js-buy-again-button')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const {productId} = button.dataset;
        cart.addToCart(productId, 1);
        updateCartQuantity();
      });
  });
}

export function updateCartQuantity() {
  document.querySelector('.js-cart-quantity').innerHTML = 
  cart.calculateCartQuantity();
}
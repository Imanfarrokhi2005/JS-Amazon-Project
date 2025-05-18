import {cart} from '../../data/cart-class.js';
import {getProduct} from '../../data/products.js';
import formatCurrency from '../utils/money.js';
import {deliveryOptions, getDeliveryOption, claculateDeliveryDate} from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummery.js';
import {renderCheckoutHeader } from './checkoutHeader.js';

export function renderOrderSummary() {
  renderCheckoutHeader();
  let cartSummaryHTML = '';

  cart.cartItems.forEach((cartItem) =>  {

    const {productId} = cartItem;

    const matchingProduct = getProduct(productId);

    const {deliveryOptionId} = cartItem;
    
    const matchingOption = getDeliveryOption(deliveryOptionId);

    const dateString = claculateDeliveryDate(matchingOption);

    cartSummaryHTML +=
    `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
          src="${matchingProduct.image}">
    
        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            ${matchingProduct.getPrice()}
          </div>
          <div class="product-quantity">
            <span>
            Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}
            </span>
            <span class="link-primary js-update-link" data-product-id = ${matchingProduct.id}>
            Update
            </span>
            <input class ="quantity-input js-quantity-input-${matchingProduct.id}">
            <span class="save-quantity-link link-primary js-save-link" data-product-id = ${matchingProduct.id}>Save</span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id = "${matchingProduct.id}">
              Delete
            </span>
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      
      const dateString =claculateDeliveryDate(deliveryOption);

      const priceString = deliveryOption.priceCents === 0
      ? 'FREE'
      : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === 
      cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option"
        data-product-id = "${matchingProduct.id}"
        data-delivery-option-id = "${deliveryOption.id}">
          <input type="radio"
            ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>`
    });

    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const {productId} = link.dataset;
      cart.removeFromCart(productId);

      const container = document.querySelector(`.js-cart-item-container-${productId}`);

      container.remove();

      renderCheckoutHeader();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-update-link').forEach
  ((link) => {
    link.addEventListener('click', () => {
      const {productId} = link.dataset;
      document.querySelector(`.js-cart-item-container-${productId}`).classList.add('is-editing-quantity');
      saveWithEnter(productId);
    });
  });

  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      const {productId} = link.dataset;
      document.querySelector(`.js-cart-item-container-${productId}`).classList.remove('is-editing-quantity');

      const inputElement = document.querySelector(`.js-quantity-input-${productId}`);
      const inputValue = Number(inputElement.value);

      cart.updateQuantity(productId, inputValue);

      document.querySelector(`.js-quantity-label-${productId}`).innerHTML = inputValue;

      renderCheckoutHeader();
      renderPaymentSummary();
    });
  });

  function saveWithEnter(productId) {
    const inputElement = document.querySelector(`.js-quantity-input-${productId}`);
    inputElement.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        document.querySelector(`.js-cart-item-container-${productId}`).classList.remove('is-editing-quantity');

        const inputValue = Number(inputElement.value);
    
        cart.updateQuantity(productId, inputValue);
    
        document.querySelector(`.js-quantity-label-${productId}`).innerHTML = inputValue;

        renderCheckoutHeader();
        renderPaymentSummary();
      }
    });
  }

  document.querySelectorAll('.js-delivery-option')
  .forEach((element) => {
    element.addEventListener('click', () => {
      const {productId, deliveryOptionId} = element.dataset;
      cart.updateDeliveryOption(productId, deliveryOptionId);

      renderOrderSummary();
      renderPaymentSummary();
    })
  });

  renderCheckoutHeader();
}

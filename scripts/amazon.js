import {cart} from '../data/cart-class.js';
import {products, loadProducts} from '../data/products.js';

loadProducts(renderProductsGrid);

function renderProductsGrid() {
  updateCartQuantity();

  let productsHTML = '';
  let pageProducts = [];
  let timeOut;

  const url = new URL(window.location.href);
  const searchPram = url.searchParams.get('search');
  if (searchPram) {
    pageProducts = products.filter((product) => {
      const name = product.name.toLowerCase();
      const keywords = product.keywords;
      const nameCheck = name.includes(searchPram);
      let wordCheck;

      keywords.forEach((word) => {
        if (word.toLowerCase().includes(searchPram)) {
          wordCheck = true;
        }
      });

      return nameCheck || wordCheck;
    });
    if (pageProducts.length === 0) {
      alert('Oops! No item matched your search...');
    }
    console.log('load products with filter');
  } else {
    pageProducts = products;
  }
  
  pageProducts.forEach((product) => {

    productsHTML += `

        <div class="product-container">
          <div class="product-image-container">
            <img class="product-image"
            src="${product.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img      class="product-rating-stars"
            src="${product.getStarsUrl()}">
            <div class="product-rating-count link-primary">
                    ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <select class="js-quantity-selector-${product.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          ${product.extraInfoHTML()}

          <div class="product-spacer"></div>

            <div class="added-to-cart js-added-to-cart-${product.id}">
              <img src="images/icons/checkmark.png">
              Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
              Add to Cart
            </button>
        </div>`
  });

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  function updateCartQuantity() {

    const cartQuantity = cart.calculateCartQuantity();
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  }

  document.querySelectorAll('.js-add-to-cart').forEach((button) => {

    button.addEventListener('click', () => {

      const {productId} = button.dataset;
      clearTimeout(timeOut);

      const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
      
      const addedMessageElement = document.querySelector(`.js-added-to-cart-${productId}`)

      addedMessageElement.classList.add('added-to-cart-message')

      timeOut = setTimeout(() => {
        addedMessageElement.classList.remove('added-to-cart-message');
      }, 2000);
      
      let quantity = Number(quantitySelector.value);

      cart.addToCart(productId, quantity);
      updateCartQuantity();
    });
  });
}

document.querySelector('.js-search')
  .addEventListener('click', () => {
    const inputElement = document.querySelector('.js-search-input');
    const input = inputElement.value;
    console.log(input);
    
    window.location.href = `amazon.html?search=${input}`;
  });

document.querySelector('.js-search-input')
  .addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const inputElement = document.querySelector('.js-search-input');
      const input = inputElement.value;
      
      window.location.href = `amazon.html?search=${input}`;
    }
  });
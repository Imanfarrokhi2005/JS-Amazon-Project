export let cart;

loadFromStorage();

export function loadFromStorage() {
 cart = JSON.parse(localStorage.getItem('cart'));

 if (!cart) {
  cart = [];
  }
}

export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } 
  
  else {
    cart.push({
      productId,
      quantity: 1,
      deliveryOptionId : '1'
    }); 
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  let newCart = [];
  
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  })

  cart = newCart;

  saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
  if ((newQuantity >= 0) && (newQuantity < 1000)) {
    let matchingItem;
    cart.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
    matchingItem.quantity = newQuantity;
    saveToStorage();
  } else {
    alert('You entered an Invalid quantity for your items!');
  }
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}

// export function loadCart(fun) {
//   const xhr = new XMLHttpRequest();

//   xhr.addEventListener('load', () => {
//     console.log(xhr.response);
//     fun();
//   });

//   xhr.open('GET', 'https://supersimplebackend.dev/cart');
//   xhr.send();
// }

export async function loadCartFetch(fun) {
  await fetch('https://supersimplebackend.dev/cart').then((response) => {
    return response.text();
  }).then((text) => {
    console.log(text);
    fun();
  });
}
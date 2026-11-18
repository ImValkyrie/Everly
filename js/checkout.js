const checkoutAccessToken = localStorage.getItem("accessToken");

if (!checkoutAccessToken) {
  window.location.replace("../account/login.html");
}

const cart = JSON.parse(localStorage.getItem("cart") || "[]");
const checkoutItems = document.querySelector("#checkout-items");
const checkoutItemCount = document.querySelector("#checkout-item-count");
const checkoutSubtotal = document.querySelector("#checkout-subtotal");
const checkoutTotal = document.querySelector("#checkout-total");
const checkoutForm = document.querySelector("#checkout-form");
const purchaseButton = document.querySelector(".place-order-button");
purchaseButton.disabled = true;

const apiUrl = "https://v2.api.noroff.dev/online-shop";
let orderTotal = 0;

async function loadCheckoutProducts() {
  try {
    if (cart.length === 0) {
      checkoutItems.textContent = "Your shopping cart is empty";
      return;
    }
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const result = await response.json();
    const products = result.data || [];
    const allProductsFound = cart.every((cartItem) =>
      products.some((product) => product.id === cartItem.id),
    );
    if (!allProductsFound) {
      checkoutItems.textContent = "Some products are no longer available.";
      return;
    }
    let subtotal = 0;
    let itemCount = 0;
    checkoutItems.innerHTML = "";

    cart.forEach((cartItem) => {
      const matchingProduct = products.find(
        (product) => product.id === cartItem.id,
      );

      if (matchingProduct) {
        console.log("Product", matchingProduct.title);
        console.log("Quantity", cartItem.quantity);
        const productRow = document.createElement("div");
        productRow.classList.add("cart-item");
        const productTitle = document.createElement("h3");
        productTitle.textContent = matchingProduct.title;

        const productImage = document.createElement("img");

        productImage.src = matchingProduct.image.url;
        productImage.alt = matchingProduct.image.alt || matchingProduct.title;
        productImage.classList.add("cart-item-image");

        const productDetails = document.createElement("div");
        productDetails.classList.add("cart-item-details");

        productDetails.appendChild(productTitle);

        const productInfo = document.createElement("div");
        productInfo.classList.add("cart-item-info");

        productInfo.appendChild(productImage);
        productInfo.appendChild(productDetails);
        productRow.appendChild(productInfo);

        const price = matchingProduct.discountedPrice ?? matchingProduct.price;

        const quantityText = document.createElement("span");
        quantityText.classList.add("cart-item-quantity");
        quantityText.textContent = `Qty: ${cartItem.quantity}`;

        const lineTotal = price * cartItem.quantity;
        subtotal += lineTotal;
        itemCount += cartItem.quantity;
        const totalText = document.createElement("span");
        totalText.classList.add("cart-item-total");
        totalText.textContent = `${lineTotal.toFixed(2)} kr`;

        productDetails.appendChild(quantityText);
        productRow.appendChild(totalText);

        checkoutItems.appendChild(productRow);
      }
    });

    checkoutItemCount.textContent = itemCount;
    checkoutSubtotal.textContent = `${subtotal.toFixed(2)} kr`;
    checkoutTotal.textContent = `${subtotal.toFixed(2)} kr`;
    orderTotal = subtotal;
    purchaseButton.disabled = false;

    console.log("Products from API", products);
  } catch (error) {
    console.error("Error loading checkout products", error);
    checkoutItems.textContent = "Unable to load products. Please try again.";
  }
}

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!localStorage.getItem("accessToken")) {
    window.location.replace("../account/login.html");
    return;
  }

  if (purchaseButton.disabled) {
    return;
  }

  const order = {
    orderNumber: `EV-${Date.now().toString().slice(-6)}`,
    total: orderTotal,
  };

  localStorage.setItem("lastOrder", JSON.stringify(order));

  localStorage.removeItem("cart");
  window.location.href = "../success/index.html";
});

loadCheckoutProducts();
console.log("Saved cart:", cart);

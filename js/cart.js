let cart = JSON.parse(localStorage.getItem("everly-cart") || "[]");
const cartItemsContainer = document.querySelector("#cart-items");
const emptyCartMessage = document.querySelector("#empty-cart-message");
const cartItemCount = document.querySelector("#cart-item-count");
const cartSubtotal = document.querySelector("#cart-subtotal");
const cartTotal = document.querySelector("#cart-total");
const clearCartButton = document.querySelector("#clear-cart");
const cartTableHeader = document.querySelector(".cart-table-header");
const checkoutButton = document.querySelector(".checkout-button");
const apiUrl = "https://v2.api.noroff.dev/online-shop";

async function loadCartProduct() {
  cart = JSON.parse(localStorage.getItem("everly-cart") || "[]");
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const result = await response.json();
    const products = result.data || [];
    let subtotal = 0;
    let itemCount = 0;
    cartItemsContainer.innerHTML = "";
    emptyCartMessage.hidden = cart.length > 0;

    cartTableHeader.hidden = cart.length === 0;
    clearCartButton.hidden = cart.length === 0;
    checkoutButton.hidden = cart.length === 0;

    cart.forEach((cartItem) => {
      const matchingProduct = products.find(
        (product) => product.id === cartItem.id,
      );

      if (matchingProduct) {
        const productRow = document.createElement("div");
        productRow.classList.add("cart-item");
        const productTitle = document.createElement("h3");
        productTitle.textContent = matchingProduct.title;

        const stockText = document.createElement("span");
        stockText.classList.add("cart-item-stock");
        stockText.textContent = "In stock";

        const productImage = document.createElement("img");

        productImage.src = matchingProduct.image.url;
        productImage.alt = matchingProduct.image.alt || matchingProduct.title;
        productImage.classList.add("cart-item-image");

        const productDetails = document.createElement("div");
        productDetails.classList.add("cart-item-details");

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.classList.add("remove-item");
        removeButton.setAttribute(
          "aria-label",
          `Remove ${matchingProduct.title}`,
        );
        removeButton.addEventListener("click", () => {
          const itemIndex = cart.findIndex((item) => item.id === cartItem.id);

          if (itemIndex !== -1) {
            cart.splice(itemIndex, 1);

            localStorage.setItem("everly-cart", JSON.stringify(cart));
            updateCartCount();
            loadCartProduct();
          }
        });
        productDetails.appendChild(productTitle);
        productDetails.appendChild(stockText);
        productDetails.appendChild(removeButton);

        const productInfo = document.createElement("div");
        productInfo.classList.add("cart-item-info");

        productInfo.appendChild(productImage);
        productInfo.appendChild(productDetails);
        productRow.appendChild(productInfo);

        const productPrice = document.createElement("span");
        productPrice.classList.add("cart-item-price");

        const price = matchingProduct.discountedPrice ?? matchingProduct.price;

        productPrice.textContent = `${price.toFixed(2)} kr`;
        const quantityText = document.createElement("span");
        quantityText.classList.add("cart-item-quantity");
        quantityText.textContent = cartItem.quantity;
        const decreaseButton = document.createElement("button");
        decreaseButton.type = "button";
        decreaseButton.textContent = "-";
        decreaseButton.setAttribute("aria-label", "Decrease quantity");
        decreaseButton.addEventListener("click", () => {
          if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;

            localStorage.setItem("everly-cart", JSON.stringify(cart));
            updateCartCount();
            loadCartProduct();
          }
        });

        const increaseButton = document.createElement("button");
        increaseButton.type = "button";
        increaseButton.textContent = "+";
        increaseButton.setAttribute("aria-label", "Increase quantity");
        increaseButton.addEventListener("click", () => {
          cartItem.quantity += 1;
          localStorage.setItem("everly-cart", JSON.stringify(cart));
          updateCartCount();
          loadCartProduct();
        });
        const quantityControls = document.createElement("div");
        quantityControls.classList.add("quantity-controls");

        quantityControls.appendChild(decreaseButton);
        quantityControls.appendChild(quantityText);
        quantityControls.appendChild(increaseButton);

        const lineTotal = price * cartItem.quantity;
        subtotal += lineTotal;
        itemCount += cartItem.quantity;
        const totalText = document.createElement("span");
        totalText.classList.add("cart-item-total");
        totalText.textContent = `${lineTotal.toFixed(2)} kr`;

        productRow.appendChild(productPrice);
        productRow.appendChild(quantityControls);
        productRow.appendChild(totalText);

        cartItemsContainer.appendChild(productRow);
      }
    });

    cartItemCount.textContent = itemCount;
    cartSubtotal.textContent = `${subtotal.toFixed(2)} kr`;
    cartTotal.textContent = `${subtotal.toFixed(2)} kr`;
  } catch (error) {
    console.error("Error loading cart products", error);
  }
}

clearCartButton.addEventListener("click", () => {
  cart.length = 0;
  localStorage.setItem("everly-cart", JSON.stringify(cart));
  updateCartCount();
  loadCartProduct();
});
loadCartProduct();

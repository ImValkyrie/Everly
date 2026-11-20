const miniCartItems = document.querySelector("#mini-cart-items");
const miniCartSubtotal = document.querySelector("#mini-cart-subtotal");
const miniCartApiUrl = "https://v2.api.noroff.dev/online-shop";

async function loadMiniCart() {
  const cart = JSON.parse(localStorage.getItem("everly-cart") || "[]");
  miniCartItems.innerHTML = "";
  if (cart.length === 0) {
    miniCartItems.textContent = "Your shopping cart is empty";
    miniCartSubtotal.textContent = "0.00 kr";
    return;
  }
  try {
    const response = await fetch(miniCartApiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const result = await response.json();
    const products = result.data || [];
    let subtotal = 0;
    cart.forEach((cartItem) => {
      const matchingProduct = products.find(
        (product) => product.id === cartItem.id,
      );

      if (matchingProduct) {
        const productRow = document.createElement("div");
        productRow.classList.add("mini-cart-item");
        const productImage = document.createElement("img");

        productImage.src = matchingProduct.image.url;
        productImage.alt = matchingProduct.image.alt || matchingProduct.title;
        productImage.classList.add("mini-cart-image");

        productRow.appendChild(productImage);
        const productDetails = document.createElement("div");
        productDetails.classList.add("mini-cart-details");

        const productTitle = document.createElement("h3");
        productTitle.textContent = matchingProduct.title;

        const quantityText = document.createElement("span");
        quantityText.classList.add("mini-cart-quantity");
        quantityText.textContent = `Qty: ${cartItem.quantity}`;

        const productPrice = document.createElement("span");
        productPrice.classList.add("mini-cart-price");

        const price = matchingProduct.discountedPrice ?? matchingProduct.price;
        productPrice.textContent = `${price.toFixed(2)} kr`;

        productDetails.appendChild(productTitle);
        productDetails.appendChild(quantityText);
        productDetails.appendChild(productPrice);

        productRow.appendChild(productDetails);

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.classList.add("mini-cart-remove");
        removeButton.innerHTML = `<i class="fa-solid fa-trash" aria-hidden="true"></i>`;
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
            loadMiniCart();

            if (typeof loadCartProduct === "function") {
              loadCartProduct();
            }

            if (typeof loadCheckoutProducts === "function") {
              loadCheckoutProducts();
            }
          }
        });
        productRow.appendChild(removeButton);

        const lineTotal = price * cartItem.quantity;
        subtotal += lineTotal;

        miniCartItems.appendChild(productRow);
      }
    });

    miniCartSubtotal.textContent = `${subtotal.toFixed(2)} kr`;
  } catch (error) {
    console.error("Error loading mini cart products", error);
    miniCartItems.textContent = "Unable to load your shopping cart.";
    miniCartSubtotal.textContent = "-";
  }
}

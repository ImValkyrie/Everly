const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const apiUrl = `https://v2.api.noroff.dev/online-shop/${productId}`;

async function getProduct() {
  const response = await fetch(apiUrl);
  const result = await response.json();
  const product = result.data;
  const statusElement = document.querySelector("#product-status");
  const titleElement = document.querySelector("#product-title");
  statusElement.hidden = true;
  titleElement.textContent = product.title;

  const descriptionElement = document.querySelector("#product-description");
  descriptionElement.textContent = product.description;

  const priceElement = document.querySelector("#product-price");
  priceElement.textContent = `${product.price.toFixed(2)} kr`;

  const discountedPriceElement = document.querySelector(
    "#product-discounted-price",
  );
  if (product.discountedPrice < product.price) {
    discountedPriceElement.textContent = `${product.discountedPrice.toFixed(2)} kr`;
    priceElement.classList.add("on-sale");
  }

  const imageElement = document.querySelector("#product-image");
  imageElement.src = product.image.url;
  imageElement.alt = product.image.alt;

  const ratingElement = document.querySelector("#product-rating-value");
  if (product.rating === 0) {
    ratingElement.textContent = "Not rated yet";
    ratingElement.classList.add("no-rating");
  } else {
    const filledStars = "★".repeat(product.rating);
    const emptyStars = "☆".repeat(5 - product.rating);
    ratingElement.textContent = filledStars + emptyStars;
  }

  const tagsElement = document.querySelector("#product-tags");
  tagsElement.textContent = product.tags.join(", ");

  const reviewsElement = document.querySelector("#product-reviews");
  if (product.reviews.length === 0) {
    reviewsElement.textContent =
      "No reviews yet. Be the first to share your thoughts!";
  } else {
    product.reviews.forEach((review) => {
      const reviewCard = document.createElement("div");
      reviewCard.classList.add("review-card");
      reviewsElement.appendChild(reviewCard);
      const reviewParagraph = document.createElement("p");
      reviewParagraph.classList.add("review-username");
      reviewParagraph.textContent = review.username;
      reviewCard.appendChild(reviewParagraph);
      const descriptionParagraph = document.createElement("p");
      descriptionParagraph.textContent = review.description;
      reviewCard.appendChild(descriptionParagraph);
      const ratingParagraph = document.createElement("p");
      ratingParagraph.classList.add("review-rating");
      const reviewFilledStars = "★".repeat(review.rating);
      const reviewEmptyStars = "☆".repeat(5 - review.rating);
      ratingParagraph.textContent = reviewFilledStars + reviewEmptyStars;
      reviewCard.appendChild(ratingParagraph);
    });
  }

  const contentElement = document.querySelector("#product-content");
  contentElement.hidden = false;

  const shareButton = document.querySelector("#share-product");
  shareButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      shareButton.querySelector("span").textContent = "Link copied!";
    } catch (error) {
      shareButton.querySelector("span").textContent = "Unable to copy";
    }
    setTimeout(() => {
      shareButton.querySelector("span").textContent = "Share product";
    }, 2000);
  });

  const addToCartButton = document.querySelector("#add-to-cart");
  if (!localStorage.getItem("accessToken")) {
    addToCartButton.textContent = "Log in to add to cart";
  }
  addToCartButton.addEventListener("click", () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      window.location.href = "../account/login.html";
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProduct = cart.find((item) => {
      return item.id === product.id;
    });
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        quantity: 1,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  });
}

getProduct();

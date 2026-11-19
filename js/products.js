const productGrid = document.querySelector(".product-grid");
const apiUrl = "https://v2.api.noroff.dev/online-shop";

const categoryImages = {
  beauty: "Vanilla Perfume",
  fashion: "Red bag",
  toys: "Toy car",
  electronics: "Gold headphones",
};

const categoryTags = {
  beauty: ["beauty", "perfume", "skin care", "shampoo"],
  fashion: [
    "fashion",
    "shoes",
    "bags",
    "glasses",
    "jewelry",
    "watches",
    "accessories",
    "watch",
  ],
  toys: ["toy"],
  electronics: [
    "electronics",
    "headphones",
    "storage",
    "audio",
    "wearables",
    "peripherals",
    "gaming",
    "computers",
  ],
  watches: ["watch", "watches"],
  audio: ["headphones", "audio"],
  peripherals: ["peripherals", "computers"],
};

let allProducts = [];
let carouselProducts = [];
let currentSlide = 0;

async function getProducts() {
  const status = document.querySelector(".products-status");

  status.textContent = "Loading products...";

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const result = await response.json();
    const products = result.data || [];
    allProducts = products;
    const params = new URLSearchParams(window.location.search);
    const selectedCategory = params.get("category");

    carouselProducts = [
      products.find((product) => product.title === "Gold Earrings"),
      products.find((product) => product.title === "Gold glasses"),
      products.find((product) => product.title === "Pink shoes"),
    ].filter(Boolean);

    const displayedProducts = products.slice(0, 12);

    productGrid.innerHTML = "";

    if (displayedProducts.length === 0) {
      status.textContent = "No products available right now.";
      return;
    }
    displayedProducts.forEach((product) => {
      renderProductCard(product);
    });

    status.textContent = "";

    displayCategoryImages(products);
    if (selectedCategory) {
      filterProducts(selectedCategory);
    }
    if (carouselProducts.length > 0) {
      showCarouselProduct();
    }
  } catch (error) {
    console.error("Error loading products:", error);
    status.textContent =
      "We couldn't load the products. Please try again later.";
  }
}

function renderProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  const title = document.createElement("h3");
  title.className = "product-title";
  title.textContent = product.title;
  const imageContainer = document.createElement("div");
  imageContainer.className = "product-image";

  const image = document.createElement("img");
  image.src = product.image.url;
  image.alt = product.image.alt || product.title;
  imageContainer.appendChild(image);

  const price = document.createElement("div");
  price.className = "product-price";
  if (product.discountedPrice < product.price) {
    const originalPrice = document.createElement("span");
    originalPrice.className = "product-original-price";
    originalPrice.textContent = `${product.price.toFixed(2)} kr`;

    price.appendChild(originalPrice);
  }

  const currentPrice = document.createElement("span");
  currentPrice.className = "product-current-price";
  currentPrice.textContent = `${product.discountedPrice.toFixed(2)} kr`;

  price.appendChild(currentPrice);

  const productLink = document.createElement("a");
  productLink.href = `product/index.html?id=${product.id}`;
  productLink.className = "product-link";
  productLink.setAttribute("aria-label", `View ${product.title}`);

  productLink.appendChild(imageContainer);
  productLink.appendChild(title);

  card.appendChild(productLink);
  card.appendChild(price);

  productGrid.appendChild(card);
}

function showCarouselProduct() {
  const product = carouselProducts[currentSlide];
  if (!product) return;

  const imageContainer = document.querySelector(".carousel-image");
  const heroButton = document.querySelector(".hero-button");
  const dots = document.querySelectorAll(".carousel-dots .dot");

  const image = document.createElement("img");
  image.src = product.image.url;
  image.alt = product.image.alt || product.title;
  image.dataset.product = product.title;

  imageContainer.replaceChildren(image);
  heroButton.href = `product/index.html?id=${product.id}`;
  imageContainer.href = heroButton.href;
  imageContainer.setAttribute("aria-label", `View ${product.title}`);

  dots.forEach((dot, index) => {
    const isActive = index === currentSlide;

    dot.classList.toggle("active", isActive);

    if (isActive) {
      dot.setAttribute("aria-current", "true");
    } else {
      dot.removeAttribute("aria-current");
    }
  });
}
function displayCategoryImages(products) {
  const categoryCards = document.querySelectorAll(".category-card");

  categoryCards.forEach((card) => {
    const category = card.dataset.category;
    const productTitle = categoryImages[category];

    const product = products.find((item) => item.title === productTitle);

    if (!product?.image?.url) {
      return;
    }

    const imageContainer = card.querySelector(".category-image");
    if (!imageContainer) {
      return;
    }
    const image = document.createElement("img");

    image.src = product.image.url;
    image.alt = product.image.alt || product.title;

    imageContainer.replaceChildren(image);
  });
}
function filterProducts(category) {
  const tags = categoryTags[category] || [category];
  const filteredProducts = allProducts.filter(
    (product) =>
      category === "all" ||
      product.tags?.some((tag) => tags.includes(tag.toLowerCase())),
  );

  productGrid.innerHTML = "";
  filteredProducts.forEach((product) => {
    renderProductCard(product);
  });
}

document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", () => {
    filterProducts(card.dataset.category);
  });
});

document.querySelector(".all-products-btn").addEventListener("click", () => {
  productGrid.innerHTML = "";

  allProducts.forEach((product) => {
    renderProductCard(product);
  });
});

document.querySelector(".next-carousel").addEventListener("click", () => {
  if (carouselProducts.length === 0) return;

  currentSlide = (currentSlide + 1) % carouselProducts.length;
  showCarouselProduct();
});

document.querySelector(".prev-carousel").addEventListener("click", () => {
  if (carouselProducts.length === 0) return;

  currentSlide =
    (currentSlide - 1 + carouselProducts.length) % carouselProducts.length;

  showCarouselProduct();
});

document.querySelectorAll(".carousel-dots .dot").forEach((dot, index) => {
  dot.addEventListener("click", () => {
    if (index >= carouselProducts.length) return;

    currentSlide = index;
    showCarouselProduct();
  });
});

getProducts();

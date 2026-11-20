const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");
const loginLinks = document.querySelectorAll(".login-link, .mobile-login a");
const navAccessToken = localStorage.getItem("accessToken");
const cartCount = document.querySelector(".cart-count");

menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", isOpen);
});

if (navAccessToken) {
  loginLinks.forEach((link) => {
    link.textContent = "Log out";
    link.addEventListener("click", (event) => {
      event.preventDefault();

      localStorage.removeItem("accessToken");
      window.location.reload();
    });
  });
}

function updateCartCount() {
  if (!cartCount) return;

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  let totalQuantity = 0;

  cart.forEach((item) => {
    totalQuantity += item.quantity;
  });

  cartCount.textContent = totalQuantity;
  cartCount.hidden = totalQuantity === 0;
}

updateCartCount();

const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

dropdownToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const menu = toggle.nextElementSibling;
    dropdownToggles.forEach((otherToggle) => {
      if (otherToggle !== toggle) {
        otherToggle.nextElementSibling.hidden = true;
        otherToggle.setAttribute("aria-expanded", "false");
      }
    });

    menu.hidden = !menu.hidden;
    toggle.setAttribute("aria-expanded", !menu.hidden);
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-dropdown")) {
    dropdownToggles.forEach((toggle) => {
      toggle.nextElementSibling.hidden = true;
      toggle.setAttribute("aria-expanded", false);
    });
  }
});

const searchButton = document.querySelector(".search-button");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

if (searchButton && searchForm) {
  searchButton.addEventListener("click", () => {
    searchForm.hidden = !searchForm.hidden;

    searchButton.setAttribute("aria-expanded", !searchForm.hidden);

    if (!searchForm.hidden) {
      searchInput.focus();
    }
  });
}

const miniCartButton = document.querySelector(".cart-link");
const miniCart = document.querySelector("#mini-cart");
const miniCartClose = document.querySelector(".mini-cart-close");

if (miniCartButton && miniCart && miniCartClose) {
  miniCartButton.addEventListener("click", () => {
    miniCart.hidden = !miniCart.hidden;
    miniCartButton.setAttribute("aria-expanded", !miniCart.hidden);
    if (!miniCart.hidden) {
      loadMiniCart();
    }
  });

  miniCartClose.addEventListener("click", () => {
    miniCart.hidden = true;
    miniCartButton.setAttribute("aria-expanded", "false");
    miniCartButton.focus();
  });

  document.addEventListener("click", (event) => {
    if (
      !event.composedPath().includes(miniCart) &&
      !event.composedPath().includes(miniCartButton)
    ) {
      miniCart.hidden = true;
      miniCartButton.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !miniCart.hidden) {
      miniCart.hidden = true;
      miniCartButton.setAttribute("aria-expanded", "false");
      miniCartButton.focus();
    }
  });
}

const comingSoonDialog = document.querySelector("#coming-soon-dialog");
const comingSoonLinks = document.querySelectorAll(".coming-soon-link");
const closeComingSoon = document.querySelector("#close-coming-soon");

if (comingSoonDialog) {
  comingSoonLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      comingSoonDialog.showModal();
    });
  });

  closeComingSoon.addEventListener("click", () => {
    comingSoonDialog.close();
  });
}

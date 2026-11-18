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

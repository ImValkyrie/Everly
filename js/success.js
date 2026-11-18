const order = JSON.parse(localStorage.getItem("lastOrder") || "null");

const orderNumber = document.querySelector("#order-number");
const orderTotal = document.querySelector("#order-total");

if (order) {
  orderNumber.textContent = order.orderNumber;
  orderTotal.textContent = `${order.total.toFixed(2)} kr`;
} else {
  window.location.href = "../index.html";
}

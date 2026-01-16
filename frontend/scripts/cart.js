const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

const cartContainer = document.querySelector(".cart-container");
const totalPriceEl = document.getElementById("totalPrice");

function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalPriceEl.textContent = "";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    cartContainer.innerHTML += `
      <div class="item">
        <p><b>${item.name}</b></p>
        <p>Price: $${item.price}</p>

        <input 
          type="number" 
          min="1" 
          value="${item.qty}" 
          onchange="updateQty(${index}, this.value)"
        >

        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });

  totalPriceEl.textContent = `Total: $${total.toFixed(2)}`;
}

window.updateQty = function(index, newQty) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart[index].qty = Number(newQty);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
};

window.removeItem = function(index) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
};

document.getElementById("clearCartBtn").onclick = () => {
  localStorage.removeItem("cart");
  loadCart();
};

document.getElementById("checkoutBtn").onclick = () => {
  alert("Checkout coming next! 🚀");
};

document.getElementById("checkoutBtn").onclick = async () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const items = cart.map(item => ({
    product_id: item.id,
    quantity: item.qty
  }));

  const res = await fetch("http://localhost:5000/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ items })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Order placed successfully!");
    localStorage.removeItem("cart");
    window.location.href = "customerOrders.html";
  } else {
    alert(data.message);
  }
};


loadCart();

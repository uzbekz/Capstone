const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

const container = document.querySelector(".orders-container");

async function loadOrders() {
  const res = await fetch("http://localhost:5000/orders/all", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const orders = await res.json();

  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  orders.forEach(order => {
    let itemsHTML = "";

    order.items.forEach(item => {
      itemsHTML += `
        <li>
          ${item.Product.name} x ${item.quantity} — $${item.price}
        </li>
      `;
    });

    container.innerHTML += `
      <div class="order">
        <h3>Order #${order.id}</h3>
        <p>Status: <b class="${order.status}">${order.status}</b></p>
        <p>Total: $${order.total_price}</p>
        <p>Date: ${new Date(order.createdAt || order.created_at).toLocaleString()}</p>

        <ul>${itemsHTML}</ul>

        ${order.status === "pending" ? `
          <button onclick="dispatchOrder(${order.id})">Dispatch</button>
          <button onclick="cancelOrder(${order.id})">Cancel</button>
        ` : ""}
      </div>
    `;
  });
}

window.dispatchOrder = async function(id) {
  const res = await fetch(`http://localhost:5000/orders/${id}/dispatch`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();
  alert(data.message);
  loadOrders();
};

window.cancelOrder = async function(id) {
  const res = await fetch(`http://localhost:5000/orders/${id}/cancel`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();
  alert(data.message);
  loadOrders();
};

loadOrders();

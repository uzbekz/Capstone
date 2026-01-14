import { getProducts } from "./api.js";

const token = localStorage.getItem("token");
if (!token) window.location.href = "login.html";

let allProducts = [];

const productContainer = document.querySelector(".product-array");
const loading = document.querySelector(".loading");
const emptyState = document.querySelector(".empty-state");
const categoryFilter = document.querySelector(".category-filter");
const sortFilter = document.querySelector(".sort-filter");
const searchInput = document.querySelector(".search-bar");

function showLoading(show) {
  loading.style.display = show ? "block" : "none";
}

function convertToBase64(buffer) {
  if (!buffer) return "";
  const bytes = new Uint8Array(buffer.data);
  let binary = "";
  bytes.forEach(b => binary += String.fromCharCode(b));
  return `data:image/jpeg;base64,${btoa(binary)}`;
}

function renderCategoryOptions(products) {
  const categories = [...new Set(products.map(p => p.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    categoryFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

function renderProducts(products) {
  productContainer.innerHTML = "";

  if (products.length === 0) {
    emptyState.style.display = "block";
    return;
  } else {
    emptyState.style.display = "none";
  }

  products.forEach(product => {
    const imageSrc = convertToBase64(product.image);
    const lowStock = product.quantity < 10;

    productContainer.innerHTML += `
      <div style="border:2px solid ${lowStock ? "red" : "#ccc"}; padding:10px; width:320px;">
        ${lowStock ? '<p style="color:red;">⚠ Low Stock</p>' : ""}
        <img width="300" height="300" style="object-fit:cover;" src="${imageSrc}">
        <p><b>${product.name}</b></p>
        <p>${product.description}</p>
        <p>Category: ${product.category}</p>
        <p>Price: $${product.price}</p>
        <p>Stock: ${product.quantity}</p>

        <input 
          type="number" 
          min="1" 
          max="${product.quantity}" 
          value="1"
          id="qty-${product.id}"
        >

        <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
          Add to Cart
        </button>
      </div>
    `;
  });
}

async function loadProducts() {
  showLoading(true);
  allProducts = await getProducts();
  renderCategoryOptions(allProducts);
  renderProducts(allProducts);
  showLoading(false);
}

loadProducts();

// 🛒 CART LOGIC
window.addToCart = function(id, name, price) {
  const qty = Number(document.getElementById(`qty-${id}`).value);

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, name, price, qty });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
};

// 🔍 Search
searchInput.addEventListener("input", applyFilters);

// 🔽 Category Filter
categoryFilter.addEventListener("change", applyFilters);

// ↕ Sort
sortFilter.addEventListener("change", applyFilters);

function applyFilters() {
  let filtered = [...allProducts];

  const searchText = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const sort = sortFilter.value;

  if (searchText) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchText) ||
      p.category.toLowerCase().includes(searchText)
    );
  }

  if (category !== "all") {
    filtered = filtered.filter(p => p.category === category);
  }

  if (sort === "price-low-to-high") filtered.sort((a, b) => a.price - b.price);
  if (sort === "price-high-to-low") filtered.sort((a, b) => b.price - a.price);
  if (sort === "quantity-low-to-high") filtered.sort((a, b) => a.quantity - b.quantity);
  if (sort === "quantity-high-to-low") filtered.sort((a, b) => b.quantity - a.quantity);

  renderProducts(filtered);
}

// 🔐 Logout
document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("cart");
  window.location.href = "login.html";
};

import { getProducts, deleteProduct, updateProduct } from './api.js';

function convertToBase64(buffer) {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer.data);
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return `data:image/jpeg;base64,${btoa(binary)}`;
}

let allProducts = [];

const productContainer = document.querySelector('.product-array');
const loading = document.querySelector('.loading');
const emptyState = document.querySelector('.empty-state');
const categoryFilter = document.querySelector('.category-filter');
const sortFilter = document.querySelector('.sort-filter');
const searchInput = document.querySelector('.search-bar');

function showLoading(show) {
  loading.style.display = show ? 'block' : 'none';
}

function renderCategoryOptions(products) {
  const categories = [...new Set(products.map(p => p.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    categoryFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

function renderProducts(products) {
  productContainer.innerHTML = '';

  if (products.length === 0) {
    emptyState.style.display = 'block';
    return;
  } else {
    emptyState.style.display = 'none';
  }

  products.forEach(product => {
    const imageSrc = convertToBase64(product.image);
    const lowStock = product.quantity < 10;

    productContainer.innerHTML += `
      <div style="
        border:2px solid ${lowStock ? 'red' : '#ccc'};
        padding:10px;
        width:320px;
      ">
        ${lowStock ? '<p style="color:red;">⚠ Low Stock</p>' : ''}
        <img width="300" height="300" style="object-fit:cover;" src="${imageSrc}">
        <p><b>${product.name}</b></p>
        <p>${product.description}</p>
        <p>Category: ${product.category}</p>
        <p>Price: $${product.price}</p>
        <p>Qty: ${product.quantity}</p>

        <button onclick="editProduct(${product.id})">Edit</button>
        <button onclick="deleteItem(${product.id})">Delete</button>

        <div style="margin-top:10px;">
          <button onclick="restock(${product.id}, 10)">+10</button>
          <button onclick="restock(${product.id}, 50)">+50</button>
          <button onclick="restock(${product.id}, 100)">+100</button>
        </div>
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

window.deleteItem = async function(id) {
  if (confirm("Delete this product?")) {
    await deleteProduct(id);
    loadProducts();
  }
};

window.editProduct = function(id) {
  window.location.href = `addProduct.html?id=${id}`;
};

window.restock = async function(id, amount) {
  const product = allProducts.find(p => p.id === id);
  const formData = new FormData();

  formData.set("quantity", product.quantity + amount);

  await updateProduct(id, formData);
  loadProducts();
};


// 🔍 Search
searchInput.addEventListener('input', applyFilters);

// 🔽 Category Filter
categoryFilter.addEventListener('change', applyFilters);

// ↕ Sort
sortFilter.addEventListener('change', applyFilters);

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

  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  if (sort === 'price-low-to-high') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-high-to-low') filtered.sort((a, b) => b.price - a.price);
  if (sort === 'quantity-low-to-high') filtered.sort((a, b) => a.quantity - b.quantity);
  if (sort === 'quantity-high-to-low') filtered.sort((a, b) => b.quantity - a.quantity);

  renderProducts(filtered);
}

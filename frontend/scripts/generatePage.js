import { getProducts } from './api.js';
import { deleteProduct } from './api.js';

function convertToBase64(buffer) {
  if (!buffer) return '';
  const bytes = new Uint8Array(buffer.data);
  let binary = '';
  bytes.forEach(b => binary += String.fromCharCode(b));
  return `data:image/jpeg;base64,${btoa(binary)}`;
}

let allProducts = [];

function renderProducts(products) {
  const bodyElement = document.querySelector('.product-array');
  let productsPageHTML = '';

  products.forEach((product) => {
    const imageSrc = convertToBase64(product.image);

    productsPageHTML += `
      <div style="border:1px solid #ccc; padding:10px; margin:10px; width:320px;">
        <img width="300" height="300" style="object-fit: cover;" src="${imageSrc}">
        <p><b>${product.name}</b></p>
        <p>${product.description}</p>
        <p>Category: ${product.category}</p>
        <p>Price: $${product.price}</p>
        <p>Qty: ${product.quantity}</p>
        <p>Weight: ${product.weight}</p>
        <button onclick="editProduct(${product.id})">Edit</button>
        <button onclick="deleteItem(${product.id})">Delete</button>
      </div>
    `;
  });

  bodyElement.innerHTML = productsPageHTML;
}

async function generate() {
  allProducts = await getProducts();
  renderProducts(allProducts);
}

generate();

// Make delete function global
window.deleteItem = async function(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    await deleteProduct(id);
    allProducts = await getProducts();
    renderProducts(allProducts);
  }
};

window.editProduct = function(id) {
  window.location.href = `addProduct.html?id=${id}`;
};

// 🔍 SEARCH FEATURE
const searchInput = document.querySelector('.search-bar');

searchInput.addEventListener('input', () => {
  const searchText = searchInput.value.toLowerCase();

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchText) ||
    product.category.toLowerCase().includes(searchText)
  );

  renderProducts(filteredProducts);
});

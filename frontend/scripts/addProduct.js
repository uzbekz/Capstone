import { addProduct, getProductById, updateProduct } from "./api.js";

const form = document.querySelector('.add-product-form');
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

// If editing → prefill form
if (productId) {
  document.querySelector("h2").textContent = "Edit Product";

  const product = await getProductById(productId);

  document.getElementById("name").value = product.name;
  document.getElementById("description").value = product.description;
  document.getElementById("category").value = product.category;
  document.getElementById("price").value = product.price;
  document.getElementById("quantity").value = product.quantity;
  document.getElementById("weight").value = product.weight;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  if (productId) {
    await updateProduct(productId, formData);
  } else {
    await addProduct(formData);
  }

  window.location.href = 'mainPage.html';
});


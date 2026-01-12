import { addProduct, getProductById, updateProduct, getProducts } from "./api.js";

const form = document.querySelector('.add-product-form');
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

// If editing → prefill form
if (productId) {
  document.querySelector("h2").textContent = "Edit Product";

  const product = await getProductById(productId);

  document.getElementById("name").value = product.name;
  document.getElementById("description").value = product.description;
  document.getElementById("customCategory").value = product.category;
  document.getElementById("price").value = product.price;
  document.getElementById("quantity").value = product.quantity;
  document.getElementById("weight").value = product.weight;
}

async function populate(){
  const selectCategoryElement = document.querySelector('.existing-category')
  const products = await getProducts()
  const categories = [...new Set(products.map(p => p.category))]
  selectCategoryElement.innerHTML = ''
  categories.forEach((category) => {
    selectCategoryElement.innerHTML += `<option value="${category}">${category}</option>`
  })
}

populate()

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const custom = formData.get("customCategory");
  const existing = formData.get("existingCategory");

  // Decide which one to use
  const finalCategory = custom?.trim() ? custom : existing;

  formData.delete("customCategory");
  formData.delete("existingCategory");

  formData.append("category", finalCategory);

  await addProduct(formData);

  window.location.href = "mainPage.html";
});



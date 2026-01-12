export async function getProducts() {
  const rawProducts = await fetch('http://localhost:5000/products');
  const products = await rawProducts.json();
  return products;
}

export async function addProduct(formData) {
  const response = await fetch('http://localhost:5000/products/add', {
    method: 'POST',
    body: formData   // IMPORTANT: FormData, not JSON
  });

  return await response.json();
}

export async function deleteProduct(id) {
  await fetch(`http://localhost:5000/products/${id}`, {
    method: 'DELETE'
  });
}

export async function updateProduct(id, formData) {
  await fetch(`http://localhost:5000/products/${id}`, {
    method: 'PUT',
    body: formData
  });
}

export async function getProductById(id) {
  const res = await fetch(`http://localhost:5000/products/${id}`);
  return await res.json();
}
import { getProducts } from "./api.js";

const products = await getProducts();

// KPIs
document.getElementById("totalProducts").textContent = products.length;

const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
document.getElementById("totalStock").textContent = totalStock;

const lowStock = products.filter(p => p.quantity < 10).length;
document.getElementById("lowStock").textContent = lowStock;

const inventoryValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
document.getElementById("inventoryValue").textContent = "$" + inventoryValue.toFixed(2);

// CATEGORY CHART
const categoryMap = {};
products.forEach(p => {
  categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
});

new Chart(document.getElementById("categoryChart"), {
  type: "bar",
  data: {
    labels: Object.keys(categoryMap),
    datasets: [{
      label: "Products per Category",
      data: Object.values(categoryMap)
    }]
  }
});

// STOCK PIE CHART
new Chart(document.getElementById("stockChart"), {
  type: "pie",
  data: {
    labels: products.map(p => p.name),
    datasets: [{
      label: "Stock Distribution",
      data: products.map(p => p.quantity)
    }]
  }
});

// TOP 5 PRODUCTS
const topProducts = [...products]
  .sort((a, b) => b.quantity - a.quantity)
  .slice(0, 5);

new Chart(document.getElementById("topProductsChart"), {
  type: "bar",
  data: {
    labels: topProducts.map(p => p.name),
    datasets: [{
      label: "Top 5 Stocked Products",
      data: topProducts.map(p => p.quantity)
    }]
  }
});

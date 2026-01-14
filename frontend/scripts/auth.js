const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

// REGISTER
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role })
    });

    const data = await res.json();

    if (res.ok) { // res is a Response object returned by fetch() //// res.ok is a boolean property on that object. It is true if the HTTP status code is in the 200–299 range (successful response). It is false otherwise (e.g., 400, 404, 500).
      alert("Registered successfully!");
      window.location.href = "login.html";
    } else {
      alert(data.error || data.message);
    }
  });
}

// LOGIN
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      alert("Login successful!");

      if (data.role === "customer") {
        window.location.href = "customerProducts.html";
      } else {
        window.location.href = "mainPage.html";
      }
    }
    else {
      alert(data.message);
    }
  });
}

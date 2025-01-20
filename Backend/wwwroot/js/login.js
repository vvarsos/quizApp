document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");
  
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const username = document.getElementById("username").value.trim();
      const password = parseInt(document.getElementById("password").value.trim(), 10);
  
      try {
        // Send credentials to the server
        const response = await fetch("https://localhost:5001/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
  
        if (!response.ok) {
          // e.g., 400 or 401 from server
          const errorMessage = await response.text();
          loginMessage.textContent = errorMessage || "Login failed.";
          return;
        }
  
        // If login is successful
        const result = await response.json();
        if (result.success) {
          // Navigate to quiz page
          window.location.href = "quiz.html";
        } else {
          loginMessage.textContent = result.message;
        }
      } catch (error) {
        console.error("Error:", error);
        loginMessage.textContent = "Server error. Please try again later.";
      }
    });
  });
  
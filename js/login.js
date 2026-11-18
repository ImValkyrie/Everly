const loginForm = document.querySelector(".login-form");
const loginError = document.querySelector("#login-error");
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.hidden = true;
  loginError.textContent = "";
  try {
    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;
    const loginData = {
      email: email,
      password: password,
    };
    const loginUrl = "https://v2.api.noroff.dev/auth/login";
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });
    const result = await response.json();
    if (response.ok) {
      console.log("Login successful!");

      const accessToken = result.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      window.location.href = "../index.html";
    } else {
      loginError.textContent = "Incorrect email or password. Please try again.";
      loginError.hidden = false;
    }
  } catch (error) {
    loginError.textContent = "Something went wrong. Please try again later";
    loginError.hidden = false;
  }
});

const registerForm = document.querySelector("#register-form");
const registerError = document.querySelector("#register-error");
const registerSuccess = document.querySelector("#register-success");
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  registerError.hidden = true;
  registerError.textContent = "";

  registerSuccess.hidden = true;
  registerSuccess.textContent = "";
  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;
  const confirmPassword = document.querySelector("#confirm-password").value;
  if (password !== confirmPassword) {
    registerError.textContent = "Passwords do not match";
    registerError.hidden = false;
    return;
  }
  const registerUrl = "https://v2.api.noroff.dev/auth/register";
  const registerData = {
    name: name,
    email: email,
    password: password,
  };
  try {
    const response = await fetch(registerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerData),
    });
    const result = await response.json();
    if (response.ok) {
      registerSuccess.textContent =
        "Account created successfully! You can now log in.";
      registerSuccess.hidden = false;
    } else {
      registerError.textContent =
        result.errors?.[0]?.message || "Registration failed. Please try again.";
      registerError.hidden = false;
    }
  } catch (error) {
    registerError.textContent = "Something went wrong. Please try again later.";
    registerError.hidden = false;
  }
});

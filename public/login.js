const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const loginBtn = document.querySelector(".login-btn");
const registerBtn = document.querySelector(".register-btn");
const showPasswordBtn = document.querySelector(".show-password");
const connectBtn = document.querySelector(".connect-btn");
const createAccountBtn = document.querySelector(".create-account");

registerBtn.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
  registerForm.classList.add("inline-flex");
});

loginBtn.addEventListener("click", async () => {
  registerForm.classList.add("hidden");
  registerForm.classList.remove("inline-flex");
  loginForm.classList.remove("hidden");
});

showPasswordBtn.addEventListener("click", async () => {
  const passwordInput = document.getElementById("password");
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

async function Login(login, password) {
  try {
    const response = await fetch("http://localhost:3333/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Assurez-vous que cet en-tête est présent
      },
      body: JSON.stringify({ login: login, password }), // Corps de la requête
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          window.location.href = data.redirectTo; // Rediriger vers /posts.html
        } else {
          alert(data.message); // Afficher un message d'erreur
        }
      });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
  }
}

async function Register(login, password, email) {
  try {
    const response = await fetch("http://localhost:3333/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Assurez-vous que cet en-tête est présent
      },
      body: JSON.stringify({ login: login, password, email }), // Corps de la requête
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          window.location.href = data.redirectTo; // Rediriger vers /posts.html
        } else {
          alert(data.message); // Afficher un message d'erreur
        }
      });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
  }
}

connectBtn.addEventListener("click", async () => {
  const login = document.getElementById("login").value;
  const password = document.getElementById("password").value;
  Login(login, password);
});

createAccountBtn.addEventListener("click", async () => {
  const login = document.getElementById("register-login");
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById(
    "register-confirm-password"
  ).value;

  if (login.value.length < 6) {
    console.log("Mini 6 cara");
    login.classList.add = " text-red-500 ";
  }

  if (password.length < 6) {
    console.log("6 cara mini !");
  } else if (password !== confirmPassword) {
    console.log("Mot de passe différents !");
  }

  console.log("Connexion...");
});

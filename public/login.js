const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const loginBtn = document.querySelector(".login-btn");
const registerBtn = document.querySelector(".register-btn");
const showPasswordBtn = document.querySelector(".show-password");
const showRegisterPasswordBtn = document.querySelector(
  ".show-register-password"
);
const connectBtn = document.querySelector(".connect-btn");
const createAccountBtn = document.querySelector(".create-account");
const closeBtn = document.querySelector(".close-button");
const loginBtnContainer = document.querySelector(".login-button-container");

registerBtn.addEventListener("click", () => {
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
  registerForm.classList.add("inline-flex");
  closeBtn.classList.remove("hidden");
  loginBtnContainer.classList.add("hidden");
});

closeBtn.addEventListener("click", () => {
  registerForm.classList.add("hidden");
  registerForm.classList.remove("inline-flex");
  loginForm.classList.remove("hidden");
  closeBtn.classList.add("hidden");
  loginBtnContainer.classList.remove("hidden");
});

showPasswordBtn.addEventListener("click", async () => {
  const passwordInput = document.getElementById("password");
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

showRegisterPasswordBtn.addEventListener("click", async () => {
  const registerPasswordInput = document.getElementById("register-password");
  const registerPasswordConfirmInput = document.getElementById(
    "register-confirm-password"
  );
  registerPasswordInput.type =
    registerPasswordInput.type === "password" ? "text" : "password";
  registerPasswordConfirmInput.type =
    registerPasswordConfirmInput.type === "password" ? "text" : "password";
});

async function Login(login, password) {
  try {
    const response = await fetch("http://localhost:3333/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Assurez-vous que cet en-tête est présent
      },
      body: JSON.stringify({ login: login, password }), // Corps de la requête
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    if (data.success) {
      localStorage.setItem("authToken", data.token);
      window.location.replace(data.redirectTo);
    }
  } catch (error) {
    console.error("Erreur lors de l'authentification: ", error);
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
          window.location.href = data.redirectTo; // Rediriger vers /index.html
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

// Register
createAccountBtn.addEventListener("click", async () => {
  const loginValue = document.getElementById("register-login").value;
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById(
    "register-confirm-password"
  ).value;
  const email = document.getElementById("register-email").value;
  const confirmEmail = document.getElementById("register-confirm-email").value;

  // Vérification que tous les champs sont remplis
  if (!loginValue || !password || !confirmPassword || !email || !confirmEmail) {
    alert("Tous les champs doivent être remplis.");
    return;
  }

  if (loginValue.length < 6) {
    alert("Le login doit être composé de minimum 6 caractères.");
    return;
  }

  if (loginValue.length < 6) {
    alert("Le login doit être composé de minimum 6 caractères.");
    return;
  }

  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  if (!passwordPattern.test(password)) {
    alert(
      "Le mot de passe doit contenir une majuscule, un caractère spécial et un chiffre et faire minimum 8 caractères."
    );
    return;
  }
  // Vérification des mots de passe
  if (password !== confirmPassword) {
    alert("Les mots de passe ne correspondent pas.");
    return;
  }

  // Vérification de la validité du format de l'email avec un pattern simple
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Veuillez fournir une adresse email valide.");
    return;
  }

  // Vérification des emails
  if (email !== confirmEmail) {
    alert("Les adresses email ne correspondent pas.");
    return;
  }

  console.log("Tous les contrôles sont OK, inscription en cours...");
  Register(loginValue, password, email);
});

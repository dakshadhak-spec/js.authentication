// Get an element by its ID
const getElement = (id) => document.getElementById(id);
// Display a message
const showMessage = (element, message, success) => {
element.textContent = message;
element.style.color = success ? "green" : "red";
};
// Get the registered user from browser storage
const getUser = () => {
try {
return JSON.parse(localStorage.getItem("registeredUser")) || null;
} catch {
return null;
}
};
// Validate email format
const isValidEmail = (email) => {
return /^[^\s@]+@[^\s@]+.[^\s@]+$/.test(email);
};
// Check whether the user is logged in
const isLoggedIn = () => {
return sessionStorage.getItem("loggedIn") === "true";
};
// REGISTER FORM
const registerForm = getElement("registerForm");
if (registerForm) {
registerForm.addEventListener("submit", (event) => {
event.preventDefault();
    const name = getElement("name").value.trim();
    const email = getElement("registerEmail").value.trim().toLowerCase();
    const password = getElement("registerPassword").value;
    const confirmPassword = getElement("confirmPassword").value;
    const message = getElement("registerMessage");
    if (!name || !email || !password || !confirmPassword) {
        showMessage(message, "Please fill in all fields.", false);
        return;
    }
    if (!isValidEmail(email)) {
        showMessage(message, "Please enter a valid email.", false);
        return;
    }
    if (password.length < 8) {
        showMessage(message, "Password must be at least 8 characters.", false);
        return;
    }
    if (password !== confirmPassword) {
        showMessage(message, "Passwords do not match.", false);
        return;
    }
    if (getUser()?.email === email) {
        showMessage(message, "This email is already registered.", false);
        return;
    }
    // Demo only: storing a plaintext password is NOT secure.
    // Never use this password-storage approach in a real application.
    const user = {
        name: name,
        email: email,
        password: password
    };
    try {
        localStorage.setItem("registeredUser", JSON.stringify(user));
        showMessage(message, "Registration successful! Redirecting...", true);
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    } catch {
        showMessage(message, "Could not save account in this browser.", false);
    }
});
}
// LOGIN FORM
const loginForm = getElement("loginForm");
if (loginForm) {
loginForm.addEventListener("submit", (event) => {
event.preventDefault();
    const email = getElement("loginEmail").value.trim().toLowerCase();
    const password = getElement("loginPassword").value;
    const message = getElement("loginMessage");
    if (!email || !password) {
        showMessage(message, "Please enter your email and password.", false);
        return;
    }
    if (!isValidEmail(email)) {
        showMessage(message, "Please enter a valid email.", false);
        return;
    }
    const user = getUser();
    if (!user || user.email !== email || user.password !== password) {
        showMessage(message, "Invalid email or password.", false);
        return;
    }
    try {
        sessionStorage.setItem("loggedIn", "true");
        sessionStorage.setItem("loggedInEmail", user.email);
        showMessage(message, "Login successful! Redirecting...", true);
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 700);
    } catch {
        showMessage(message, "Unable to start your session.", false);
    }
});
}
// DASHBOARD PROTECTION
const welcomeMessage = getElement("welcomeMessage");
if (welcomeMessage) {
const user = getUser();
const sessionEmail = sessionStorage.getItem("loggedInEmail");
if (!isLoggedIn() || !user || user.email !== sessionEmail) {
    sessionStorage.removeItem("loggedIn");
    sessionStorage.removeItem("loggedInEmail");
    window.location.replace("index.html");
} else {
    welcomeMessage.textContent = `Welcome, ${user.name}!`;
}
}
// LOGOUT
const logoutButton = getElement("logoutButton");
if (logoutButton) {
logoutButton.addEventListener("click", () => {
sessionStorage.removeItem("loggedIn");
sessionStorage.removeItem("loggedInEmail");
window.location.href = "index.html";
});
}

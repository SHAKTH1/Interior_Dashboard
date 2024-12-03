document.addEventListener('DOMContentLoaded', () => {
const welcomeScreen = document.getElementById('welcome-screen');
const registerScreen = document.getElementById('register-screen');
const loginScreen = document.getElementById('login-screen');
const registerButton = document.getElementById('register-button');
const loginButton = document.getElementById('login-button');
const showLogin = document.getElementById('show-login');
const backToRegister = document.getElementById('back-to-register');

// Function to transition between screens
const showScreen = (screen) => {
    const screens = [welcomeScreen, registerScreen, loginScreen];
    screens.forEach((s) => {
        s.classList.remove('active');
    });
    screen.classList.add('active');
};

// Initial animation: Show Welcome Screen
setTimeout(() => {
    showScreen(welcomeScreen);
    setTimeout(() => {
        showScreen(registerScreen);
    }, 3000); // 3 seconds for welcome screen
}, 500); // Initial delay

// Switch to login screen
showLogin.addEventListener('click', () => {
    showScreen(loginScreen);
});

if (backToRegister) {
    backToRegister.addEventListener('click', () => {
        showScreen(registerScreen); // Go back to the register screen
    });
}

// Handle registration
// Handle registration
registerButton.addEventListener('click', async () => {
    const inputs = document.querySelectorAll('#register-screen .input');
    const [username, phone, email, password] = Array.from(inputs).map((input) => input.value); // Change "name" to "username"

    if (!username || !phone || !email || !password) {
        alert('All fields are required');
        return;
    }

    try {
        const response = await fetch('/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, phone, email, password }), // Ensure "username" is used here
        });

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error("Error during registration:", error);
    }
});

// Handle login
loginButton.addEventListener("click", async () => {
    const inputs = document.querySelectorAll("#login-screen .input");
    const [phone, password] = Array.from(inputs).map((input) => input.value);

    if (!phone || !password) {
        alert("All fields are required");
        return;
    }

    try {
        const response = await fetch("/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("token", data.token); // Store token
            alert("Login successful!");
            window.location.href = "/home.html"; // Redirect to dashboard
        } else {
            alert(data.message || "Login failed");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred during login. Please try again.");
    }
});
});

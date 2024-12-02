const banner = document.getElementById("banner");
const loginContainer = document.getElementById("login-container");
const signupContainer = document.getElementById("signup-container");
const loginToggle = document.getElementById("login-form-toggler");
const signupToggle = document.getElementById("signup-form-toggler");

// Toggle between login and signup
signupToggle.addEventListener('click', () => {
    banner.style.transform = "translateX(-100%)";
    loginContainer.style.transform = "scale(0)";
    signupContainer.style.transform = "scale(1)";
});

loginToggle.addEventListener('click', () => {
    banner.style.transform = "translateX(0%)";
    signupContainer.style.transform = "scale(0)";
    loginContainer.style.transform = "scale(1)";
});

// Handle Signup
document.querySelector('.signup-container button').addEventListener('click', async () => {
    const username = document.querySelector('.signup-container input[placeholder="Enter Your Username"]').value;
    const email = document.querySelector('.signup-container input[placeholder="Enter Your Email Address"]').value;
    const phone = document.querySelector('.signup-container input[placeholder="Enter Your Phone Number"]').value;
    const password = document.querySelector('.signup-container input[placeholder="Enter Your Password"]').value;

    const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, phone, password }),
    });

    const data = await response.json();
    alert(data.message);
});
document.querySelector('.login-container button').addEventListener('click', async () => {
    const username = document.querySelector('.login-container input[placeholder="Enter Your Username"]').value;
    const password = document.querySelector('.login-container input[placeholder="Enter Your Password"]').value;

    const response = await fetch('/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (response.status === 200) {
        alert(data.message);

        // Store the token in localStorage
        localStorage.setItem('token', data.token);

        // Redirect to the dashboard with the token as a query parameter
        window.location.href = `/dashboard?token=${data.token}`;
    } else {
        alert(data.message);
    }
});

// Add token to fetch requests
function fetchWithToken(url, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("No token found in localStorage");
        return Promise.reject("No token found");
    }

    const headers = options.headers || {};
    headers['Authorization'] = `Bearer ${token}`;

    return fetch(url, { ...options, headers });
}

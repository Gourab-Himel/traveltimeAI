/**
 * Auth Scripts
 * Handles Login, Register, and Session Management
 */

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();

    // LOGIN FORM
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const msg = document.getElementById('auth-msg');
            msg.innerHTML = '<span class="text-secondary">Logging in...</span>';

            try {
                const res = await fetch('/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await res.json();

                if (res.ok) {
                    msg.innerHTML = '<span class="text-success">Success! Redirecting...</span>';
                    // Save Session
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setTimeout(() => window.location.href = 'index.html', 1000);
                } else {
                    msg.innerHTML = `<span class="text-danger">${data.error}</span>`;
                }
            } catch (err) {
                console.error(err);
                msg.innerHTML = '<span class="text-danger">Connection Error</span>';
            }
        });
    }

    // REGISTER FORM
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;
            const msg = document.getElementById('auth-msg');
            msg.innerHTML = '<span class="text-secondary">Creating Account...</span>';

            try {
                const res = await fetch('/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName, username, email, password, role })
                });
                const data = await res.json();

                if (res.ok) {
                    msg.innerHTML = '<span class="text-success">Account Created! Logging you in...</span>';
                    // Auto Login (Simulated)
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setTimeout(() => window.location.href = 'index.html', 1500);
                } else {
                    msg.innerHTML = `<span class="text-danger">${data.error}</span>`;
                }
            } catch (err) {
                console.error(err);
                msg.innerHTML = '<span class="text-danger">Connection Error</span>';
            }
        });
    }
});

function updateNavbar() {
    const user = JSON.parse(localStorage.getItem('user'));
    const navMenu = document.querySelector('.site-menu');
    if (!navMenu) return;

    if (user) {
        // Remove Login and Register Links
        const loginLink = navMenu.querySelector('a[href="login.html"]');
        if (loginLink && loginLink.parentNode) loginLink.parentNode.remove();

        const registerLink = navMenu.querySelector('a[href="register.html"]');
        if (registerLink && registerLink.parentNode) registerLink.parentNode.remove();

        // Add "My Profile" and "Logout"
        // Add "Logout"
        const usernameDisplay = user.username;
        const isAdmin = user.role === 'admin';

        const profileHtml = `<li class="has-children">
            <a href="#">Hello, ${usernameDisplay}</a>
            <ul class="dropdown">
                ${isAdmin ? '<li><a href="admin.html">Admin Dashboard</a></li>' : ''}
                <li><a href="#" id="logout-btn">Logout</a></li>
            </ul>
        </li>`;

        navMenu.insertAdjacentHTML('beforeend', profileHtml);

        // Bind Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            });
        }
    }
}

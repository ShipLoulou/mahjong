export default class Auth {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');

        this.navList = document.querySelector('.navList');
        this.userConnected();

        this.login();
    }

    login() {
        if (this.loginForm) {
            this.loginForm.addEventListener("submit", event => {
                event.preventDefault();

                let username = document.getElementById('username');
                let password = document.getElementById('password');

                username = username.value;
                password = password.value;

                const error = document.querySelector('.error');
                error.innerHTML = '';

                if (!username || !password) {
                    error.innerHTML = '<p>Tous les champs sont obligatoire.</p>';
                    return;
                }

                // Headers
                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");

                // Body
                const body = JSON.stringify({ username: username, password: password });

                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: body,
                    redirect: "follow"
                };

                fetch("http://localhost:8080/api/user/login", requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        if (result.message) {
                            error.innerHTML = `<p>${result.message}</p>`;
                            return;
                        }

                        localStorage.setItem('userId', result.userId);
                        localStorage.setItem('username', result.username);
                        localStorage.setItem('token', result.token);

                        window.location.assign('/');
                    })
                    .catch((error) => console.error(error));

            });
        }
    }

    logout() {
        const logoutForm = document.getElementById('logoutForm');

        if (logoutForm) {
            logoutForm.addEventListener("submit", event => {
                event.preventDefault();

                let userId = document.getElementById('userId');
                let token = document.getElementById('token');

                userId = userId.value;
                token = token.value;

                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", `Bearer ${token}`);

                const raw = JSON.stringify({
                    "id": parseInt(userId)
                });

                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow"
                };

                fetch("http://localhost:8080/api/user/logout", requestOptions)
                    .then((response) => response.json())
                    .then(() => {
                        localStorage.removeItem('userId');
                        localStorage.removeItem('username');
                        localStorage.removeItem('token');

                        window.location.assign('/');
                    })
                    .catch((error) => console.error(error));
            })
        }
    }

    userConnected() {
        const username = localStorage.getItem('username');
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (username) {
            this.navList.innerHTML = `
            <li>
                <form method="post" id="logoutForm">
                    <input type="hidden" id="userId" name="userId" value="${userId}">
                    <input type="hidden" id="token" name="token" value="${token}">
                    <button type="submit">Déconnexion</button>
                </form>
            </li>
            <li>
                <strong>${username}</strong>
            </li>`;
        }
        this.logout();
    }
}
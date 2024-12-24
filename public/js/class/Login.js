export default class Login {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.name = document.getElementById('username');

        this.submitForm();
    }

    submitForm() {
        if (this.form !== null) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                localStorage.setItem('username', this.name.value);
                window.location.assign('/');
            })
        }
    }
}

new Login;
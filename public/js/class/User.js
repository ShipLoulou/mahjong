export default class User {
    constructor() {
        // Balise <ul> centenant l'ensemble des users.
        this.containerListUser = document.getElementById('containerListUser');

        // Nombre des utilisateur connecter.
        this.registerNumberUsers = 0;

        // Tableau des utilisateurs connecter.
        this.connectedUsers = [];

        this.searchPlayersConnect();
    }

    infoCurrentUser() {
        const username = localStorage.getItem('username');
        const currentUser = document.getElementById('currentUser');

        if (username) {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "username": username
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            fetch("http://localhost:8080/api/user/one", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                    currentUser.innerHTML = `
                        <div>
                            <p>${result.username}</p>
                            <p>${result.score}</p>
                        </div>
                    `;
                })
                .catch((error) => console.error(error));
        }
    }

    /**
     * Initialisation des paramètres de la méthode fetch.
     * Appelle de la fonction fetch.
     */
    searchPlayersConnect() {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        const url = "http://localhost:8080/api/user/"

        const method = "searchPlayersConnect";

        this.fetch(url, requestOptions, method);

        setInterval(() => {
            this.fetch(url, requestOptions, method);
        }, 2000);
    }

    /**
     * 
     * @param {string} url de pour l'appel fetch.
     * @param {object} requestOptions : option pour l'appel fetch.
     * @param {string} method : choisie vers quelle méthode revoyer le resultat.
     */
    fetch(url, requestOptions, method) {
        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                if (method === "searchPlayersConnect") {
                    this.displaysTheListOfConnectedUsers(result);
                }
            })
            .catch((error) => console.error(error));
    }

    displaysTheListOfConnectedUsers(result) {
        result.forEach(user => {
            this.connectedUsers.push(user);
        });
        let number = this.connectedUsers.length;
        const username = localStorage.getItem('username');

        if (this.registerNumberUsers !== number) {
            this.containerListUser.innerHTML = '<li id="currentUser"></li>';
            this.infoCurrentUser();
            this.connectedUsers.forEach(user => {
                const baliseItem = document.createElement('li');
                baliseItem.classList.add('itemUser');
                if (username !== user.username) {
                    baliseItem.innerHTML = `<div>
                                                    <p>${user.username}</p>
                                                    <p>${user.score}</p>
                                                </div>
                                                <form class="formInvitationBtn btn-${user.username}" method='post'>
                                                    <input type="hidden" id="username" name="username" value="${user.username}">
                                                    <input type="hidden" id="socket" name="socket" value="${user.socket}">
                                                    <button type='submit'>VS</button>
                                                </form>`;
                }
                this.containerListUser.append(baliseItem);
            });
            this.registerNumberUsers = number;
            // this.createInvitation();
        }
        this.connectedUsers = [];
    }
}
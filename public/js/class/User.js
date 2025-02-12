export default class User {
    constructor(socket, player) {
        // Balise <ul> centenant l'ensemble des users.
        this.containerListUser = document.getElementById('containerListUser');

        // Nombre des utilisateur connecter.
        this.registerNumberUsers = 0;

        // Tableau des utilisateurs connecter.
        this.connectedUsers = [];

        this.searchPlayersConnect();

        this.socket(socket);

        this.receiveAnInvitation();

        // Balise <div> centenant l'ensemble des invitations.
        this.invitationContainer = document.querySelector('.invitationContainer-js');

        // Nombre d'invitation reçu.
        this.registerNumberInvitation = 0;

        // Tableau des invitations reçu.
        this.invitationReceived = [];
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
            this.createInvitation();
        }
        this.connectedUsers = [];
    }

    // new

    socket(socket) {
        const token = localStorage.getItem('token');
        const currentSocket = localStorage.getItem('socket');
        const userId = localStorage.getItem('userId');


        window.addEventListener("load", (event) => {
            socket.on('connect', () => {

                const newSocket = socket.id;
                if (token && userId) {
                    if (!currentSocket || currentSocket !== newSocket) {
                        const myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");
                        myHeaders.append("Authorization", `Bearer ${token}`);

                        const raw = JSON.stringify({
                            "socket": newSocket,
                            "id": userId
                        });

                        const requestOptions = {
                            method: "PUT",
                            headers: myHeaders,
                            body: raw,
                            redirect: "follow"
                        };

                        fetch("http://localhost:8080/api/user/", requestOptions)
                            .then((response) => response.json())
                            .then((result) => {
                                localStorage.removeItem('socket');
                                localStorage.setItem('socket', newSocket);
                                this.socket(socket);
                            })
                            .catch((error) => console.error(error));
                    }
                }
            });
        })
    }

    /**
     * Création d'une invitation entre deux joueurs.
     */
    createInvitation() {
        const allBtn = document.querySelectorAll('.formInvitationBtn');
        let arrayBtn = [];

        allBtn.forEach(btn => {
            arrayBtn.push(btn.classList[1]);
        });

        allBtn.forEach(item => {
            item.addEventListener("submit", e => {
                e.preventDefault();
                let usernameEnnemy = document.querySelector(`.${item.classList[1]} #username`)
                let socketEnnemy = document.querySelector(`.${item.classList[1]} #socket`)

                usernameEnnemy = usernameEnnemy.value;
                socketEnnemy = socketEnnemy.value;

                const usernameHost = localStorage.getItem('username');
                const socketHost = localStorage.getItem('socket');

                const invitation = {
                    roomId: this.roomId(),
                    usernameHost: usernameHost,
                    socketHost: socketHost,
                    usernameEnnemy: usernameEnnemy,
                    socketEnnemy: socketEnnemy,
                    accept: null
                }

                const token = localStorage.getItem('token');

                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", `Bearer ${token}`);

                const raw = JSON.stringify(invitation);

                const requestOptions = {
                    method: "POST",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow"
                };

                fetch("http://localhost:8080/api/invitation/create", requestOptions)
                    .then((response) => response.json())
                    .then((result) => { })
                    .catch((error) => console.error(error));

            })

        });

        arrayBtn = [];
    }

    /**
     * Génère un id aléatoire
     * @returns id de la room
     */
    roomId() {
        const min = 100000000;
        const max = 999999999;
        return Math.floor(Math.random() * (max - min)) + min;
    }

    receiveAnInvitation() {
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
            "username": username
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        if (token && username) {
            setInterval(() => {
                fetch("http://localhost:8080/api/invitation/", requestOptions)
                    .then((response) => response.json())
                    .then((result) => {

                        this.displaysTheListOfReceiveInvitation(result);
                    })
                    .catch((error) => console.error(error));
            }, 2000);
        }
    }

    displaysTheListOfReceiveInvitation(result) {
        result.forEach(invitation => {
            this.invitationReceived.push(invitation);
        });

        let number = this.invitationReceived.length;

        if (this.registerNumberInvitation !== number) {
            this.invitationContainer.innerHTML = '';
            this.invitationReceived.forEach(invitation => {
                this.invitationContainer.classList.add('invitationContainer');
                const baliseItem = document.createElement('div');
                baliseItem.classList.add('itemInvitation');
                baliseItem.innerHTML = `<h3>Invitation de ${invitation.usernameHost}</h3>
                                                <div>
                                                    <form id="formInvitationSucess" method="post">
                                                        <input type="hidden" value="${invitation.roomId}" name="roomId">
                                                        <button type="submit">Accepter</button>
                                                    </form>
                                                    <form id="formInvitationDefeat" method="post">
                                                        <input type="hidden" value="${invitation.roomId}" name="roomId">
                                                        <button type="submit">Refuser</button>
                                                    </form>
                                                </div>`;
                this.invitationContainer.append(baliseItem);
            });
            this.lastInvitation = number;
            this.responseInvitation(result);
        }

        if (number === 0) {
            this.invitationContainer.classList.remove('invitationContainer');
            this.invitationContainer.innerHTML = '';
        }

        this.invitationReceived = [];

    }

    responseInvitation(result) {
        const formInvitationSucess = document.getElementById('formInvitationSucess');
        const formInvitationDefeat = document.getElementById('formInvitationDefeat');

        if (formInvitationDefeat) {
            formInvitationDefeat.addEventListener("click", (e) => {
                e.preventDefault();
                const roomId = document.querySelector('#formInvitationDefeat input');
                const token = localStorage.getItem('token');

                const myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                myHeaders.append("Authorization", `Bearer ${token}`);

                const raw = JSON.stringify({
                    "roomId": parseInt(roomId.value)
                });

                const requestOptions = {
                    method: "DELETE",
                    headers: myHeaders,
                    body: raw,
                    redirect: "follow"
                };

                fetch("http://localhost:8080/api/invitation/delete", requestOptions)
                    .then((response) => response.text())
                    .then((result) => console.log(result))
                    .catch((error) => console.error(error));
            })
        }

        if (formInvitationSucess) {
            formInvitationSucess.addEventListener("submit", e => {
                e.preventDefault();
                let roomId = document.querySelector('#formInvitationSucess input');
                roomId = roomId.value;

                console.log(roomId);

                // récupérer les informations de la room concerné
            });
        }
    }
}
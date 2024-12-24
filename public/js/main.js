import Initialization from "./class/Initialization.js";
import { dataPiece, dataFigure } from "./data/data.js";
import Adapter from "./class/adapter.js";
import VerificationTouch from "./class/VerificationTouch.js";

// Création de l'entité player
const player = {
    host: false,
    roomId: null,
    username: "",
    socketId: "",
    win: false
};

// Initialisation du socket
const socket = io();

// Gestion temporaire de la fonction login

// Récupère le username
const username = localStorage.getItem('username');

// Différente pages
const homePage = document.getElementById('homePage');
const waitPage = document.getElementById('waitPage');
const gamesPage = document.getElementById('gamesPage');

// Bouton pour rejoindre et créer des salons
const formBtn = document.getElementById('formBtn');
const list = document.getElementById('list');

const finishContainer = document.querySelector('.finish');

const finishMsg = document.getElementById('text-finish');

let test = setInterval(() => {
    location.reload();
}, 1000);

// username de l'adversaire
let ennemyUsername = "";

socket.emit('get rooms');
socket.on('list rooms', (rooms) => {
    let html = "";

    if (rooms.length > 0) {
        rooms.forEach(room => {
            if (room.players.length !== 2) {
                html += `<button style="cursor: pointer;" class="playBtn join-room" data-room="${room.id}">JOUER <br> <span>en multijoueur</span></button>
                        <p>1 joueur en attente</p>`;
            }
        });
        if (html !== "") {
            formBtn.classList.add('d-none');
            list.innerHTML = html;

            for (const element of document.getElementsByClassName('join-room')) {
                element.addEventListener('click', joinRoom, false)
            }
        }
    }
});

$('#formBtn').on('submit', function (e) {
    e.preventDefault();

    if (username === null) {
        window.location.assign('/login');
        return;
    }

    clearInterval(test);

    player.username = username;
    player.host = true;
    player.socketId = socket.id;

    homePage.classList.add('d-none');
    waitPage.classList.remove('d-none');

    socket.emit('playerData', player);
});

socket.on('start game', (players) => {
    console.log(players)
    startGame(players);
    new Initialization(dataPiece, dataFigure);
    new VerificationTouch(socket, players, ennemyUsername);
    new Adapter;
});

socket.on('play', (ennemyPlayer) => {
    console.log('fonction play');

    if (ennemyPlayer.socketId !== player.socketId) {
        if (ennemyPlayer.win) {
            console.log('C\'est perdu !');

            setTurnMessage(`C'est perdu ! <b>${ennemyPlayer.username}</b> a gagné !`)
        }
    } else {
        console.log('C\'est gagné !');
        setTurnMessage(`Félicitations, tu as gagné la partie !`)
    }

});

function startGame(players) {
    waitPage.classList.add('d-none');
    gamesPage.classList.remove('d-none');

    const ennemyPlayer = players.find(p => p.socketId != player.socketId);
    ennemyUsername = ennemyPlayer.username;
}

const joinRoom = function () {
    if (username === null) {
        window.location.assign('/login');
        return;
    }

    clearInterval(test);

    if (username !== "") {
        player.username = username;
        player.socketId = socket.id;
        player.roomId = this.dataset.room;

        socket.emit('playerData', player);

        homePage.classList.add('d-none');
        waitPage.classList.remove('d-none');
    }
}


function setTurnMessage(html) {
    finishContainer.classList.add('d-flex');
    finishMsg.innerHTML = html;
}
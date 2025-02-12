import Auth from "./class/auth.js";
import User from "./class/User.js";

const player = {
    host: false,
    roomId: null,
    username: "",
    socketId: "",
    win: false
};

// Initialisation du socket
const socket = io();

new Auth;
new User(socket, player);
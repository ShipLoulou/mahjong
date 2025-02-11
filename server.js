const { Socket } = require('socket.io');
const http = require('http')
const path = require('path');

const express = require('express');
const sequelize = require('./utils/db');

const userRoutes = require('./src/routes/user.routes');
const invitationRoutes = require('./src/routes/invitation.routes');

sequelize.sync({ alter: true });

const app = express();

http
    .createServer(app)
    .listen(8080, () => {
        console.log(`Listening on http://localhost:8080/`);
    });

app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use(express.static('public'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/user', userRoutes);
app.use('/api/invitation', invitationRoutes);

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'templates/games/mahjong.html'));
})

app.get('/connexion', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'templates/auth/login.html'));
})

app.get('/inscription', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'templates/auth/registration.html'));
})


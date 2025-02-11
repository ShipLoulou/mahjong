/**
 * Connexion à la base de données.
 */

const Sequelize = require('sequelize');

const sequelize = new Sequelize("loulouGames", "root", "admin", {
    dialect: "mysql",
    host: "localhost"
});

try {
    sequelize.authenticate();
    console.log('[ SUCCESS ] Connecté à la base de données MySQL!');
} catch (error) {
    console.error('[ ERROR ] Impossible de se connecter, erreur suivante :', error);
}

module.exports = sequelize;
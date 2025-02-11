const { DataTypes } = require("sequelize");

const sequelize = require('../../utils/db');

const Invitation = sequelize.define("invitation", {
    roomId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    usernameHost: {
        type: DataTypes.STRING,
        allowNull: false
    },
    socketHost: {
        type: DataTypes.STRING,
        allowNull: false
    },
    usernameEnnemy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    socketEnnemy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accept: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
});

sequelize.sync().then(() => {
    console.log('[ SUCCESS ] La table Invitation à été créé avec succès.');
}).catch((error) => {
    console.error('[ ERROR ] Impossible de créer la table : ', error);
});

module.exports = Invitation;
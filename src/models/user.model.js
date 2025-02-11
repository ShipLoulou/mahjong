const { DataTypes } = require("sequelize");

const sequelize = require('../../utils/db');

const User = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    socket: {
        type: DataTypes.STRING,
        allowNull: true
    },
    connected: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
});

sequelize.sync().then(() => {
    console.log('[ SUCCESS ] La table User à été créé avec succès.');
}).catch((error) => {
    console.error('[ ERROR ] Impossible de créer la table ', error);
});

module.exports = User;
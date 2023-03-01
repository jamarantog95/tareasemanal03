const { DataTypes } = require("sequelize");
const { db } = require("../database/db");

const Repair = db.define('repairs', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    motorsNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }

});

module.exports = Repair;
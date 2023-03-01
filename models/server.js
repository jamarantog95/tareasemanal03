const express = require('express');
// Importamos cors
var cors = require('cors')
const { userRouter } = require('../routes/user.routes');

const { db } = require('../database/db');
const { repairRouter } = require('../routes/repair.routes');


const morgan = require('morgan');
const globalErrorHandler = require('../controllers/error.controller');
const AppError = require('../utils/appError');
const initModel = require('./init.model');



//1. Creamos la clase
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 4000;


        this.paths = {
            users: '/api/v1/user',
            repairs: '/api/v1/repairs'
        }

        // INVOCAR AL METODO DE CONEXION DE BASE DE DATOS
        this.database();

        // INVOCAMOS AL METODO MIDDLEWARES
        this.middlewares();

        // INVOCAMOS AL METODO DE ROUTES
        this.routes();
    }


    middlewares() {
        if (process.env.NODE_ENV === 'development') {
            console.log('HOLA ESTOY EN DESARROLLO');
            // Se usa para el MODO DESARROLLO
            this.app.use(morgan('dev'));
        }

        // if (process.env.NODE_ENV === 'production') {
        //     console.log('HOLA ESTOY EN PRODUCCIÓN');
        // }


        // Utilizamos las CORS para permitir acceso a la API
        this.app.use(cors());
        // Utilizamos EXPRESS.JSON para parsear el BODY de la REQUEST
        this.app.use(express.json());
    }


    // RUTAS : puntos de entrada de la aplicacion
    routes() {
        // Utilizar las rutas de usuarios
        this.app.use(this.paths.users, userRouter);
        // Utilizar las rutas de reparaciones
        this.app.use(this.paths.repairs, repairRouter);


        this.app.all('*', (req, res, next) => {
            return next(
                new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
            );
        });


        this.app.use(globalErrorHandler);

    }


    database() {
        db.authenticate()
            .then(() => console.log('Database authenticaded'))
            .catch(error => console.error());

        // relations
        initModel();

        db.sync()
            .then(() => console.log('Database synced'))
            .catch(error => console.error());
    }

    // METODO LISTEN: esta esuchando solicitudes del puerto 3000
    listen() {
        this.app.listen(this.port, () => {
            console.log("Server is running on port", this.port)
        })

    }
}

// Exportamos el Servidor
module.exports = Server;
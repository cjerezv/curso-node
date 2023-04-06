const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuarioPath = '/api/usuarios';
        this.authPath = '/api/auth';

        // Conectar a base de datos
        this.conectarDB();

        //Middlewares
        this.middelwares();

        //Rutas de la applicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }


    middelwares() {

        // Cors
        this.app.use( cors())

        //Lectura y parseo
        this.app.use( express.json() );

        // Directorio público
        this.app.use(express.static('public'))
    }

    routes() {
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuarioPath, require('../routes/user'));
    }

    listen() {
        this.app.listen(this.port, ()=>{
            console.log('Servidor corriendo en puerto ', this.port);
        });
    }
}

module.exports = Server;
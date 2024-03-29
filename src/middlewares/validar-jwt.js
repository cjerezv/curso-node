const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            msg: 'No hay token en la peticion'
        })
    }

    console.log(token);

    try {

        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        req.uid = uid;
        

        const usuario =  await Usuario.findById(uid)
        //const usuario =  await Usuario.findOne({_id: uid})

        if(!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en db'
            });
        }

        //Verificar si el uid(id del usuario del token recibido) tiene estado true
        if(!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado false'
            });
        } 

        req.usuario = usuario;

        next();

    } catch(error) {
        console.log(error)
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }

    
}


module.exports = {
    validarJWT
}
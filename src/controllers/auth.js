const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../../helpers/generar-jwt');
const { googleVerify } = require('../../helpers/google-verify');

const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {

        //verificar si email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - correo'
            })
        }


        //si usuario está activo en bbdd
        if(!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - estado: false'
            })
        }


        // verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - password'
            })
        }

        // generar JWT
        const token = await generarJWT(usuario.id);


        res.json({
            msg: 'Login OK',
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: 'Hable con el administrador'
        });

    }


}


const googleSignIn = async(req, res = response) => {

    const {id_token} = req.body;


    try {

        //const googleUser = await googleVerify(id_token);
        // console.log(googleUser);
        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if(!usuario) {
            //se debe crear
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // si el usuario en DB 

        if(!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        // generar JWT
        const token = await generarJWT(usuario.id);


        res.json({
            msg: 'Todo bien! google signin',
            id_token,
            usuario,
            token
        });

    } catch(error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        });

    }

    

}


module.exports = {
    login,
    googleSignIn
}
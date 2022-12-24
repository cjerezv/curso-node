const {response} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async(req, res) => {
    const { limite=5, desde=0 } = req.query;
    const query = {estado: true};

    // const usuarios = await Usuario.find( {estado: true} )
    //                                 .skip(desde)
    //                                 .limit(Number(limite));

    // const total = await Usuario.countDocuments( {estado: true} );
    
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments( query ),
        Usuario.find( query )
            .skip(desde)
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //Verificar si correo existe
    // const existeEmail = await Usuario.findOne({ correo });
    // if (existeEmail) {
    //     return res.status(400).json({
    //         msg: 'Ese correo ya está registrado'
    //     });
    // }

    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Guardar en BD
    await usuario.save();

    res.status(201).json({
        //msg: 'post API response',
        usuario
    });
}

const usuariosPut = async (req, res) => {
    //const id = req.params.id;
    const {id} = req.params;
    const {_id, password, google, correo, ...resto } = req.body;

    if(password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt); 
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto, {new: true});

    res.json({
        msg: 'put API response',
        usuario
    });
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch API response'
    });
}

const usuariosDelete = async(req, res) => {

    const { id } = req.params;

    //Borrar fisicamente
    //const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        msg: 'delete API response',
        usuario
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}
const {response} = require('express');


const usuariosGet = (req, res) => {
    const {q, nombre='No Name', apiKey} = req.query;
    res.json({
        msg: 'get API - controller',
        q, nombre, apiKey
    });
}

const usuariosPost = (req, res) => {
    const {nombre, edad} = req.body;
    res.status(201).json({
        msg: 'post API response',
        nombre,
        edad
    });
}

const usuariosPut = (req, res) => {
    //const id = req.params.id;
    const {id} = req.params;
    res.json({
        msg: 'put API response',
        id
    });
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'patch API response'
    });
}

const usuariosDelete = (req, res) => {
    res.json({
        msg: 'delete API response'
    });
}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}
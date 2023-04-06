const { response } = require("express")

const esAdminRole = (req, res = response,  next) => {

    if(!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        });
    }

    const {role, nombre} = req.usuario;
    if(role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es administrador`
        });
    }

    next();
}

const tieneRole = ( ...roles ) => {
    return (req, res = response,  next) => {

        if(!req.usuario) {
            return res.status(500).json({
                msg: 'Error en validación de token'
            });
        }

        if(!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            });
        }

        next();

    }
}

module.exports = {
    esAdminRole,
    tieneRole
}
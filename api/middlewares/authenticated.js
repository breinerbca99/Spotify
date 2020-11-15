'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_secreta_curso';

exports.ensureAuth = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La peticion no tiene la cabecera de authenticacion' });
    }

    var token = req.headers.authorization.replace(/['"]+/g, ''); //Aca va llegar el token cuando nos logueemos,vamos a eliminar comillas con replace

    try {
        var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) { //si la fecha de expiracion es menor a la fecha actual
            return res.status(401).send({ message: 'El token ha expirado' });
        }
    } catch (ex) {
        console.log(ex);
        return res.status(404).send({ message: 'Token no valido' });
    }

    req.user = payload;
    next(); //se utiliza para salir del middleware
};
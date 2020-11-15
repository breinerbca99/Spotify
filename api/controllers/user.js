"use strict";
//Para trabajar con los ficheros
var fs = require("fs");
var path = require("path");

var bcrypt = require("bcrypt-nodejs");
var User = require("../models/user");
var jwt = require("../services/jwt");

function pruebas(req, res) {
    res.status(200).send({
        message: "Probando una accion del controlador de usuarios del api rest con Node y Mongo ",
    });
}

function saveUser(req, res) {
    var user = new User();
    var params = req.body;
    console.log(params);
    console.log(params.name);
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = "ROLE_USER";
    user.image = "null";

    if (params.password) {
        //Encriptar contraseña y guardar datos
        bcrypt.hash(params.password, null, null, function(err, hash) {
            //si no devuelve ningun error habra has-ado correctamente la contraseña
            user.password = hash;
            console.log(user.password);
            console.log(user.name);
            console.log(user.surname);
            console.log(user.email);
            if (user.name != null && user.surname != null && user.email != null) {
                //Guardar el usuario
                user.save((err, userStored) => {
                    //devuelve un error ,y el objeto guardado
                    if (err) {
                        res.status(500).send({ message: "Error al guardar el usuario" });
                    } else {
                        if (!userStored) {
                            res
                                .status(404)
                                .send({ message: " No se a registrado el usuario" });
                        } else {
                            res.status(200).send({ user: userStored }); //Si se guardo en la base de datos
                        }
                    }
                });
            } else {
                res.status(200).send({
                    message: "Rellena todos los campos",
                });
            }
        });
    } else {
        res.status(200).send({
            message: "Introduce la contraseña",
        });
    }
}

function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        //(err:de la base de datos,user:usuario buscado en la base de datos)
        if (err) {
            res.status(500).send({ message: "Error en la peticion" });
        } else {
            if (!user) {
                res.status(404).send({ message: "El usuario no existe" });
            } else {
                //comprabar la contraseña
                bcrypt.compare(password, user.password, function(err, check) {
                    if (check) {
                        //Si existe esa contraseña
                        //devolver los datos del usuario logueado
                        if (params.gethash) {
                            //devolver un token de jwt
                            res.status(200).send({
                                token: jwt.createToken(user),
                            });
                        } else {
                            res.status(200).send({ user });
                        }
                    } else {
                        res
                            .status(404)
                            .send({ message: "El usuario no ha podido loquearse" });
                    }
                });
            }
        }
    });
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    if (userId != req.user.sub) {
        return res.status(500).send({
            message: 'No tienes permiso para actualizar este usuario'
        });
    }

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: "Error al actualizar el usuario" });
        } else {
            if (!userUpdated) {
                res
                    .status(404)
                    .send({ message: "No se ha podido actualizar el usuario" });
            } else {
                res.status(200).send({ user: userUpdated });
            }
        }
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = "No subido..";

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split("\\");
        var file_name = file_split[2]; //Divide la ruta

        var ext_split = file_name.split(".");
        var file_ext = ext_split[1]; //Divide la extension

        if (file_ext == "png" || file_ext == "jpg" || file_ext == "gif") {
            User.findByIdAndUpdate(
                userId, { image: file_name },
                (err, userUpdated) => {
                    if (!userUpdated) {
                        res
                            .status(404)
                            .send({ message: "No se ha podido actualizar el usuario" });
                    } else {
                        res.status(200).send({ image: file_name, user: userUpdated });
                    }
                }
            );
        } else {
            res.status(200).send({ message: "Extension del archivo no valida" });
        }
        console.log(file_split);
    } else {
        res.status(200).send({ message: "No has subido ninguna imagen.." });
    }
}

//Metodo para sacar un fichero del servidor
function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = "./uploads/user/" + imageFile; //ruta donde se guardan mis images
    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: "No existe la imagen..." });
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile,
};
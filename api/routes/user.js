'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var md_auth = require('../middlewares/authenticated'); //Este middleware lo utilizamos como ruta como segundo parametro

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/user' }); //aca se va subir todas las imagens

var api = express.Router();
api.get('/probando-controlador', md_auth.ensureAuth, UserController.pruebas); //Cuando pongamos esta ruta va tener que cargar este metodo del controller
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);
module.exports = api;
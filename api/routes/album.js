'use strict'

var express = require('express');
var AlbumController = require('../controllers/album');
var api = express.Router(); //Nos permite hacer todo las funciones get,pot,put
var md_auth = require('../middlewares/authenticated'); //authenticacion necesita un token

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/albums' }); //aca se va subir todas las imagens

api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.get('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);
api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);

module.exports = api;
'use strict'

var express = require('express');
var SongController = require('../controllers/song');
var api = express.Router(); //Nos permite hacer todo las funciones get,pot,put
var md_auth = require('../middlewares/authenticated'); //authenticacion necesita un token

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/songs' }); //aca se va subir todas las imagens

api.get('/song/:id', md_auth.ensureAuth, SongController.getSong);
api.post('/song', md_auth.ensureAuth, SongController.saveAlbum);
api.get('/songs/:album?', md_auth.ensureAuth, SongController.getSongs);
api.put('/song/:id', md_auth.ensureAuth, SongController.updateSong);
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong);
api.post('/upload-file-song/:id', [md_auth.ensureAuth, md_upload], SongController.uploadFile);
api.get('/get-song-file/:songFile', SongController.getSongFile);
module.exports = api;
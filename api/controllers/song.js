'use strict'

var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res) {
    var songId = req.params.id;
    Song.findById(songId).populate({ path: 'album' }).exec((err, song) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!song) {
                res.status(404).send({ message: 'La cancion no existe', cancion: song });
            } else {
                res.status(202).send({ song: song });
            }
        }
    });
}

function saveAlbum(req, res) {
    var song = new Song();
    var params = req.body;

    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album; //aca tenemos que pasar el id que pertenece el album

    song.save((err, songStored) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor' });
        } else {
            if (!songStored) { //es decir si no nos llega un objeto album 
                res.status(404).send({ message: 'No se ha guardado la cancion' });
            } else {
                res.status(202).send({ song: songStored });
            }
        }
    });
}


function getSongs(req, res) {
    var albumId = req.params.artist;
    if (!albumId) {
        //Sacar todos los albums de la base de datos
        var find = Song.find({}).sort('number');
    } else {
        //Sacar los albums de un artista concreto de la bbdd
        var find = Song.find({ artist: albumId }).sort('number');
    }

    //Fin es un objeto con sus propiedades y con el metodo populate 
    //a la propiedad artista lo va transformar en el schema artist

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec((err, songs) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!songs) {
                res.status(404).send({ message: 'No hay canciones' });
            } else {
                res.status(202).send({ songs });
            }
        }
    });
}


function updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor' });
        } else {
            if (!songUpdated) {
                res.status(404).send({ message: 'No se ha actualizado el album' });
            } else {
                res.status(202).send({ album: songUpdated });
            }
        }
    });
}

function deleteSong(req, res) {
    var songId = req.params.id;
    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor' });
        } else {
            if (!songRemoved) {
                res.status(404).send({ message: 'No se ha borrado la cancion' });
            } else {
                res.status(202).send({ album: songRemoved });
            }
        }
    });
}

function uploadFile(req, res) {
    var songId = req.params.id;
    var file_name = 'No subido...';

    console.log('breiner');
    if (req.files) {
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2]; //Divide la ruta

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1]; //Divide la extension

        console.log('roiser');
        console.log(file_name + 'breiner' + file_ext);
        if (file_ext == 'mp3' || file_ext == 'ogg') {
            console.log('chupapinga')
            Song.findByIdAndUpdate(songId, { file: file_name }, (err, songUpdated) => {


                if (!songUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar la cancion' });
                } else {
                    res.status(200).send({ song: songUpdated });
                }
            });
        } else {
            res.status(200).send({ message: 'Extension del archivo no valida' });

        }
        console.log(file_split);
    } else {
        res.status(200).send({ message: 'No has subido ningun fichero de audio..' });
    }

}


//Metodo para sacar un fichero del servidor
function getSongFile(req, res) {
    var imageFile = req.params.songFile;
    console.log('gaaaaaaaaaaaaa');
    var path_file = './uploads/songs/' + imageFile; //ruta donde se guardan mis images
    fs.exists(path_file, function(exists) {
        if (exists) {
            console.log(path_file);
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe el fichero de audio...' });
        }
    });
}


module.exports = {
    getSong,
    saveAlbum,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}
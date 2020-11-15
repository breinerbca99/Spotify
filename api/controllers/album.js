'use strict'

var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res) {
    var albumId = req.params.id;
    Album.findById(albumId).populate({ path: 'artist' }).exec((err, album) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!album) {
                res.status(400).send({ message: 'El album no existe' });
            } else {
                res.status(202).send({ album });
            }
        }
    });
}



function saveAlbum(req, res) {
    var album = new Album();
    var params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist; //aca tenemos que pasar el id que pertenece el album

    album.save((err, albumStored) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor' });
        } else {
            if (!albumStored) { //es decir si no nos llega un objeto album 
                res.status(404).send({ message: 'No se ha guardado el album' });
            } else {
                res.status(200).send({ album: albumStored });
            }
        }
    });
}

function getAlbums(req, res) {
    var artistId = req.params.artist;
    if (!artistId) {
        //Sacar todos los albums de la base de datos
        var find = Album.find({}).sort('title');
    } else {
        //Sacar los albums de un artista concreto de la bbdd
        var find = Album.find({ artist: artistId }).sort('year');
    }

    //Fin es un objeto con sus propiedades y con el metodo populate 
    //a la propiedad artista lo va transformar en el schema artist

    find.populate({ path: 'artist' }).exec((err, albums) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!albums) {
                res.status(404).send({ message: 'No hay albums' });
            } else {
                res.status(202).send({ albums });
            }
        }
    });
}

function updateAlbum(req, res) {
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en el servidor' });
        } else {
            if (!albumUpdated) {
                res.status(404).send({ message: 'No se ha actualizado el album' });
            } else {
                res.status(202).send({ album: albumUpdated });
            }
        }
    });
}

function deleteAlbum(req, res) {
    var albumId = req.params.id; //Este va ser el album que vamos a eliminar
    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error al eliminar el album' });
        } else {
            if (!albumRemoved) {
                res.status(404).send({ message: 'El album no ha sido eliminado' });
            } else {
                Song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al eliminar la cancion' });
                    } else {
                        if (!songRemoved) {
                            res.status(404).send({ message: 'La cancion no ha sido eliminada' });
                        } else {
                            res.status(200).send({ album: albumRemoved });
                        }
                    }
                });
            }
        }
    });
}


function uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2]; //Divide la ruta

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1]; //Divide la extension

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Album.findByIdAndUpdate(albumId, { image: file_name }, (err, albumUpdated) => {
                if (!albumUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar el artista' });
                } else {
                    res.status(200).send({ artist: albumUpdated });
                }
            });
        } else {
            res.status(200).send({ message: 'Extension del archivo no valida' });

        }
        console.log(file_split);
    } else {
        res.status(200).send({ message: 'No has subido ninguna imagen..' });
    }

}


//Metodo para sacar un fichero del servidor
function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/albums/' + imageFile; //ruta donde se guardan mis images
    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen...' });
        }
    });
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}
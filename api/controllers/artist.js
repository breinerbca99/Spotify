'use strict'

var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res) {
    var artistId = req.params.id;
    Artist.findById(artistId, (err, artist) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!artist) {
                res.status(404).send({ message: 'El artista no existe' });
            } else {
                res.status(200).send({ artist });
            }
        }
    });
}

function saveArtist(req, res) {
    var artist = new Artist(); //Creamos un nuevo artista
    var params = req.body;

    console.log(params);
    console.log(artist);
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';
    //puede guardar ya que es un schema de mongo db



    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({ message: 'error al guardar el artista' });
        } else {
            if (!artistStored) {
                res.status(404).send({ message: 'El artista no ha sido guardado' });
            } else {
                res.status(200).send({ artist: artistStored });

            }
        }
    });
}

function getArtists(req, res) {
    if (req.params.page) {
        var page = req.params.page;
    } else {
        var page = 1;
    }

    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, (err, artist, total) => {
        if (err) {
            res.status(500).send({ message: 'error en la peticion' });
        } else {
            if (!artist) {
                res.status(404).send({ message: 'No hay artista' });
            } else {
                return res.status(200).send({
                    total_items: total,
                    artist: artist
                });
            }
        }
    });
}

function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body; //Esto vamos a actualizar

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if (err) {
            res.status(500).send({ message: 'error en la peticion' });
        } else {
            if (!artistUpdated) {
                res.status(404).send({ message: 'El artista no ha sido actualizado' });
            } else {
                res.status(200).send({ artist: artistUpdated });
            }
        }
    });

}

function deleteArtist(req, res) {
    var artistId = req.params.id;
    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error al eliminar el artista' });
        } else {
            if (!artistRemoved) {
                res.status(404).send({ message: 'El artista ha sido eliminado' });
            } else {

                //Ahora vamos a eliminar todo lo que tenga asociado a el
                //Vamosa  eliminar todos sus albumnes
                Album.find({ artist: artistRemoved._id }).remove((err, albumRemoved) => {
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
                                        res.status(200).send({ artist: artistRemoved });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var artistId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2]; //Divide la ruta

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1]; //Divide la extension

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, artistUpdated) => {
                if (!artistUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar el artista' });
                } else {
                    res.status(200).send({ artist: artistUpdated });
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
    var path_file = './uploads/artists/' + imageFile; //ruta donde se guardan mis images
    fs.exists(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen...' });
        }
    });
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};
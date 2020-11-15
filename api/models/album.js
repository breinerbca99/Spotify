'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: { type: Schema.ObjectId, ref: 'Artist' } //Cuando pasemos un id Artist se llamaba el Schema del modelo Artista
});

module.exports = mongoose.model('Album', AlbumSchema);
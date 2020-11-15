'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema = Schema({
    number: String,
    name: String,
    duration: String,
    file: String,
    album: { type: Schema.ObjectId, ref: 'Album' } //Cuando pasemos un id Album se llamaba el Schema del modelo Album
});

module.exports = mongoose.model('Song', SongSchema);
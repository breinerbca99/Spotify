'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar rutas
var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//configuracion cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); //Permite todos los dominios
    res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY,Origin,X-Requested-With,Content-Type,Accept,Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE') // Metodos http
    res.header('Allow', 'GET,POST,OPTIONS,PUT,DELETE'); // Metodos http

    next(); // Sale del middleware
});

//rutas base
app.use('/api', user_routes); //Antes de cargar tendra este prefijo (para cualquier solicitud) para el user.js
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);


app.get('/pruebas', function(req, res) {
    res.status(200).send({ message: 'Bienvenido al curso' });
})

module.exports = app;
'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res) {
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la peticion'
            });
        } else {
            if (!artist) {
                res.status(500).send({
                    message: 'No se ha encontrado el artista'
                });
            } else {
                res.status(200).send({
                    artist
                });
            }
        }
    })


}

function saveArtist(req, res) {
    var artist = new Artist();
    var params = req.body;

    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if (err) {
            res.status(500).send({
                message: 'Se ha producido un error al guardar el artista'
            });
        } else {
            if (!artistStored) {
                res.status(404).send({
                    message: 'No se pudo guardar el artista'
                });
            } else {
                res.status(200).send({
                    artist: artistStored
                });
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

    Artist.find().sort('name').paginate(page, itemsPerPage, function (err, artists, total) {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!artists) {
                res.status(404).send({ message: 'No se han encontrado artistas' });
            } else {
                return res.status(200).send({
                    total_items: total,
                    artists: artists
                });
            }
        }

    });


}

function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;


    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!artistUpdated) {
                res.status(404).send({ message: 'No se ha podido actualizar el artista' });
            } else {
                return res.status(200).send({
                    artist: artistUpdated
                });
            }
        }
    });
}

function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!artistRemoved) {
                res.status(404).send({ message: 'No se ha eliminado el artista' });
            } else {
                Album.find({ artist: artistRemoved._id }).remove((err, albumRemoved) => {
                    if (err) {
                        res.status(500).send({ message: 'Error en la peticion' });
                    } else {
                        if (!albumRemoved) {
                            res.status(404).send({ message: 'No se ha eliminado el album' });
                        } else {

                            Song.find({ album: albumRemoved._id }).remove((err, songRemoved) => {
                                if (err) {
                                    res.status(500).send({ message: 'Error en la peticion' });
                                } else {
                                    if (!songRemoved) {
                                        res.status(404).send({ message: 'No se ha eliminado la canción' });
                                    } else {
                                        return res.status(200).send({ artist: artistRemoved });
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
    var userId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
       
        var file_split = file_path.split('\\');
      

        var file_name = file_split[2];
       

        var ext_split = file_name.split('\.');
        

        var file_ext = ext_split[1];
       
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

            Artist.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, artistUpdated) => {

                if (!artistUpdated) {
                    return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                } else {


                    return res.status(200).send({
                        artist: artistUpdated
                    });
                }
            });
        } else {
            res.status(200).send({
                message: 'Extension del archivo no valida'
            });
        }
    } else {
        res.status(200).send({
            message: 'Imagen no subida'
        });
    }
}

function getImageFile(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/artists/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen' });
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
}
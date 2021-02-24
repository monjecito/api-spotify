'use strict'

var express=require('express');
var md_auth=require('../middlewares/authenticated');
var AlbumController=require('../controllers/album');

var api=express.Router();

var multipart=require('connect-multiparty');
var md_upload=multipart({uploadDir:'./uploads/albums'});


api.put('/album/:id',md_auth.ensureAuth,AlbumController.updateAlbum);
api.get('/albums/:artist?',md_auth.ensureAuth,AlbumController.getAlbums);
api.post('/album',md_auth.ensureAuth,AlbumController.saveAlbum);
api.get('/album/:id',md_auth.ensureAuth,AlbumController.getAlbum);
api.delete('/album/:id',md_auth.ensureAuth,AlbumController.deleteAlbum);
api.post('/upload-image-album/:id',[md_auth.ensureAuth,md_upload],AlbumController.uploadImage);
api.get('/get-image-album/:imageFile',AlbumController.getImageFile);

module.exports = api;
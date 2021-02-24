'use scrict'
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var AlbumSchema=Schema({
    title:String,
    description:String,
    year:Number,
    image:String,
    artist:{type:Schema.ObjectId,ref:'Artist'}
});

module.exports=mongoose.model('Album',AlbumSchema);
//articles --> Guardar documentos de este tipo con esa estructura en la coleccion
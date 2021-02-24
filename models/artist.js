'use scrict'
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var ArtistSchema=Schema({
    name:String,
    description:String,
    image:String
});

module.exports=mongoose.model('Artist',ArtistSchema);
//articles --> Guardar documentos de este tipo con esa estructura en la coleccion
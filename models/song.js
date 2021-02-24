'use scrict'
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var SongSchema=Schema({
   number:String,
   name:String,
   duration:String,
   file:String,
   album:{type:Schema.ObjectId,ref:'Album'}
});

module.exports=mongoose.model('Song',SongSchema);
//Song --> Guardar documentos de este tipo con esa estructura en la coleccion
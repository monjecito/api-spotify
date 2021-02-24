'use strict'
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var UserSchema=Schema({
    name:String,
    surname:String,
    email:String,
    password:String,
    role:String,
    image:String
});

module.exports=mongoose.model('User',UserSchema);
//User --> Guardar documentos de este tipo con esa estructura en la coleccion
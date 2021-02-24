'use strict'

var mongoose=require('mongoose');
var app=require('./app');
var port=process.env.PORT||3977;

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/bd-spotify',(err,res)=>{
    if(err)
    {
        throw(err);
    }else{
        console.log('La base de datos esta corriendo adecuadamente');
        app.listen(port,function(){
            console.log('Servidor del API Rest corriendo correctamente en http://localhost/'+port);
        });
    }
});
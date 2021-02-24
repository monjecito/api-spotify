'use strict'
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
var fs=require('fs');
var path=require('path');
const user = require('../models/user');

function pruebas(req, res) {
    res.status(200).send({
        message: 'Mensaje de prueba'
    });

}

function saveUser(req, res) {
    var user = new User();

    var params = req.body;
    console.log(params);
    if (params.name && params.surname && params.email) {
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_ADMIN';
        user.image = 'null';

        if (params.password) {
            //Encriptar contraseña y guardar los datos
            bcrypt.hash(params.password, null, null, function (err, hash) {
                user.password = hash;

                //Guardar el usuario
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({
                            message: 'Error al guardar el usuario'
                        });
                    } else {
                        if (!userStored) {
                            res.status(404).send({
                                message: 'No se ha registrado el usuario'
                            });
                        } else {
                            res.status(200).send({
                                user: userStored
                            });
                        }

                    }
                });

            });

        } else {
            res.status(200).send({
                message: 'Introduce la contraseña'
            });
        }

    } else {
        res.status(200).send({
            message: 'Faltan datos'
        });

    }

}

function loginUser(req, res) {
    let params = req.body;

    let email = params.email;
    let password = params.password;

    User.findOne({ email: email }, (err, user) => {
        if (err) {
            res.status(500).send({
                message: 'Error en la petición'
            });
        } else {
            if (!user) {
                res.status(404).send({
                    message: 'El usuario no existe'
                });
            } else {
                //Comprobar contraseña
                bcrypt.compare(password, user.password, function (err, check) {
                    if (check) {
                        //Devolver datos usuario logeado
                        if (params.getHash) {
                            //Devolver un token JWT
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            res.status(200).send({ user });
                        }
                    } else {
                        res.status(404).send({
                            message: 'El usuario no ha podido loguearse'
                        });
                    }
                });
            }
        }
    });
}
function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    if(userId!=req.user.sub)
    {
       return res.status(500).send({
            message: 'Error al actualizar el usuario'
        });
    }

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if (err) {
            res.status(500).send({
                message: 'Error al actualizar el usuario'
            });
        } else {
            if (!userUpdated) {
                res.status(404).send({
                    message: 'El usuario no ha podido ser actualizado'
                });
            } else {
                res.status(200).send({
                    user: userUpdated
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
        console.log(file_path);
        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[2];
        console.log(file_name);

        var ext_split = file_name.split('\.');
        console.log(ext_split);

        var file_ext = ext_split[1];
        console.log(file_ext);
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdated) => {

                if (!userUpdated) {
                    return res.status(404).send({ message: 'No se ha podido actualizar el usuario' });
                } else {


                    return res.status(200).send({
                        image:file_name, 
                        user: userUpdated
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
    var path_file = './uploads/users/' + image_file;

    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la imagen' });
        }

    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};
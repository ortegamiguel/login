const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const User = require('../models/user');


const signUp = (req, res) => {
    const user = new User();

    const { name, lastname, email, password, repeatPassword } = req.body;

    user.name = name;
    user.lastname = lastname;
    user.email = email;
    user.role = "admin";
    user.active = false;

    if (!password || !repeatPassword) {
        res.status(404).send({message: "Contraseñas obligatorias"});
    } else {
        if ( password !== repeatPassword ) {
            res.status(404).send({message: "contraseñas no iguales"});
        } else {
            bcrypt.hash(password, null, null, (err, hash) => {
                if (err) {
                    res.status(500).send({message: "Error al encriptar contraaseña"});
                } else {
                    user.password = hash;

                    user.save((err, userStored) => {
                        if (err) {
                            res.status(500).send({message: "Usuario ya existe"});
                        } else {
                            if (!userStored) {
                                res.status(404).send({message: "Error al crear usuario"});
                            } else {
                                res.status(201).send({user: userStored});
                            }
                        }
                    });
                }
            });
        }
    }
};

const signIn = (req, res) => {
    const params = req.body;
    const email = params.email.toLowerCase();
    const password = params.password;


    User.findOne({ email }, (err, userStored) => {
        if (err) {
            res.status(500).send({message: "Error del servidor"});
        } else {
            if (!userStored) {
                res.status(404).send({message: "Usuario no encontrado"});
            } else {
                bcrypt.compare(password, userStored.password, (err, check) => {
                    if (err) {
                        res.status(500).send({message: "Error del servidor"});
                    } else if (!check){
                        res.status(404).send({message: "Contraseña incorrecta"});
                    } else {
                        if (!userStored.active) {
                            res.status(200).send({code: 200, message: "El usuario no ha activado"});
                        } else {
                            res.status(200).send({
                                accessToken: jwt.createAccessToken(userStored),
                                refreshToken: jwt.createRefreshToken(userStored)
                            });
                        }
                    }
                });
            }
        }
    });
};


module.exports = {
    signUp,
    signIn
}
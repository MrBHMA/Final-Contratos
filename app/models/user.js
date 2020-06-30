'use strict'
const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs') //cargo el modulo para encriptar las contraseñas


const userSchema = new mongoose.Schema({
    local:{
        email: String,
        password:String
    }
});

userSchema.methods.generateHash = function(password){ //funcion para encriptar contraseñas
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null) //transformar la contraseña con el metodo genSalt usado 8 veces.
}

userSchema.methods.validatePassword = function(password){ //funcion para trasnformar la contraseña ingresada al iniciar sesion y poder compararla.
    return bcrypt.compareSync(password,this.local.password) //compaprar
}

module.exports = mongoose.model('User', userSchema)
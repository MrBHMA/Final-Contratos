const LocalStrategy = require('passport-local').Strategy; //cargar el modulo de passport local.   
const User = require('../app/models/user') //cargar el modelo de los Usuarios.

module.exports = function (passport) {

    passport.serializeUser(function(user, done){ //serializar los datos.
        done(null, user.id)
    })

    passport.deserializeUser(function(id,done){ //desserializar los datos
        User.findById(id, function(err,user){
            done(err,user)
        })
    })
    
    //signup
    passport.use('local-signup',new LocalStrategy({ //Metodo que permite registrarse al usuario
        usernameField:'email',
        passwordField:'password',
        passReqToCallback: true
    },
    function(req, email, password, done){
        User.findOne({'local.email': email}, function(err, user){
            if(err){return done(err);} //en caso de haber algun error en el registro
            if(user){return done(null, false, req.flash('signupMessage', 'El correo que intenta usar ya esta registrado.'))} //en caso de que el nombre ya exista
            else{ //si todo esta correcto, se mandan los datos y la contraseña cifrada
                if(password == req.body.confirmar){
                    var newUser =new User()
                    newUser.local.email = email;
                    newUser.local.password= newUser.generateHash(password); //se utiliza el metodo antes creado en el modelo para cifrar las contraseñas.
                    newUser.save(function(err) {  //guardar los datos en la bd
                        if(err) {throw err;} //en caso de algun error al guardar 
                        return done(null, newUser);
                    })
                }
                else{
                    return done(null,false,req.flash('signupMessage','Las contraseña no coincide'))
                }
            }
        })
    }))
    
    //Login
    passport.use('local-login',new LocalStrategy({ //Metodo que permite logear al usuario
        usernameField:'email',
        passwordField:'password',
        passReqToCallback: true
    },
    function(req, email, password, done){
        User.findOne({'local.email': email}, function(err, user){
            if(err){return done(err)} //en caso de haber algun error en el login
            if(!user){return done(null, false, req.flash('loginMessage', 'El correo electrónico no está registrado.'))} //en caso de que el nombre NO exista.
            if(!user.validatePassword(password)){ //en caso de que la contraseña no coincida con la bd
                return done(null,false,req.flash('loginMessage','Contraseña incorrecta')) //retorna este mensaje.
            }
            return done(null,user);
        })
    }))


} 
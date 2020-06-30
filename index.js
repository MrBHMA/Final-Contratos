'use strict'
const express = require('express') //inicializar express
const path = require('path') //cargar modulo para majear rutas
const mongoose = require('mongoose') //permite conectar a  mongodb

const passport = require('passport') //permite autenticar los inicios de sesion
const flash = require('connect-flash')//poder enviar mensajes entre vistas
const morgan = require('morgan')//forma de definir metodos http del servidor y mostrarlos
const cookieParser=require('cookie-parser')//permite manejar las cookies del navegador
const session=require('express-session')//permite comprobar las sesiones.


const bodyParser = require('body-parser')//
const config = require('./config/config') //inicializar  archivo de cofiguraciones
const hbs = require('express-handlebars') //inicializar motor de vistas hbs
const app = express() //cargar express
const method0verride = require('method-override') //apirest

const Handlebars = require('handlebars') //variable para cargar Handlebars
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access') //variable agregada para solucionar problema


require('./config/passport')(passport) //cargar la configuracion de passport

//settigs
app.engine('.hbs', hbs({
    defaultLayout: 'index',
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars) //esto tambien lo agregue.
}))

app.set('view engine', '.hbs')



//middlewares . . .
app.use(morgan('dev')) //poder visualizar los mensajes en consola
app.use(cookieParser()) //Administrar las cookies
app.use(bodyParser.urlencoded({extended:false}))
app.use(session({ //manejar sesiones de express
    secret: 'secret', //palabra secreta para sesiones
    resave: false, //para que no se guarde cada cierto tiempo
    saveUninitialized:false
}))
app.use(passport.initialize()) //inicializar el modulo para comprobar las sesiones
app.use(passport.session()) //unir passport a las sesiones
app.use(flash()) //modulo para mandar mensajes entre distintos html


app.use(bodyParser.json())
app.use(method0verride('_method')) //apirest

//rutas . . .
require('./app/routes')(app, passport) //exportar el modulo de rutas y mando como parametro la variable app y passport
//archivos estaticos
app.use('/static',express.static('public'))

/*moongose.connect('mongodb+srv://admin1:admin1@contratos-database-a2ie7.mongodb.net/<dbname>?retryWrites=true&w=majority')
.then(db => console.log('db connected'))
.catch(err => console.log(err));

app.set('port', process.env.PORT || 3000);

server.listen(app.get('port'), ()=>{
  console.log(`server on port ${app.get('port')}`)
});
*/mongoose.connect('mongodb+srv://admin1:admin1@contratos-database-a2ie7.mongodb.net/contratos-database?retryWrites=true&w=majority',(err,res)=>{ //conectar con la base de datos.
    if(err){
        return console.log(`Error al conectar la BD ${err}`)
    }
    console.log('Conexion a la BD exitosa')
    app.listen(config.port,()=>{
        console.log(`API-REST ejecutando en http://localhost:${config.port}`)
    })
})

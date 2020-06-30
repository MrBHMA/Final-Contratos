module.exports = {

    port: process.env.PORT ||  3000,
    db: process.env.MONGODB || 'mongodb+srv://admin1:admin1@contratos-database-a2ie7.mongodb.net/shop?retryWrites=true&w=majority',
    urlParser:{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
}

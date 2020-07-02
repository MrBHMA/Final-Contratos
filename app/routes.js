
module.exports=(app,passport)=>{

const Product = require('./models/product')
const PDFDocument = require('pdfkit'); //constates para crear el pdf
const fs = require('fs');



app.get('/',(req,res)=>{ //get para cargar home
    res.render('login')
})
app.get('/home',isLoggedIn,(req,res)=>{
    res.render('home')
})
app.get('/Contratos',isLoggedIn, (req,res)=>{
    res.render('ContratoCV.hbs')
})
app.get('/about',isLoggedIn, (req,res)=>{
    res.render('about.hbs')
})
app.get('/contact',isLoggedIn, (req,res)=>{
    res.render('contact.hbs')
})
//login . . . . .
app.get('/login',(req,res)=>{ //get para la ruta de login
    res.render('login',{ 
        message: req.flash('loginMessage') //renderizar un mensaje
    })
})
app.post('/login',passport.authenticate('local-login',{
    successRedirect: '/home', //si es correcto
   failureRedirect: '/login', //si falla en algo
   failureFlash: true //mensajes de error.
}))


//signUp . . . . . 
app.get('/signup',(req,res)=>{ //get par la ruta a registro
    res.render('signup', {
        message: req.flash('signupMessage'),
        
    })
    
})
app.post('/signup',passport.authenticate('local-signup',{ //post que permite el registro de un usuario 
   successRedirect: '/profile', //si es correcto
   failureRedirect: '/signup', //si falla en algo
   failureFlash: true //mensajes de error.
   
}))


app.get('/profile',isLoggedIn,(req, res)=>{
    res.render('profile',{
        user:req.user
    })
})

app.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/')
})

//funcion para comprobar si el usuario esta logeado y
// bloquear el acceso a las paginas si no es asi.
function isLoggedIn(req,res, next){
    if(req.isAuthenticated()){
        return next();
    }
    return res.redirect('/')
}

//funcion para los contratos
app.post('/contrato', (req,res)=>{
    // --Variables Primera parte de formulario  --
    var municipio = req.body.municipio
    var estado = "Baja California" //esto luego se cambia por una variable
    var fecha = req.body.fecha
    

    var VF1Direccion = req.body.VF1Direccion
    var VF2Direccion = req.body.VF2Direccion
    var VM1Direccion = req.body.VM1Direccion
    var VM2Direccion = req.body.VM2Direccion

    var CF1Direccion = req.body.CF1Direccion
    var CF2Direccion = req.body.CF2Direccion
    var CM1Direccion = req.body.CM1Direccion
    var CM2Direccion = req.body.CM2Direccion
    // V 1
    var cantidadDeVendedores = req.body.cantidaddevendedores
    var TipoDePersonaVendedor1 = req.body.tipodepersonavendedor1

    var VF1Nombre = req.body.VF1nombre
    var VF1Genero = req.body.VF1genero

    var VM1Nombre = req.body.VM1nombre
    var VM1creacion=req.body.VM1creacion
    var VM1numero = req.body.VM1numero
    var VM1fecha = req.body.VM1fecha
    var VM1Nombrerepresentante= req.body.VM1nombrerepresentante
    // V 2
    var TipoDePersonaVendedor2 = req.body.tipodepersonavendedor2
    
    var VF2Nombre = req.body.VF2nombre
    var VF2genero=req.body.VF2genero

    var VM2Nombre = req.body.VM2nombre
    var VM2creacion = req.body.VM2creacion
    var VM2numero = req.body.VM2numero
    var VM2fecha = req.body.VM2fecha
    var VM2NombreRepresentante = req.body.VM2nombrerepresentante

    //seccion del comprador 
    var CantidadDeCompradores = req.body.cantidaddecompradores

    var TipoDePersonaComprador1 = req.body.tipodepersonacomprador1
    // C1
    var CM1Nombre = req.body.CM1nombre
    var CM1Creacion = req.body.CM1creacion
    var CM1Numero = req.body.CM1numero 
    var CM1Fecha = req.body.CM1fecha
    var CM1NombreRepresentante = req.body.CM1nombrerepresentante 
    
    var CF1Nombre=req.body.CF1nombre
    var CF1Genero=req.body.CF1genero
    // C2
    var TipoDePersonaComprador2 = req.body.tipodepersonacomprador2
    var CM2Nombre= req.body.CM2nombre 
    var CM2Creacion = req.body.CM2creacion 
    var CM2Numero = req.body.CM2numero
    var CM2Fecha =req.body.CM2fecha
    var CM2NombreRepresentante = req.body.CM2nombrerepresentante

    var CF2Nombre = req.body.CF2nombre 
    var CF2Genero = req.body.CF2genero 


    // --Variables segunda parte de formulario --
    var tipoDeObjeto =req.body.Tipodeobjeto 
    var VehiculoTipo =req.body.VehiculoTipo
    var VehiculoMarca = req.body.VehiculoMarca
    var VehiculoModelo =req.body.VehiculoModelo
    var NumeroIDVeicular = req.body.NumeroIDVeicular
    var placasDeCirculacion= req.body.Placasdecirculacion
    var placasNacOFront= req.body.placasNacOFront
    var VehiculoAdquiridoDe=req.body.VehiculoAdquiridoDe
    var fechaAdquirido = req.body.fechaAdquirido
    var VehiculoDescripcion = req.body.VehiculoDescripcion
    


    // --Variables Tercera parate del formulario-- 
    var TdeCirculacion = req.body.TdeCirculacion
    var Factura = req.body.Factura
    var Pedimento = req.body.Pedimento
    var DomicilioDelPago =req.body.DomicilioDelPago
    var Precio = req.body.Precio
    var PrecioLetra = req.body.PrecioLetra
    
    var MetodoPago =req.body.MetodoPago
    var otroMetodoPago =req.body.otroMetodoPago

    //variables adicionales
    var primerParrafo=[];
    var PrimerDeclaracion=[];
    var SegundaDeclaracion=[];
    var TercerDeclaracion=[];
    var PrimerClausula=[];
    var SegundaClausula=[];
    var TercerClausula=[];
    var CuartaClausula=[];
    var QuintaClausula=[];
    var QC1=[];
    var QC2=[];
    var UltimoParrafo=[];


    var DomicilioDelPago = req.body.DomicilioDelPago

    // --- creacion del documento pdf ----
    var doc = new PDFDocument();
    
    doc.pipe(fs.createWriteStream(__dirname + '/../public/pdf/Contrato.pdf')) //se guarda el archivo creado 
    
    doc.font('Helvetica-Bold',22).fill('#b34d4d').text('CONTRATO  DE  COMPRAVENTA',{align: 'center'})
    doc.lineWidth(1).lineCap('butt').moveTo(100,100).lineTo(515,100).stroke('#b34d4d');
    doc.text(" ")
    ///////////////
    ///////////////
    ///////////////
        VF1Nombre = VF1Nombre.toUpperCase();
        VF2Nombre = VF2Nombre.toUpperCase();
        CF1Nombre = CF1Nombre.toUpperCase();
        CF2Nombre = CF2Nombre.toUpperCase();

        VM1Nombre = VM1Nombre.toUpperCase();
        VM2Nombre = VM2Nombre.toUpperCase();
        CM1Nombre = CM1Nombre.toUpperCase();
        CM2Nombre = CM2Nombre.toUpperCase();

        VM1Nombrerepresentante = VM1Nombrerepresentante.toUpperCase();
        VM2NombreRepresentante = VM2NombreRepresentante.toUpperCase();
        CM1NombreRepresentante = CM1NombreRepresentante.toUpperCase();
        CM2NombreRepresentante = CM2NombreRepresentante.toUpperCase();

        var fecha1 =  new Date(fecha)
        var fecha1Letra = (fecha1.getUTCDate()) + " de " + month_name(fecha1) + " del " + fecha1.getUTCFullYear()

        var fechaVM1 =  new Date(VM1fecha)
        var fechaVM1Letra = (fechaVM1.getUTCDate()) + " de " + month_name(fechaVM1) + " del " + fechaVM1.getUTCFullYear()
        var fechaVM2 =  new Date(VM2fecha)
        var fechaVM2Letra = (fechaVM2.getUTCDate()) + " de " + month_name(fechaVM2) + " del " + fechaVM2.getUTCFullYear()
        var fechaCM1 =  new Date(CM1Fecha)
        var fechaCM1Letra = (fechaCM1.getUTCDate()) + " de " + month_name(fechaCM1) + " del " + fechaCM1.getUTCFullYear()
        var fechaCM2 =  new Date(CM2Fecha)
        var fechaCM2Letra = (fechaCM2.getUTCDate()) + " de " + month_name(fechaCM2) + " del " + fechaCM2.getUTCFullYear()
        
        var fechaadquirido =  new Date(fechaAdquirido)
        var fechaadquiridoLetra = (fechaadquirido.getUTCDate()) + " de " + month_name(fechaadquirido) + " del " + fechaadquirido.getUTCFullYear()
   
        primerParrafo = "En " + municipio + ", " + estado + " el " + fecha1Letra; //generico
		
		console.log("tipodepersonavendedor1 " + TipoDePersonaVendedor1);
		if (TipoDePersonaVendedor1 === 'fisica'){
            if(VF1Genero ==="m"){
                primerParrafo = primerParrafo + " por una parte en calidad de “VENDEDORA”, " + VF1Nombre; 
            } //m
            else{
                primerParrafo = primerParrafo + " por una parte en calidad de “VENDEDOR”, " + VF1Nombre
            } //h
        }
		else if (TipoDePersonaVendedor1 === 'moral'){
			primerParrafo = primerParrafo + " por una parte en calidad de “VENDEDORA”, " + VM1Nombre + ", representada por " + VM1Nombrerepresentante; 
		}
			
		if (cantidadDeVendedores == 2){ // Adaptar al numero de vendedores
			if (TipoDePersonaVendedor2 === 'fisica'){
				if(VF2genero == 'm'){
					primerParrafo = primerParrafo + " junto con la vendedora " + VF2Nombre;
				}
				else{
					primerParrafo = primerParrafo + " junto con el vendedor " + VF2Nombre;
				}
			}
			else if (TipoDePersonaVendedor2 === 'moral'){
				primerParrafo = primerParrafo + " junto con " + VM2Nombre + ", representada por " + VM2NombreRepresentante; 
			}
		}
		
		if (TipoDePersonaComprador1 === 'fisica'){
			if(CF1Genero == "m"){
                primerParrafo=primerParrafo+", y por la otra como la “COMPRADORA”, " + CF1Nombre
			}
			else{
				primerParrafo = primerParrafo+", y por la otra como “COMPRADOR ”, " + CF1Nombre
			}
		}
		else if (TipoDePersonaComprador1 === 'moral'){
			primerParrafo = primerParrafo + "y por la otra como la “COMPRADORA”, " + CM1Nombre + ", representada por " + CM1NombreRepresentante		
		}
			
		if (CantidadDeCompradores == 2){
			if (TipoDePersonaComprador2 === 'fisica'){
				if(CF2Genero == "m"){
					primerParrafo = primerParrafo + ", junto con la compradora " + CF2Nombre.value;
				}
				else{
					primerParrafo = primerParrafo + ", junto con el comprador " + CF2Nombre.value;
				}		
					
			}
			else if (TipoDePersonaComprador2 === 'moral'){
				primerParrafo = primerParrafo + ", junto con ”, " + CM2Nombre + ", representada por " + CM2NombreRepresentante ;
			}
		}
        primerParrafo = primerParrafo + ", convienen celebrar un contrato de compraventa al tenor de las siguientes declaraciones y clausulas:";
		
        PrimerDeclaracion = "I.- Declara el “VENDEDOR” ser el legítimo propietario de un " + tipoDeObjeto + " tipo " + VehiculoTipo + 
            ", marca " + VehiculoMarca + ", modelo " + VehiculoModelo;
        if (placasNacOFront == "Nacionales"){
            PrimerDeclaracion = PrimerDeclaracion + ", placas de circulación nacionales " ;
        }
        else {
            PrimerDeclaracion = PrimerDeclaracion + ", placas fronterizas " ;
        }
            
        PrimerDeclaracion = PrimerDeclaracion + placasDeCirculacion +
			", " + VehiculoDescripcion +	", con número de identificación vehicular " + NumeroIDVeicular + " mismo que adquirió de " + VehiculoAdquiridoDe + " el " + fechaadquiridoLetra;
			
			if (TipoDePersonaComprador1 === 'moral'){
				SegundaDeclaracion = " II.- Declara la “COMPRADORA” que " + CM1Nombre;
					
			if (CM1Creacion === 'escritura'){
				SegundaDeclaracion = SegundaDeclaracion + ", es una sociedad mexicana constituida mediante escritura pública número " + CM1Numero;
			}
			else {
				SegundaDeclaracion = SegundaDeclaracion + ", es una sociedad mexicana constituida mediante poliza número " + CM1Numero;
			}
			SegundaDeclaracion = SegundaDeclaracion + ", de fecha " + fechaCM1Letra + ", inscrita bajo bajo número único del documento 201800007774" /*+ numero*/ + 
				", de fecha " + fechaCM1Letra + ", del Registro Público de Comercio, con Registro Federal de Causantes IFR171212R67, y con domicilio en calle Jalapa número 11, interior 1, colonia Neidhart, " + municipio  + ", " +  estado;
			}
				
			TercerDeclaracion = "II.- Declaran “VENDEDOR” y “COMPRADOR” que es su libre voluntad celebrar un contrato de compraventa respecto el bien mueble antes descrito para. Expuesto lo anterior, sobre la base de lo dispuesto por los numerales 6 y 2122 al 2190 del Código Civil vigente en el Estado de Baja California, las partes, establecen las siguientes:";
            
			PrimerClausula = "PRIMERA.- OBJETO.- La “VENDEDORA” entrega y transmite la propiedad del mueble descrito en la declaración I a la “COMPRADORA”, y éste lo recibe de conformidad, en el domicilio ubicado en " + DomicilioDelPago + ". ";
			
            //
            PrimerDeclaracion = PrimerDeclaracion + " y en este acto se exhibe y entregan ";
            console.log("t cir " + TdeCirculacion);
			if (TdeCirculacion && Factura){
				PrimerDeclaracion = PrimerDeclaracion + " originales de tarjeta de circulacion y factura a nombre de ";
			}
			else if(TdeCirculacion){
				PrimerDeclaracion = PrimerDeclaracion  + " originales de tarjeta de circulacion a nombre de ";
			}
			else if(Factura){
				PrimerDeclaracion = PrimerDeclaracion  + " factura a nombre de ";
			}
			if (TipoDePersonaVendedor1 === 'moral'){
				PrimerDeclaracion = PrimerDeclaracion  +  VM2Nombre;
			}
			else{
				PrimerDeclaracion = PrimerDeclaracion  + VF2Nombre;
			}
			if (Pedimento){
				PrimerDeclaracion = PrimerDeclaracion  + ", así como original de pedimento de importación.";
			}

			SegundaClausula = "SEGUNDA.- PRECIO.- El precio por la presente operación de compraventa es la cantidad de $" + Precio + " pesos (" + PrecioLetra + " 00/100 moneda nacional), que en este acto entrega el “COMPRADOR” al “VENDEDOR”" ;

			if (MetodoPago === 'Efectivo'){
				SegundaClausula = SegundaClausula + " al contado."
			}
			else if (MetodoPago === 'Cheque'){
				SegundaClausula = SegundaClausula  + " por medio de un cheque."
			}
			else{ 
                SegundaClausula = SegundaClausula   + " por medio de " + otroMetodoPago +"."
            }
			
			TercerClausula = "TERCERA.- RESPONSABILIDAD Y CAMBIO DE PROPIETARIO.- A partir de la firma del presente contrato y entrega del vehículo objeto de compraventa, el “COMPRADOR” libera de toda responsabilidad al “VENDEDOR”, comprometiéndose a que en un breve lapso, que no podrá ser mayor de 30 días hábiles, realizará los trámites correspondientes ante la dependencia de gobierno correspondiente para hacer el cambio de propietario, siendo a cargo del “COMPRADOR” el pago de todos los gastos y derechos que deben cubrirse para tal objeto.";
				
			CuartaClausula = "CUARTA.- INTERPRETACIÓN Y CUMPLIMIENTO.- Para la interpretación y cumplimiento de todo lo relacionado con el presente contrato, las partes se someten expresamente a las leyes y tribunales competentes de la ciudad de " +
            municipio + ", " +  estado + ", por lo que renuncian a cualquier otra jurisdicción que por razón de su domicilio futuro les pudiera corresponder.";
            
			QuintaClausula = "QUINTA.- DOMICILIOS.- Para cualquier notificación judicial o extrajudicial con motivo de este contrato, las partes convienen en señalar como su domicilio, los siguientes: ";
			
			if (TipoDePersonaVendedor1 === 'fisica'){
				QC1 = "El “VENDEDOR”, " + VF1Direccion;
			}
			else{ 
				QC1 = "El “VENDEDOR”, " + VM1Direccion;
			}

			if (TipoDePersonaComprador1 === 'fisica'){
				QC2 = "El “COMPRADOR”, " + CF1Direccion;
			}
			else{ 
				QC2 = "El “COMPRADOR”, " + CM1Direccion;
			}

			UltimoParrafo = "Leído que fue a las partes el presente contrato, anexando como apéndice los documentos mencionados en la declaración I, y copia simple de sus identificaciones oficiales, ante la presencia de dos testigos, proceden a firmar dos ejemplares del mismo.";

    ///////////////*/
    ///////////////
    ///////////////
    doc.font('Times-Roman',12).fill('#000000').text(primerParrafo,{align: 'justify'})
    //DECLARACIONES 
    doc.text(" ")
    doc.text(" ")
    doc.font('Helvetica-Bold',14).fill('#9e385c').text('DECLARACIONES',{align: 'center',characterSpacing:2}) 
    doc.text(" ")
    doc.font('Times-Roman',12).fill('#000000').text(PrimerDeclaracion,{align: 'justify'})
    doc.text(" ")
    doc.font('Times-Roman',12).fill('#000000').text(SegundaDeclaracion,{align: 'justify'})
    doc.font('Times-Roman',12).fill('#000000').text(TercerDeclaracion,{align: 'justify'})
    doc.text(" ")
    doc.text(" ")
    doc.font('Helvetica-Bold',14).fill('#9e385c').text('CLÁUSULAS',{align: 'center',characterSpacing:2}) 
    doc.text(" ")
    doc.font('Times-Roman',12).fill('#000000').text(PrimerClausula,{align: 'justify'})
    doc.text(" ")
    doc.font('Times-Roman',12).fill('#000000').text(SegundaClausula,{align: 'justify'})
    doc.text(" ")
    doc.font('Times-Roman',12).fill('#000000').text(TercerClausula,{align: 'justify'})
    doc.text(" ")
    doc.font('Times-Roman',12).fill('#000000').text(CuartaClausula,{align: 'justify'})
    doc.text(" ")
    doc.font('Times-Roman',12).fill('#000000').text(QuintaClausula,{align: 'justify'})
    doc.font('Times-Roman',12).fill('#000000').text(QC1,{align: 'justify'})
    doc.font('Times-Roman',12).fill('#000000').text(QC2,{align: 'justify'})
    doc.text(" ")
    doc.font('Times-Roman',12).fill('#000000').text(UltimoParrafo,{align: 'justify'})
   
    /* //Primera declaracion
    doc.font('Times-Roman',12).fill('#000000').text("I.- Declara el “VENDEDOR” ser el legítimo propietario de un "+tipoDeObjeto +"tipo "+VehiculoTipo + ", marca "+VehiculoMarca+", modelo "+VehiculoModelo+", placas de circulacion nacionales "+placasDeCirculacion+" "+VehiculoDescripcion+" mismo que adquirió de "+VehiculoAdquiridoDe+" el "+fechaAdquirido+".")
    doc.text(" ")
    if(TipoDePersonaComprador1=="moral"){ //si es moral
        doc.text("II.- Declara la “COMPRADORA"+CM1Nombre)
        if(CM1Creacion=="escritura"){doc.text(", es una sociedad mexicana constituida mediante escritura pública número"+CM1Numero)}
        else{doc.text("es una sociedad mexicana constituida mediante poliza número "+CM1Numero)}
        doc.text(", de fecha "+CM1Fecha)
        doc.text(", inscrita bajo bajo número único del documento "+CM1Numero)
        doc.text(", de fecha "+CM1Fecha+".")
        doc.text(", del Registro Público de Comercio, con Registro Federal de Causantes IFR171212R67, y con domicilio en calle Jalapa número 11, interior 1, colonia Neidhart, Tijuana, Baja California ")
    }
    doc.text("II.- Declaran “VENDEDOR” y “COMPRADOR” que es su libre voluntad celebrar un contrato de compraventa respecto el bien mueble antes descrito para. Expuesto lo anterior, sobre la base de lo dispuesto por los numerales 6 y 2122 al 2190 del Código Civil vigente en el Estado de Baja California, las partes, establecen las siguientes:")
    
    doc.text("Expuesto lo anterior, sobre la base de lo dispuesto por los numerales 6 y 2122 al 2190 del Código Civil vigente en el Estado de Baja California, las partes, establecen las siguientes:")
    
    doc.text(" ")
    doc.font('Helvetica-Bold',14).fill('#9e385c').text('CLÁUSULAS',{align: 'center',characterSpacing:2}) 
    doc.text(" ")

    var primeraClausula = []
    doc.font('Times-Roman',13).fill('#000000').text("PRIMERA.- OBJETO.- La  “VENDEDORA”  entrega y transmite la propiedad del mueble descrito en la declaración I a la “COMPRADORA”, y éste lo recibe de conformidad, en el domicilio ubicado en la calle"+DomicilioDelPago)
    doc.text(" ")
    doc.text("SEGUNDA.- PRECIO.- El precio por la presente operación de compraventa es la cantidad de $"+Precio+" pesos (----esto cambiara por otra variable----), que en este acto entrega el “COMPRADOR” al “VENDEDOR” al contado.")
    doc.text(" ")
    doc.text("TERCERA.- RESPONSABILIDAD Y CAMBIO DE PROPIETARIO.- A partir de la firma del presente contrato y entrega del vehículo objeto de compraventa, el “COMPRADOR” libera de toda responsabilidad al “VENDEDOR”, comprometiéndose a que en un breve lapso, que no podrá ser mayor de 30 días hábiles, realizará los trámites correspondientes ante la dependencia de gobierno correspondiente para hacer el cambio de propietario, siendo a cargo del “COMPRADOR” el pago de todos los gastos y derechos que deben cubrirse para tal objeto.")
    doc.text(" ")
    doc.text("QUINTA.- DOMICILIOS.- Para cualquier notificación judicial o extrajudicial con motivo de este contrato, las partes convienen en señalar como su domicilio, los siguientes: ")
    doc.text(" El “VENDEDOR”, ") //aqui va la variable para la direccion del vendedor
    doc.text(" El “COMPRADOR”,  ") // direccion del comprador
    doc.text("Leído que fue a las partes el presente contrato, anexando como apéndice los documentos mencionados en la declaración I, y copia simple de sus identificaciones oficiales, ante la presencia de dos testigos, proceden a firmar dos ejemplares del mismo.  ")
   */
    doc.text(' ')
    doc.text(' ')
    doc.text(' ')
    doc.text(' ')
   
    doc.text(' ')
    doc.text('"VENDEDOR"                     "COMPRADOR"',{align:'center'})
    doc.lineWidth(1).lineCap('butt').moveTo(150,280).lineTo(288,280).stroke();
    doc.lineWidth(1).lineCap('butt').moveTo(312,280).lineTo(450,280).stroke();
    doc.text(' ')
    doc.text(' ')
    doc.text(' ')
    doc.text(' ')
    doc.text(' ')
    doc.text('"TESTIGOS"',{align:'center'})
    doc.lineWidth(1).lineCap('butt').moveTo(150,370).lineTo(288,370).stroke();
    doc.lineWidth(1).lineCap('butt').moveTo(312,370).lineTo(450,370).stroke();


    doc.end();
    console.log('Archivo PDF generado...')
    
    res.render('ContratoCV.hbs')

    
})  
app.post('/descargar',(req,res)=>{ //post que permite el registro de un usuario 
    res.download('Contrato.pdf')
    
 })

 var month_name = function(dt){
    mlist = [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ];
      return mlist[dt.getMonth()];
    };
    
}
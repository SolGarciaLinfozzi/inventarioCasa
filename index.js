const express = require('express')
const app = express()
const mysql = require('mysql2')
const hbs = require('hbs') // motor de plantilla
const path = require('path') // encontrar archivo - enrrutador
const nodemailer = require('nodemailer') // envíar mails
require('dotenv').config()  // variables de entorno

//configuramos el puerto
const PORT = process.env.PORT || 9000// npm run dev (en consola)

//middelware
app.use(express.json()) // la app sabe leer json
app.use(express.urlencoded({ extended: true })) // si los archivos vienen codificados, decodificalos
app.use(express.static(path.join(__dirname, 'public'))) // busca los archivos estáticos en esa ruta

//configuramos el motor de plantillas de hbs
app.set('view engine', 'hbs')
//configuramos la ubicación de las plantillas
app.set('views', path.join(__dirname, 'views'))
//configuramos los parcials de los motores de plantillas
hbs.registerPartials(path.join(__dirname, 'views/partials'))


//conexión a la base de datos
const conexion = mysql.createConnection({
    host: process.env.HOST,
    port: process.env.DBPORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
})

conexion.connect((error) => {
    if (error) {
        console.log(`El error es: ${error}`);
    } else {
        console.log(`Conectado a la Base de Datos ${process.env.DATABASE}`);
    }
})


//Rutas de las peticiones
app.get('/', (req, res) => {
    let sql = "SELECT * FROM productos ORDER BY nombreProducto ASC";
    conexion.query(sql, function (err, result) {
        if (err) throw err;
        res.render('index', {
            datos: result
        })
    })
})


//Agregar producto
app.post('/', (req, res) => {
    const nombre = req.body.nombreProducto
    const stock = req.body.stockProducto
    let estadoPoco
    let estadoModerado
    let estadoMucho

    if (stock < 6) {
        estadoPoco = "poco"
        estadoModerado = ""
        estadoMucho = ""
    }
    else {
        if (stock > 5 && stock < 16) {
            estadoPoco = ""
            estadoModerado = "moderado"
            estadoMucho = ""
        }
        else {
            estadoPoco = ""
            estadoModerado = ""
            estadoMucho = "mucho"
        }
    }

    let datos = {
        nombreProducto: nombre,
        stockProducto: stock,
        estadoPoco: estadoPoco,
        estadoModerado: estadoModerado,
        estadoMucho: estadoMucho
    }

    let sql = "INSERT INTO productos SET ?"
    conexion.query(sql, datos, function (err) {
        if (err) throw err;
        let sql2 = "SELECT * FROM productos ORDER BY nombreProducto ASC";
        conexion.query(sql2, function (err, result) {
            if (err) throw err;
            res.render('index', {
                datos: result
            })
        })
    })
})

//Actualizar

app.post('/actualizar', (req, res) => {

    const nombreProducto = req.body.nombre
    const stockProducto = req.body.stock

    let sql = "UPDATE productos SET stockProducto = " + stockProducto + " WHERE nombreProducto = '" +nombreProducto+  "';"
    conexion.query(sql, function (err, result) {
        if (err) throw err;
        let sql2 = "SELECT * FROM productos ORDER BY nombreProducto ASC";
        conexion.query(sql2, function (err, result) {
            if (err) throw err;
            res.render('index', {
                datos: result
            })
        })
    })
    

})

//Eliminar

app.post('/eliminar', (req, res) => {

    const nombreProducto = req.body.producto

    let sql = "DELETE FROM productos WHERE nombreProducto = '" +nombreProducto+  "';"
    conexion.query(sql, function (err, result) {
        if (err) throw err;
        console.log(sql)
        let sql2 = "SELECT * FROM productos ORDER BY nombreProducto ASC";
        conexion.query(sql2, function (err, result) {
            if (err) throw err;
            res.render('index', {
                datos: result
            })
        })
    })

})

// servidor 
app.listen(PORT, () => {
    console.log(`Servidor trabajando en el puerto ${PORT}`);
})
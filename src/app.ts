import express from 'express'
// import cors from 'cors'
// const bodyParser = require("body-parser");

import productRoutes from './routes/products.routes'
import basketRoutes from './routes/basket.routes'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import config from './config'

const app = express()

// settings
app.set( 'port', config.port )

// Middlewares
// app.use(cors())
app.use( morgan( 'dev' ) )
app.use( express.urlencoded( { extended: false } ) )
app.use( cookieParser() )
app.use( express.json() )

// to support URL-encoded bodies
// app.use(bodyParser.urlencoded({ extended: true, limit: "2mb" }));

//💙 https://www.tabnine.com/code/javascript/functions/express/Response/setHeader
//💙 https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)
//💙 https://github.com/samuelcardillo/MMORPGMaker-MV/blob/8aba378aaf1b5ea3a9d4454971b5e40221e905e8/server/mmo.js#L17
app.use( function ( req, res, next ) {
    // cors()
    res.statusCode = 200
    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader( 'Access-Control-Allow-Origin', 'http://localhost:3000' )
    res.setHeader( 'Access-Control-Allow-Credentials', 'true' )

    // res.setHeader( 'Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
    res.setHeader( "Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type, Authorization" )

    // res.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE' )
    res.setHeader( 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE' )

    next()
} )

// Routes
app.use( '/api', productRoutes )
app.use( '/api', basketRoutes )

export default app

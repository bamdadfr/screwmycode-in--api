const createError = require ('http-errors')
const express = require ('express')
const cookieParser = require ('cookie-parser')
const logger = require ('morgan')
const cors = require ('cors')
const { MongoServiceStart } = require ('./mongo-service')
const { AppRoutes } = require ('./app-routes')
const AppExpress = express ()

module.exports.AppExpress = AppExpress

MongoServiceStart ()

AppExpress.use (logger ('dev'))

AppExpress.use (express.json ())

AppExpress.use (express.urlencoded ({ 'extended': false }))

AppExpress.use (cookieParser ())

AppExpress.use (cors ())

AppRoutes (AppExpress)

// catch 404 and forward to error handler
AppExpress.use ((_req, _res, next) => next (createError (404)))

// error handler
AppExpress.use ((err, req, res) => {

    // set locals, only providing error in development
    res.locals.message = err.message

    res.locals.error = req.app.get ('env') === 'development' ? err : {}

    // render the error page
    res.status (err.status || 500)

    res.render ('error')

})

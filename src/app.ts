import createError from 'http-errors'
import express, { Response, Request } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import { MongoServiceStart } from './mongo.service'
import { IError } from './app.types'
import { Routes } from './routes'

export const App = express ()

MongoServiceStart ()

App.use (logger ('dev'))

App.use (express.json ())

App.use (express.urlencoded ({ 'extended': false }))

App.use (cookieParser ())

App.use (cors ())

Routes (App)

// catch 404 and forward to error handler
App.use ((_req, _res, next) => next (createError (404)))

// error handler
App.use ((err: IError, req: Request, res: Response) => {

    // set locals, only providing error in development
    res.locals.message = err.message

    res.locals.error = req.app.get ('env') === 'development' ? err : {}

    // render the error page
    res.status (err.status || 500)

    res.render ('error')

})

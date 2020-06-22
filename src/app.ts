// / <reference path="./declare.ts" />
import createError from 'http-errors'
import express, { Response, Request } from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
// services
import mongooseService from './services/mongo'
// components
import indexRouter from './routes/index'
import youtubeRouter from './routes/youtube'

// init express app
const app = express ()

if (app.get ('env') === 'development') {

    process.env.MONGO_HOST = 'localhost'

    process.env.MONGO_USER = 'root'

    process.env.MONGO_PASSWORD = 'root'

}

// mongo
mongooseService.start ()

// view engine setup
app.set ('views', path.join (__dirname, 'views'))

app.set ('view engine', 'jade')

app.use (logger ('dev'))

app.use (express.json ())

app.use (express.urlencoded ({ 'extended': false }))

app.use (cookieParser ())

app.use (express.static (path.join (__dirname, 'public')))

app.use (cors ())

app.use ('/', indexRouter)

app.use ('/youtube', youtubeRouter)

// catch 404 and forward to error handler
app.use ((req, res, next) => {

    next (createError (404))

})

// error handler
app.use ((err: any, req: Request, res: Response) => {

    // set locals, only providing error in development
    res.locals.message = err.message

    res.locals.error = req.app.get ('env') === 'development' ? err : {}

    // render the error page
    res.status (err.status || 500)

    res.render ('error')

})

export default app

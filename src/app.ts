import createError from 'http-errors'
import express, { Response, Request } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import { MongoServiceStart } from './mongo.service'
import appRoutes from './app.routes'
import youtubeRoutes from './youtube.routes'
import { IError } from './app.types'

// init express app
const app = express ()

// mongo
MongoServiceStart ()

app.use (logger ('dev'))

app.use (express.json ())

app.use (express.urlencoded ({ 'extended': false }))

app.use (cookieParser ())

app.use (cors ())

app.use ('/', appRoutes)

app.use ('/youtube', youtubeRoutes)

// catch 404 and forward to error handler
app.use ((_req, _res, next) => next (createError (404)))

// error handler
app.use ((err: IError, req: Request, res: Response) => {

    // set locals, only providing error in development
    res.locals.message = err.message

    res.locals.error = req.app.get ('env') === 'development' ? err : {}

    // render the error page
    res.status (err.status || 500)

    res.render ('error')

})

export default app

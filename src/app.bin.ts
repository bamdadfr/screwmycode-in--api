#!/usr/bin/env node

import http from 'http'
import Debug from 'debug'
import { App } from './app'
import { IError } from './app.types'

const debug = Debug ('test:server')

const normalizePort = (val: string): string|number|boolean => {

    const port = parseInt (val, 10)

    if (Number.isNaN (port)) {

        // named pipe
        return val
    
    }

    if (port >= 0) {

        // port number
        return port
    
    }

    return false

}

const port = normalizePort (process.env.PORT || '3000')

App.set ('port', port)

const onError = (error: IError): void => {

    if (error.syscall !== 'listen') {

        throw error
 
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {

        case 'EACCES':
            // eslint-disable-next-line no-console
            console.error (bind + ' requires elevated privileges')

            process.exit (1)

            break

        case 'EADDRINUSE':
            // eslint-disable-next-line no-console
            console.error (bind + ' is already in use')

            process.exit (1)

            break

        default:
            throw error
    
    }

}

const server = http.createServer (App)

const onListening = (): void => {

    const addr = server.address ()

    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port

    debug ('Listening on ' + bind)

}

server.listen (port)

server.on ('error', onError)

server.on ('listening', onListening)

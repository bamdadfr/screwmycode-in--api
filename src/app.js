#!/usr/bin/env node

const http = require ('http')
const Debug = require ('debug')
const debug = Debug ('test:server')
const { AppExpress } = require ('./app-express')

// eslint-disable-next-line no-console
console.log ('environment', process.env.NODE_ENV)

const normalizePort = (val) => {

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

AppExpress.set ('port', port)

const onError = (error) => {

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

const server = http.createServer (AppExpress)

const onListening = () => {

    const addr = server.address ()

    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port

    debug ('Listening on ' + bind)

}

server.listen (port)

server.on ('error', onError)

server.on ('listening', onListening)

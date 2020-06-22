import mongoose from 'mongoose'
import chalk from 'chalk'

interface IMongoEnv {
    protocol: string,
    host: string,
    user: string,
    pass: string,
}

const getMongoUrl = (): string => {

    const mongoEnv: IMongoEnv = {
        'protocol': 'mongodb:',
        'host': process.env.MONGO_HOST,
        'user': process.env.MONGO_USER,
        'pass': process.env.MONGO_PASSWORD,
    }

    if (process.env.NODE_ENV !== 'production') {

        mongoEnv.host = 'localhost'

        mongoEnv.user = 'root'

        mongoEnv.pass = 'root'
    
    }

    const r: string = mongoEnv.protocol + '//' + mongoEnv.user + ':' + mongoEnv.pass + '@' + mongoEnv.host

    return r

}

const start = (): void => {

    // init mongoose connection
    const mongoDatabase = getMongoUrl ()

    // mongoose.set ('debug', true)

    mongoose.connect (mongoDatabase, {
        'useNewUrlParser': true,
        'useUnifiedTopology': true,
    }) 
        .catch ((e) => {

            // eslint-disable-next-line no-console
            console.log (chalk.red.bold (e))
            
        })   
    
    const db = mongoose.connection

    // eslint-disable-next-line no-console
    db.on ('error', console.error.bind (console, 'connection error:'))

    db.once ('open', () => {

        // eslint-disable-next-line no-console
        console.log (chalk.blue.bold ('mongo connected'))

    })

}

export default {
    start,
}

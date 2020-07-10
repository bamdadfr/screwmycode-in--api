import mongoose from 'mongoose'
import chalk from 'chalk'
import { getMongoURL } from './mongo.utils'

export const MongooseServiceStart = (): void => {

    if (process.env.NODE_ENV === 'test') return

    // mongoose.set ('debug', true)

    mongoose.connect (getMongoURL (), {
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

export const MongooseServiceStop = (): void => {

    mongoose.connection.close ()

}
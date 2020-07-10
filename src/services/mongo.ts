import mongoose from 'mongoose'
import chalk from 'chalk'
import { getUrl } from './mongo.utils'

const start = (): void => {

    if (process.env.NODE_ENV === 'test') return

    // mongoose.set ('debug', true)

    mongoose.connect (getUrl (), {
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

const stop = (): void => {

    mongoose.connection.close ()

}

export default {
    start,
    stop,
}

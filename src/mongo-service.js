const mongoose = require ('mongoose')
const chalk = require ('chalk')
const { getMongoURL } = require ('./mongo-utils')

/**
 * starts the mongo service
 * @constructor
 */
const MongoServiceStart = () => {

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

module.exports.MongoServiceStart = MongoServiceStart

/**
 * stops the mongo service
 * @constructor
 */
const MongoServiceStop = () => {

    mongoose.connection.close ()

}

module.exports.MongoServiceStop = MongoServiceStop
/**
 * build the mongodb url for querying
 * depends on environment
 * @returns {string}
 */
const getMongoURL = () => {

    const mongoEnv = {
        'protocol': 'mongodb',
        'host': process.env.MONGO_HOST,
        'user': process.env.MONGO_USER,
        'pass': process.env.MONGO_PASSWORD,
    }

    if (process.env.NODE_ENV !== 'production') {

        mongoEnv.host = 'localhost'

        mongoEnv.user = 'root'

        mongoEnv.pass = 'root'

    }

    return mongoEnv.protocol + '://' + mongoEnv.user + ':' + mongoEnv.pass + '@' + mongoEnv.host

}

module.exports.getMongoURL = getMongoURL
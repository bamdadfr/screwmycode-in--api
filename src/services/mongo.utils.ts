import { IMongoEnv } from './mongo.types'

const getUrl = (): string => {

    const mongoEnv: IMongoEnv = {
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

    const r: string = mongoEnv.protocol + '://' + mongoEnv.user + ':' + mongoEnv.pass + '@' + mongoEnv.host

    return r

}

export {
    getUrl,
}
import request from 'supertest'
import mongoose from 'mongoose'
import app from './app'
import { getUrl } from './mongo.utils'

describe ('test route /', () => {

    beforeAll (() => {

        mongoose.connect (getUrl (), {
            'useNewUrlParser': true,
            'useUnifiedTopology': true,
        }) 
    
    })

    afterAll (() => {

        mongoose.disconnect ()
    
    })

    it ('should succeed given /', async () => {

        const response = await request (app).get ('/')

        expect (response.body).toBeTruthy ()

    })

})


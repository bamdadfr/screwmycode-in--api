import request from 'supertest'
import mongoose from 'mongoose'
import app from './app'
import { getMongoURL } from './mongo.utils'

describe ('testing route /', () => {

    beforeAll (() => {

        mongoose.connect (getMongoURL (), {
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


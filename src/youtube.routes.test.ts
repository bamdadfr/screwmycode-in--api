import request from 'supertest'
import mongoose from 'mongoose'
import app from './app'
import { getMongoURL } from './mongo.utils'

describe ('GET /youtube', () => {

    beforeAll (() => {

        mongoose.connect (getMongoURL (), {
            'useNewUrlParser': true,
            'useUnifiedTopology': true,
        }) 
    
    })

    afterAll (() => {

        mongoose.disconnect ()
    
    })

    it ('should succeed given /youtube', async () => {

        const response = await request (app).get ('/youtube')

        expect (response.body).toBeTruthy ()

    })

    it ('should succeed given /youtube/UY6dvVeuzk4', async () => {

        const response = await request (app).get ('/youtube/UY6dvVeuzk4')

        expect (response.body).toBeTruthy ()
    
    })

    it ('should fail given /youtube/UY6dvSDuzK4', async () => {

        const response = await request (app).get ('/youtube/UY6dvSDuzK4')

        expect (response.success).toBeFalsy ()
    
    })

})


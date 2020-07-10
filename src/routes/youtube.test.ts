import request from 'supertest'
import mongoose from 'mongoose'
import app from '../app'
import { getUrl } from '../services/mongo.utils'

describe ('GET /youtube', () => {

    beforeAll (() => {

        mongoose.connect (getUrl (), {
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

})


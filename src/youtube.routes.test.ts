import request from 'supertest'
import mongoose from 'mongoose'
import { App } from './app'
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

    const baseURL = '/youtube/'

    it ('should succeed given /youtube', async () => {

        const response = await request (App).get (baseURL)

        await expect (response.status).toBe (200)

        await expect (response.success).toBeTruthy ()

        await expect (response.body).toBeTruthy ()

    })

    it ('should succeed given /youtube/UY6dvVeuzk4', async () => {

        const id = 'UY6dvVeuzk4'
        const response = await request (App).get (baseURL + id)

        await expect (response.status).toBe (200)

        await expect (response.success).toBeTruthy ()

        await expect (response.body).toBeTruthy ()
    
    })

    it ('should fail given /youtube/UY6dvSDuzK4', async () => {

        const id = 'UY6dvSDuzK4'
        const response = await request (App).get (baseURL + id)

        await expect (response.status).toBe (200)

        await expect (response.success).toBeFalsy ()
    
    })

})


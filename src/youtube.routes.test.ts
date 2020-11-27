import request from 'supertest'
import mongoose from 'mongoose'
import { App } from './app'
import { getMongoURL } from './mongo.utils'

const verifyHeaders = (response: any): void => {

    expect (response.status).toBe (200)

    expect (response.type).toBe ('application/json')

}

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

        verifyHeaders (response)

        expect (response.body).toBeTruthy ()

        expect (response.body.success).toBeTruthy ()

    })

    it ('should succeed given /youtube/UY6dvVeuzk4', async () => {

        const id = 'UY6dvVeuzk4'
        const response = await request (App).get (baseURL + id)

        verifyHeaders (response)

        expect (response.body).toBeTruthy ()

        expect (response.body.success).toBeTruthy ()
    
    })

    it ('should fail given /youtube/UY6dvSDuzK4', async () => {

        const id = 'UY6dvSDuzK4'
        const response = await request (App).get (baseURL + id)

        verifyHeaders (response)

        expect (response.body.success).toBeFalsy ()
    
    })

    it ('should fail given /youtube/badid', async () => {

        const id = 'badid'
        const response = await request (App).get (baseURL + id)

        verifyHeaders (response)

        expect (response.body.success).toBeFalsy ()
    
    })

})


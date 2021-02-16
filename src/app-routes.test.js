const request = require ('supertest')
const mongoose = require ('mongoose')
const { AppExpress } = require ('./app-express')
const { getMongoURL } = require ('./mongo-utils')

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

        const response = await request (AppExpress).get ('/')

        expect (response.status).toBe (200)

        expect (response.type).toBe ('application/json')

        expect (response.body).toBeTruthy ()

        expect (response.body.success).toBeTruthy ()

    })

})


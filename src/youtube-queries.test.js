const mongoose = require ('mongoose')
const { getMongoURL } = require ('./mongo-utils')
const { YoutubeController } = require ('./youtube-controller')
const { YoutubeQueryRead } = require ('./youtube-queries')

describe ('testing youtube queries', () => {

    beforeAll (() => {

        mongoose.connect (getMongoURL (), {
            'useNewUrlParser': true,
            'useUnifiedTopology': true,
        })

    })

    afterAll (() => {

        mongoose.disconnect ()

    })

    // https://www.youtube.com/watch?v=UY6dvVeuzk4
    it ('should succeed creating youtube entry', async done => {

        const response = await YoutubeController ('UY6dvVeuzk4')

        expect (response.success).toBeTruthy ()

        expect (response.title).toBeTruthy ()

        expect (response.url).toBeTruthy ()

        done ()

    })

    it ('should succeed reading youtube entry', async done => {

        const response = await YoutubeQueryRead ('UY6dvVeuzk4')

        expect (response.success).toBeTruthy ()

        done ()

    })

})


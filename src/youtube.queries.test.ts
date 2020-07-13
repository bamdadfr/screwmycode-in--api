import mongoose from 'mongoose'
import { getMongoURL } from './mongo.utils'
import { YoutubeController } from './youtube.controller'
import { IYoutubeControllerResponse } from './youtube.types'
import { YoutubeQueryRead } from './youtube.queries'

describe ('testinging youtube queries', () => {

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

        const response: IYoutubeControllerResponse = await YoutubeController ('UY6dvVeuzk4')

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


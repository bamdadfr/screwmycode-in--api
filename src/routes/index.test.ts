import request from 'supertest'
import app from '../app'

describe ('test path: /', () => {

    it ('should return status 200 given GET request', () => {

        return request (app)
            .get ('/')
            .then ((response: any) => {

                expect (response.statusCode).toBe (200)
            
            })
    
    })

})
import express from 'express'

export const HomeRoutes = express.Router ()

HomeRoutes.get ('/', (_req, res) => {

    res.send ({
        'success': true,
        'message': 'Hello',
    })

})

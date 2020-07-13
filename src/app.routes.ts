import express from 'express'

export const AppRoutes = express.Router ()

AppRoutes.get ('/', (_req, res) => {

    res.send ({
        'success': true,
        'message': 'Hello',
    })

})

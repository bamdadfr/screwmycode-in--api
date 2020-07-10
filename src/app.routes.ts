import express from 'express'

const router = express.Router ()

router.get ('/', (_req, res) => {

    res.send ({
        'success': true,
        'message': 'Hello',
    })

})

export default router

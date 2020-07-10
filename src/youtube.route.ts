import express from 'express'
import { YoutubeController } from './youtube.controller'

const router = express.Router ()

router.get ('/', (req, res) => {

    res.send ({
        'success': true,
        'message': 'Hello /youtube',
    })

})

router.get ('/:id', async (req, res) => {

    const { id } = req.params
    const r = await YoutubeController (id)

    res.send (r)

})

export default router

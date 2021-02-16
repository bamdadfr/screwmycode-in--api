const express = require ('express')
const { YoutubeController } = require ('./youtube-controller')
const YoutubeRoutes = express.Router ()

YoutubeRoutes.get ('/', (_req, res) => {

    res.send ({
        'success': true,
        'message': 'Hello /youtube',
    })

})

YoutubeRoutes.get ('/:id', async (req, res) => {

    const { id } = req.params
    const r = await YoutubeController (id)

    res.send (r)

})

module.exports.YoutubeRoutes = YoutubeRoutes
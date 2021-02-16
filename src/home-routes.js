const express = require ('express')
const HomeRoutes = express.Router ()

HomeRoutes.get ('/', (_req, res) => {

    res.send ({
        'success': true,
        'message': 'Hello',
    })

})

module.exports.HomeRoutes = HomeRoutes
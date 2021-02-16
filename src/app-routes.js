const { HomeRoutes } = require ('./home-routes')
const { YoutubeRoutes } = require ('./youtube-routes')

const AppRoutes = (App) => {

    App.use ('/', HomeRoutes)

    App.use ('/youtube', YoutubeRoutes)

}

module.exports.AppRoutes = AppRoutes
import { App } from './app'
import { AppRoutes } from './app.routes'
import { YoutubeRoutes } from './youtube.routes'

App.use ('/', AppRoutes)

App.use ('/youtube', YoutubeRoutes)


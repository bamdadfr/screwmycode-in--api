import { HomeRoutes } from './home.routes'
import { YoutubeRoutes } from './youtube.routes'

export const Routes = (App: any): void => {

    App.use ('/', HomeRoutes)

    App.use ('/youtube', YoutubeRoutes)
    
}
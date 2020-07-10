// import ytdl from 'ytdl-core'
import { YoutubeQueryCreate, YoutubeQueryRead } from './youtube.queries'
import { isValidID, getExpireDate, getYoutubeRawData } from './youtube.utils'
import { IYoutubeControllerResponse, IYoutubeReadResponse, IYoutubeModel, IYoutubeRawData } from './youtube.types'

export const YoutubeController = async (id: string): Promise<object> => {

    // first, checking if ID provided is OK
    if (isValidID (id)) {
        
        // format of the response to send through the API
        const responseToSend: IYoutubeControllerResponse = {
            'success': null,
            'title': null,
            'url': null,
        }
        
        const responseInDatabase: IYoutubeReadResponse = await YoutubeQueryRead (id)
        
        if (responseInDatabase.success) {

            // if exists in database
            responseToSend.success = true
            
            responseToSend.title = responseInDatabase.data[0].title
            
            responseToSend.url = responseInDatabase.data[0].url
         
            return responseToSend

        }
        
        // if does not exist in database
        const responseToSave: IYoutubeModel = {
            'date': null,
            'expireDate': null,
            'id': null,
            'title': null,
            'url': null,
        }

        // trigger youtubeDL(id)
        const youtubeRawData: IYoutubeRawData = await getYoutubeRawData (id)

        if (youtubeRawData.success === false) return youtubeRawData

        responseToSave.date = Date.now ()

        if (youtubeRawData.isDash) {

            responseToSave.expireDate = parseInt (getExpireDate (youtubeRawData.url, true), 10)

        } else {

            responseToSave.expireDate = parseInt (getExpireDate (youtubeRawData.url, false), 10)

        }

        responseToSave.id = id

        responseToSave.title = youtubeRawData.title

        responseToSave.url = youtubeRawData.url

        YoutubeQueryCreate (responseToSave)

        responseToSend.success = youtubeRawData.success

        responseToSend.title = youtubeRawData.title

        responseToSend.url = youtubeRawData.url

        return responseToSend

    } else {

        return ({
            'success': false,
            'error': 'bad id',
        })

    }

}

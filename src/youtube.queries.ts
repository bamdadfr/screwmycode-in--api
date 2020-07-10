import { YoutubeModel } from './youtube.model'
import { isExisting } from './youtube.utils'
import { IYoutubeModel, IYoutubeReadResponse, IYoutubeRawData } from './youtube.types'

export const YoutubeQueryCreate = (obj: IYoutubeModel): void => {

    const newYoutube = new YoutubeModel (obj)
    
    newYoutube.save ()
    
}

export const YoutubeQueryRead = async (id: string): Promise<IYoutubeReadResponse> => new Promise ((resolve) => {

    const run = async (): Promise<void> => {
    
        const exists = await isExisting (id)
    
        if (exists) {
    
            YoutubeModel
                .find ({
                    id,
                })
                .sort ({
                    'date': 'desc',
                })
                .limit (1)
                .exec (
                    (error: Error, response: IYoutubeRawData) => {
    
                        if (error) throw error
    
                        const dateNow = parseInt (
                            Date.now ()
                                .toString ()
                                .slice (0, 10),
                            10,
                        )
    
                        if (dateNow < response[0].expireDate) {
    
                            resolve ({
                                'success': true,
                                'data': response,
                            })
    
                        } else {
    
                            resolve ({
                                'success': false,
                            })
    
                        }
    
                    })
    
        } else {
    
            resolve ({
                'success': false,
            })
    
        }
    
    }
    
    run ()

})

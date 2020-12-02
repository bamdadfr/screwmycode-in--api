import { YoutubeModel } from './youtube.model'
import { IYoutubeModel, IYoutubeReadResponse } from './youtube.types'
import { YoutubeConstantsErrorQuery } from './youtube.constants'

export const YoutubeQueryExists = async (id: string): Promise<boolean> => {

    const doesExist = await YoutubeModel.exists ({ id })

    return doesExist

}

export const YoutubeQueryCreate = (obj: IYoutubeModel): void => {

    const newYoutube = new YoutubeModel (obj)
    
    newYoutube.save ()
    
}

export const YoutubeQueryRead = async (id: string): Promise<IYoutubeReadResponse> => new Promise (resolve => {

    (async (): Promise<void> => {
    
        const doesExist = await YoutubeQueryExists (id)

        if (!doesExist) return resolve (YoutubeConstantsErrorQuery)
        
        YoutubeModel
            .find ({
                id,
            })
            .sort ({
                'date': 'desc',
            })
            .limit (1)
            .exec (
                // (error: Error, response: IYoutubeInfo) => {
                (error: Error, response: any) => {
    
                    if (error) throw error
    
                    const dateNow = parseInt (
                        Date.now ()
                            .toString ()
                            .slice (0, 10),
                        10,
                    )

                    if (dateNow < response[0].expireDate) {
    
                        return resolve ({
                            'success': true,
                            'data': response,
                        })
    
                    } else {
    
                        return resolve ({
                            'success': false,
                        })
    
                    }
    
                })
    
    }) ()

})

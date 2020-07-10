import mongoose from 'mongoose'
import { isExisting } from './youtube.utils'
import { IYoutubeReadResponse } from './youtube.types'

const YoutubeSchema = new mongoose.Schema ({
    'date': Number,
    'expireDate': Number,
    'id': String,
    'title': String,
    'url': String,
})

export const YoutubeModel = mongoose.model ('Youtube', YoutubeSchema)

export const YoutubeCreate = (obj: void): void => {

    // eslint-disable-next-line new-cap
    const newYoutube = new YoutubeModel (obj)
    
    newYoutube.save ()
    
}

export const YoutubeRead = async (id: string): Promise<IYoutubeReadResponse> => new Promise ((resolve) => {

    const run = async (): Promise<void> => {
    
        const exists = await isExisting (id)
    
        if (exists) {
    
            YoutubeModel.find ({
                id,
            })
                .sort ({
                    'date': 'desc',
                })
                .limit (1)
                .exec ((error: any, response: any) => {
    
                    // eslint-disable-next-line no-console
                    if (error) return console.log (error)
    
                    const dateNow = parseInt (Date.now ()
                        .toString ()
                        .slice (0, 10), 10)
    
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

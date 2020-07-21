import fetch from 'node-fetch'
import parser from 'fast-xml-parser'
import { YoutubeModel } from './youtube.model'
import { IYoutubeInfo } from './youtube.types'

const ytdl = require ('ytdl-core')

export const getExpireDate = (string: string, isDash: boolean): string => {

    if (isDash) {

        const regEx = /expire\/[0-9]{10}/gm

        return regEx.exec (string)[0].replace ('expire/', '')

    }

    const regEx = /expire=[0-9]{10}/gm

    return regEx.exec (string)[0].replace ('expire=', '')

}

export const getYoutubeDashInfo = async (url: string): Promise<string> => new Promise ((resolve, reject) => {

    (async (): Promise<void> => {

        try {

            const response = await fetch (url)
            const text = await response.text ()
    
            const xml = parser.parse (text, {
                'ignoreAttributes': false,
            })
    
            const json = xml
    
            resolve (json.MPD.Period.AdaptationSet[1].Representation.BaseURL)
        
        } catch (error) {

            reject (error)
        
        }
        
    }) ()

    // fetch (url)
    //     .then ((res) => res.text ())
    //     .then ((xml) => parser.parse (xml, {
    //         'ignoreAttributes': false,
    //     }))
    //     .then ((json) => {

    //         resolve (json.MPD.Period.AdaptationSet[1].Representation.BaseURL)

    //     })
    //     .catch ((err) => reject (err))

})

export const getYoutubeInfo = async (id: string): Promise<IYoutubeInfo> => {

    const url = `https://www.youtube.com/watch?v=${id}`

    try {

        const info = await ytdl.getInfo (url, {
            'filter': 'audio',
        })

        const format = ytdl.chooseFormat (info.formats, {
            'quality': '140',
        })

        if (format.isDashMPD) {

            return getYoutubeDashInfo (format.url)
                .then ((r) => ({
                    'success': true,
                    'isDash': true,
                    'title': info.videoDetails.title,
                    'url': r,
                }))
        
        }

        return ({
            'success': true,
            'isDash': false,
            'title': info.videoDetails.title,
            'url': format.url,
        })

    } catch (error) {

        return {
            'success': false,
            error,
        }
    
    }

}

export const isValidID = (id: string): boolean => {

    const regEx = /^([0-9A-Za-z_-]{11})$/

    return regEx.test (id)

}

